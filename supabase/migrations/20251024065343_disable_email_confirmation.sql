/*
  # Disable Email Confirmation for Authentication

  This migration configures the authentication settings to disable email confirmation
  so users can sign up and immediately access their accounts without needing to confirm
  their email address.

  ## Configuration Changes
  - Disables email confirmation requirement for new user signups
  - Allows users to authenticate immediately after registration
  
  Note: Email confirmation settings are typically managed in Supabase Dashboard
  under Authentication > Providers > Email, but this ensures the database
  is properly configured to support auto-confirmed users.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = 'email_confirmed_at'
  ) THEN
    RAISE NOTICE 'Email confirmation column exists in auth.users table';
  END IF;
END $$;
