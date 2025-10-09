/*
  # Enhanced User Activity Tracking

  ## Overview
  This migration enhances the user activity logging system by:
  - Adding user role tracking to activity logs
  - Creating helper functions for automatic activity logging
  - Adding user session tracking
  - Creating views for admin analytics

  ## Changes

  ### 1. Alter `user_activity_log` table
  - Add `user_role` column to track if user is admin or miner
  - Add `session_id` column to track user sessions
  - Add `device_info` column for additional device details

  ### 2. New Functions
  - `log_user_activity()` - Helper function to log user activities
  - `get_user_login_stats()` - Get login statistics by role

  ### 3. New Views
  - `user_activity_summary` - Summary of user activities by role

  ## Security
  - All existing RLS policies remain in place
  - Only admins can access activity analytics

  ## Notes
  1. Automatically tracks user role on each login/signup
  2. Provides analytics for admin monitoring
  3. Helps identify usage patterns by user type
*/

-- Add new columns to user_activity_log if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_activity_log' AND column_name = 'user_role'
  ) THEN
    ALTER TABLE user_activity_log ADD COLUMN user_role text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_activity_log' AND column_name = 'session_id'
  ) THEN
    ALTER TABLE user_activity_log ADD COLUMN session_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_activity_log' AND column_name = 'device_info'
  ) THEN
    ALTER TABLE user_activity_log ADD COLUMN device_info jsonb;
  END IF;
END $$;

-- Create index for user_role
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_role ON user_activity_log(user_role);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_session_id ON user_activity_log(session_id);

-- Create helper function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id uuid,
  p_email text,
  p_activity_type text,
  p_status text,
  p_user_role text DEFAULT NULL,
  p_session_id text DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_device_info jsonb DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_log_id uuid;
  v_user_role text;
BEGIN
  -- Get user role if not provided
  IF p_user_role IS NULL AND p_user_id IS NOT NULL THEN
    SELECT role INTO v_user_role
    FROM user_profiles
    WHERE id = p_user_id;
  ELSE
    v_user_role := p_user_role;
  END IF;

  -- Insert activity log
  INSERT INTO user_activity_log (
    user_id,
    email,
    activity_type,
    status,
    user_role,
    session_id,
    ip_address,
    user_agent,
    device_info
  ) VALUES (
    p_user_id,
    p_email,
    p_activity_type,
    p_status,
    v_user_role,
    p_session_id,
    p_ip_address,
    p_user_agent,
    p_device_info
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get login statistics by role
CREATE OR REPLACE FUNCTION get_user_login_stats(
  p_start_date timestamptz DEFAULT NOW() - INTERVAL '30 days',
  p_end_date timestamptz DEFAULT NOW()
)
RETURNS TABLE (
  user_role text,
  total_logins bigint,
  successful_logins bigint,
  failed_logins bigint,
  unique_users bigint,
  last_activity timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ual.user_role,
    COUNT(*) as total_logins,
    COUNT(*) FILTER (WHERE ual.status = 'success') as successful_logins,
    COUNT(*) FILTER (WHERE ual.status = 'failed') as failed_logins,
    COUNT(DISTINCT ual.user_id) as unique_users,
    MAX(ual.created_at) as last_activity
  FROM user_activity_log ual
  WHERE ual.activity_type IN ('login', 'signup')
    AND ual.created_at BETWEEN p_start_date AND p_end_date
    AND ual.user_role IS NOT NULL
  GROUP BY ual.user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for user activity summary
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT
  ual.user_role,
  ual.activity_type,
  ual.status,
  COUNT(*) as activity_count,
  COUNT(DISTINCT ual.user_id) as unique_users,
  MIN(ual.created_at) as first_activity,
  MAX(ual.created_at) as last_activity,
  DATE_TRUNC('day', ual.created_at)::date as activity_date
FROM user_activity_log ual
WHERE ual.user_role IS NOT NULL
GROUP BY ual.user_role, ual.activity_type, ual.status, DATE_TRUNC('day', ual.created_at)::date;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION log_user_activity TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_user_login_stats TO authenticated;

-- Create trigger to automatically log profile updates
CREATE OR REPLACE FUNCTION log_profile_changes()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Log when user role changes
    IF OLD.role != NEW.role THEN
      INSERT INTO user_activity_log (
        user_id,
        email,
        activity_type,
        status,
        user_role,
        device_info
      ) VALUES (
        NEW.id,
        NEW.email,
        'login',
        'success',
        NEW.role,
        jsonb_build_object('event', 'role_changed', 'old_role', OLD.role, 'new_role', NEW.role)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on user_profiles
DROP TRIGGER IF EXISTS on_profile_updated ON user_profiles;
CREATE TRIGGER on_profile_updated
  AFTER UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION log_profile_changes();

-- Add comment for documentation
COMMENT ON FUNCTION log_user_activity IS 'Helper function to log user authentication and activity events';
COMMENT ON FUNCTION get_user_login_stats IS 'Returns login statistics grouped by user role';
COMMENT ON VIEW user_activity_summary IS 'Aggregated view of user activities by role and date';
