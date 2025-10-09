import { useEffect, useState } from 'react';
import { Activity, Users, LogIn, LogOut, UserPlus, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ActivityLog {
  id: string;
  user_id: string | null;
  email: string;
  activity_type: 'signup' | 'login' | 'logout';
  status: 'success' | 'failed';
  user_role: string | null;
  session_id: string | null;
  user_agent: string | null;
  device_info: any;
  created_at: string;
}

interface LoginStats {
  user_role: string;
  total_logins: number;
  successful_logins: number;
  failed_logins: number;
  unique_users: number;
  last_activity: string;
}

export default function ActivityLogs() {
  const { user, profile } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<LoginStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'login' | 'signup' | 'logout'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'miner'>('all');

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadActivityLogs();
      loadStats();
    } else {
      setLoading(false);
    }
  }, [profile, filter, roleFilter]);

  const loadActivityLogs = async () => {
    try {
      let query = supabase
        .from('user_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter !== 'all') {
        query = query.eq('activity_type', filter);
      }

      if (roleFilter !== 'all') {
        query = query.eq('user_role', roleFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_user_login_stats');

      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center py-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">
            Only administrators can view activity logs.
          </p>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <LogIn className="w-5 h-5 text-blue-600" />;
      case 'logout':
        return <LogOut className="w-5 h-5 text-gray-600" />;
      case 'signup':
        return <UserPlus className="w-5 h-5 text-green-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRoleBadgeColor = (role: string | null) => {
    if (!role) return 'bg-gray-100 text-gray-800';
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">User Activity Logs</h1>
          <p className="text-gray-600">Monitor user authentication and activity across the system</p>
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.user_role} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">
                      {stat.user_role?.toUpperCase() || 'UNKNOWN'} Users
                    </h3>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stat.unique_users}</p>
                  </div>
                  <Users className="w-10 h-10 text-blue-500" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Logins:</span>
                    <span className="font-semibold">{stat.total_logins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-semibold text-green-600">
                      {((stat.successful_logins / stat.total_logins) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Failed Attempts:</span>
                    <span className="font-semibold text-red-600">{stat.failed_logins}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
            </div>
            <div className="flex gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Activities</option>
                <option value="login">Logins</option>
                <option value="signup">Signups</option>
                <option value="logout">Logouts</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="miner">Miners</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading activity logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No activity logs found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Activity</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Device</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {getActivityIcon(log.activity_type)}
                          <span className="font-medium text-gray-900 capitalize">{log.activity_type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700">{log.email}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(log.user_role)}`}>
                          {log.user_role?.toUpperCase() || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-xs text-gray-600">
                          {log.device_info?.platform && (
                            <div>{log.device_info.platform}</div>
                          )}
                          {log.device_info?.screenResolution && (
                            <div className="text-gray-500">{log.device_info.screenResolution}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-700">
                          {new Date(log.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
