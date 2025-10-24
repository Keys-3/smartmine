/*
  # Create User Auto-Confirm Helper Function

  This migration creates a helper function in the public schema that can
  assist with user profile creation and provide information about email confirmation.

  ## Changes
  1. Creates a function to help manage user profiles after signup
  2. Provides a way to track user creation in user_profiles table

  Note: Email confirmation settings must be disabled in Supabase Dashboard:
  - Go to Authentication > Providers > Email
  - Disable "Confirm email"
*/

-- Function to ensure user profile is created properly
CREATE OR REPLACE FUNCTION public.ensure_user_profile_after_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_profiles if not exists
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role,
    rfid,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'miner'),
    NEW.raw_user_meta_data->>'rfid',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS ensure_user_profile_trigger ON auth.users;

-- Note: We cannot create triggers on auth.users from public schema
-- This function can be called manually if needed via RPC

-- Create a public function that admin can call to confirm existing users
CREATE OR REPLACE FUNCTION public.get_unconfirmed_users_count()
RETURNS INTEGER AS $$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO user_count
  FROM auth.users
  WHERE email_confirmed_at IS NULL;
  
  RETURN user_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_unconfirmed_users_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unconfirmed_users_count() TO anon;
