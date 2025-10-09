import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserProfile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, role: 'admin' | 'miner', rfid?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const logActivity = async (
    email: string,
    activityType: 'signup' | 'login' | 'logout',
    status: 'success' | 'failed',
    userId?: string,
    userRole?: string
  ) => {
    try {
      const sessionId = crypto.randomUUID();
      const deviceInfo = {
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timestamp: new Date().toISOString(),
      };

      await supabase.rpc('log_user_activity', {
        p_user_id: userId || null,
        p_email: email,
        p_activity_type: activityType,
        p_status: status,
        p_user_role: userRole || null,
        p_session_id: sessionId,
        p_ip_address: null,
        p_user_agent: navigator.userAgent,
        p_device_info: deviceInfo,
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      try {
        await supabase.from('user_activity_log').insert({
          user_id: userId || null,
          email,
          activity_type: activityType,
          status,
          user_role: userRole || null,
          user_agent: navigator.userAgent,
        });
      } catch (fallbackError) {
        console.error('Fallback logging failed:', fallbackError);
      }
    }
  };

  const loadProfile = async (userId: string, isNewLogin: boolean = false) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);

      if (isNewLogin && data?.email) {
        await logActivity(data.email, 'login', 'success', userId, data.role);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        await logActivity(email, 'login', 'failed');
        return { error };
      }

      if (data.user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        await logActivity(email, 'login', 'success', data.user.id, profileData?.role);
      }

      return { error: null };
    } catch (error) {
      await logActivity(email, 'login', 'failed');
      return { error: error as Error };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: 'admin' | 'miner',
    rfid?: string
  ) => {
    try {
      const metadata: Record<string, string> = {
        full_name: fullName,
        role,
      };

      if (role === 'miner' && rfid) {
        metadata.rfid = rfid;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        await logActivity(email, 'signup', 'failed', undefined, role);
        return { error };
      }

      if (data.user) {
        await logActivity(email, 'signup', 'success', data.user.id, role);
      }

      return { error: null };
    } catch (error) {
      await logActivity(email, 'signup', 'failed', undefined, role);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (user?.email && profile?.role) {
      await logActivity(user.email, 'logout', 'success', user.id, profile.role);
    }
    await supabase.auth.signOut();
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
