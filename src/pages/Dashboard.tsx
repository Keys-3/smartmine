import { Heart, Wind, MapPin, ThermometerSun, Droplets, AlertTriangle, Loader2, Bell } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, SensorReading } from '../lib/supabase';

interface CriticalAlert {
  minerId: string;
  startTime: number;
  lastAlertTime: number;
  hasAlerted: boolean;
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedMiner, setSelectedMiner] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const criticalAlertsRef = useRef<Map<string, CriticalAlert>>(new Map());
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setError('Please sign in to view the dashboard');
      setLoading(false);
      return;
    }

    loadSensorData();

    const interval = setInterval(() => {
      loadSensorData();
    }, 5000);

    return () => clearInterval(interval);
  }, [user, profile]);

  const checkCriticalCondition = (heartRate: number, airToxicity: number): boolean => {
    return heartRate > 100 || airToxicity > 20;
  };

  const showMedicalAlert = (minerId: string) => {
    const alertMessage = `URGENT: Miner ${minerId} requires IMMEDIATE MEDICAL ATTENTION! Critical condition detected for more than 45 seconds.`;

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('CRITICAL MEDICAL ALERT', {
        body: alertMessage,
        icon: '/alert-icon.png',
        requireInteraction: true,
        tag: `critical-${minerId}`,
      });
    }

    alert(alertMessage);
  };

  const monitorCriticalAlerts = (data: SensorReading[]) => {
    const currentTime = Date.now();
    const criticalAlerts = criticalAlertsRef.current;
    const newActiveAlerts: string[] = [];

    data.forEach((reading) => {
      const isCritical = checkCriticalCondition(reading.heart_rate, reading.air_toxicity);
      const minerId = reading.miner_id;

      if (isCritical) {
        if (!criticalAlerts.has(minerId)) {
          criticalAlerts.set(minerId, {
            minerId,
            startTime: currentTime,
            lastAlertTime: currentTime,
            hasAlerted: false,
          });
        } else {
          const alert = criticalAlerts.get(minerId)!;
          const duration = currentTime - alert.startTime;

          if (duration >= 45000 && !alert.hasAlerted) {
            showMedicalAlert(minerId);
            alert.hasAlerted = true;
            alert.lastAlertTime = currentTime;
          }
        }
        newActiveAlerts.push(minerId);
      } else {
        if (criticalAlerts.has(minerId)) {
          criticalAlerts.delete(minerId);
        }
      }
    });

    setActiveAlerts(newActiveAlerts);
  };

  const loadSensorData = async () => {
    try {
      let query = supabase
        .from('sensor_readings')
        .select('*')
        .order('created_at', { ascending: false });

      if (profile?.role === 'miner' && profile.rfid) {
        query = query.eq('rfid', profile.rfid);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        setSensorData(data);
        monitorCriticalAlerts(data);
      } else {
        generateMockData();
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading sensor data:', err);
      generateMockData();
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockRfids = ['RFID-001', 'RFID-002', 'RFID-003', 'RFID-004', 'RFID-005', 'RFID-006'];
    const zones = ['Zone A', 'Zone B', 'Zone C'];

    const mockData: SensorReading[] = [];

    for (let i = 0; i < 6; i++) {
      const rfid = mockRfids[i];

      if (profile?.role === 'miner' && profile.rfid && profile.rfid !== rfid) {
        continue;
      }

      mockData.push({
        id: `mock-${i + 1}`,
        miner_id: `M-${String(i + 1).padStart(3, '0')}`,
        rfid: rfid,
        heart_rate: Math.floor(Math.random() * 40) + 70,
        air_toxicity: Math.random() * 25,
        zone: zones[i % 3],
        gps_latitude: 40.7128 + (Math.random() * 0.01),
        gps_longitude: -74.0060 - (Math.random() * 0.01),
        temperature: 25 + Math.random() * 10,
        humidity: 55 + Math.random() * 25,
        created_at: new Date().toISOString(),
      });
    }

    setSensorData(mockData);
    monitorCriticalAlerts(mockData);
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center py-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access the dashboard and view sensor data.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading sensor data...</p>
        </div>
      </div>
    );
  }

  const zones = ['all', ...Array.from(new Set(sensorData.map((d) => d.zone)))];
  const filteredData = selectedZone === 'all'
    ? sensorData
    : sensorData.filter((d) => d.zone === selectedZone);

  const getStatusColor = (heartRate: number, airToxicity: number) => {
    if (heartRate > 100 || airToxicity > 20) return 'bg-red-100 border-red-300';
    if (heartRate > 90 || airToxicity > 15) return 'bg-yellow-100 border-yellow-300';
    return 'bg-green-100 border-green-300';
  };

  const getAlertLevel = (heartRate: number, airToxicity: number) => {
    if (heartRate > 100 || airToxicity > 20) return { level: 'Critical', color: 'text-red-600' };
    if (heartRate > 90 || airToxicity > 15) return { level: 'Warning', color: 'text-yellow-600' };
    return { level: 'Normal', color: 'text-green-600' };
  };

  const avgHeartRate = filteredData.length > 0
    ? (filteredData.reduce((sum, d) => sum + d.heart_rate, 0) / filteredData.length).toFixed(1)
    : '0';
  const avgAirToxicity = filteredData.length > 0
    ? (filteredData.reduce((sum, d) => sum + d.air_toxicity, 0) / filteredData.length).toFixed(1)
    : '0';
  const criticalAlerts = filteredData.filter((d) => d.heart_rate > 100 || d.air_toxicity > 20).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Mining Operations Dashboard
              </h1>
              <p className="text-gray-600">
                Real-time monitoring of miner health and environmental conditions
              </p>
            </div>
            {profile && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Viewing as</p>
                <p className="text-lg font-semibold text-slate-900">{profile.full_name}</p>
                <span className="inline-block px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-semibold">
                  {profile.role}
                </span>
                {profile.role === 'miner' && profile.rfid && (
                  <p className="text-xs text-gray-500 mt-1">RFID: {profile.rfid}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">
                {profile?.role === 'admin' ? 'Active Miners' : 'Your Status'}
              </h3>
              <Heart className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{filteredData.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {profile?.role === 'admin' ? 'Currently monitored' : 'Active readings'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Avg Heart Rate</h3>
              <Heart className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{avgHeartRate}</p>
            <p className="text-xs text-gray-500 mt-1">BPM {profile?.role === 'admin' ? 'across team' : 'average'}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Avg Air Toxicity</h3>
              <Wind className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{avgAirToxicity}</p>
            <p className="text-xs text-gray-500 mt-1">PPM average</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Critical Alerts</h3>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{criticalAlerts}</p>
            <p className="text-xs text-gray-500 mt-1">Requiring attention</p>
          </div>
        </div>

        {profile?.role === 'admin' && zones.length > 1 && (
          <div className="mb-6">
            <label htmlFor="zone-filter" className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Zone
            </label>
            <select
              id="zone-filter"
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone === 'all' ? 'All Zones' : zone}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeAlerts.length > 0 && (
          <div className="mb-6 bg-red-600 text-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <Bell className="w-8 h-8" />
              <div>
                <h3 className="text-xl font-bold mb-1">CRITICAL ALERT</h3>
                <p className="text-sm">
                  {activeAlerts.length} miner{activeAlerts.length > 1 ? 's' : ''} in critical condition
                  {activeAlerts.length === 1 ? ` - Miner ${activeAlerts[0]}` : ''}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {filteredData.map((data) => {
            const alert = getAlertLevel(data.heart_rate, data.air_toxicity);
            const isSelected = selectedMiner === data.miner_id;
            const isCritical = activeAlerts.includes(data.miner_id);

            return (
              <div
                key={data.id}
                className={`bg-white rounded-xl shadow-lg border-2 transition-all cursor-pointer ${
                  getStatusColor(data.heart_rate, data.air_toxicity)
                } ${isSelected ? 'ring-4 ring-amber-500' : ''} ${isCritical ? 'animate-pulse' : ''}`}
                onClick={() => setSelectedMiner(isSelected ? null : data.miner_id)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold text-slate-900">
                          Miner {data.miner_id}
                        </h3>
                        {isCritical && (
                          <Bell className="w-6 h-6 text-red-600 animate-bounce" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Last updated: {new Date(data.created_at).toLocaleTimeString()}
                      </p>
                      {data.rfid && (
                        <p className="text-xs text-gray-500">RFID: {data.rfid}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${alert.color}`}>
                        {alert.level}
                      </span>
                      <p className="text-sm text-gray-600">{data.zone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        <span className="text-xs font-semibold text-gray-600">Heart Rate</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">
                        {data.heart_rate.toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500">BPM</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-5 h-5 text-amber-500" />
                        <span className="text-xs font-semibold text-gray-600">Air Toxicity</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">
                        {data.air_toxicity.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">PPM</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ThermometerSun className="w-5 h-5 text-orange-500" />
                        <span className="text-xs font-semibold text-gray-600">Temperature</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">
                        {data.temperature.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">°C</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <span className="text-xs font-semibold text-gray-600">Humidity</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">
                        {data.humidity.toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500">%</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow border border-gray-200 col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-green-500" />
                        <span className="text-xs font-semibold text-gray-600">GPS Location</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {data.gps_latitude.toFixed(4)}, {data.gps_longitude.toFixed(4)}
                      </p>
                      <p className="text-xs text-gray-500">{data.zone}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-2">Additional Details</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className={`ml-2 font-semibold ${alert.color}`}>
                            {alert.level}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Zone:</span>
                          <span className="ml-2 font-semibold text-slate-900">{data.zone}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Miner ID:</span>
                          <span className="ml-2 font-semibold text-slate-900">{data.miner_id}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Device ID:</span>
                          <span className="ml-2 font-semibold text-slate-900">{data.id}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredData.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-600">
              {profile?.role === 'miner'
                ? 'No sensor readings found for your RFID. Please ensure your mining kit is active.'
                : 'No miners are currently active in the selected zone.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
