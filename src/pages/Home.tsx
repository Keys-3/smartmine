import { Shield, Activity, MapPin, Bell, Zap, Users } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    setTimeout(() => {
      setSubmitMessage('Thank you for your feedback! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const features = [
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Real-Time Health Monitoring',
      description: 'Continuous heart rate and vital signs tracking for every miner to ensure their safety.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Air Quality Detection',
      description: 'Advanced sensors detect toxic gases and air quality issues before they become dangerous.',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'GPS Zone Tracking',
      description: 'Precise location tracking across different mining zones for quick emergency response.',
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: 'Instant Alerts',
      description: 'Automatic notifications when health metrics or environmental conditions reach critical levels.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Low Power Consumption',
      description: 'Energy-efficient design ensures long battery life in remote mining locations.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Management',
      description: 'Monitor entire teams from a centralized dashboard with individual and group analytics.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <section className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Smart Kit Mining System
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Revolutionizing mining safety with intelligent wearable technology that monitors health, environment, and location in real-time
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#features"
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Learn More
              </a>
              <a
                href="#feedback"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-slate-900 text-white px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Share Feedback
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Protecting Lives Underground
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                The Smart Kit Mining System is a comprehensive safety solution designed specifically for the mining industry. Our advanced wearable technology combines multiple sensors to provide real-time monitoring of critical health and environmental parameters.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Every miner is equipped with a lightweight, durable kit that continuously tracks heart rate, detects toxic air compounds, monitors environmental conditions, and provides precise GPS location tracking across different mining zones.
              </p>
              <p className="text-lg text-gray-700">
                This data is transmitted to a centralized dashboard where supervisors can monitor the entire team, receive instant alerts for dangerous conditions, and coordinate rapid emergency response when needed.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Key Statistics</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold">99.9%</div>
                  <div className="text-amber-100">System Uptime</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">&lt;1s</div>
                  <div className="text-amber-100">Alert Response Time</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">24/7</div>
                  <div className="text-amber-100">Continuous Monitoring</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">IP67</div>
                  <div className="text-amber-100">Dust & Water Resistant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Safety Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our system provides multiple layers of protection to keep miners safe in challenging environments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to enhanced mining safety
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Equip Miners
              </h3>
              <p className="text-gray-600">
                Each miner wears a compact, lightweight kit with integrated sensors and GPS tracking
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Monitor Data
              </h3>
              <p className="text-gray-600">
                Real-time data streams to the central dashboard showing health metrics and environmental conditions
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Respond Quickly
              </h3>
              <p className="text-gray-600">
                Receive instant alerts and coordinate emergency response with precise location data
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="feedback" className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              We Value Your Feedback
            </h2>
            <p className="text-xl text-gray-600">
              Help us improve by sharing your thoughts and suggestions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8">
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Feedback
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                placeholder="Share your thoughts, suggestions, or questions..."
              />
            </div>

            {submitMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-center">{submitMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-amber-400 mb-2">SmartMine</h3>
            <p className="text-gray-400">
              Protecting miners with intelligent technology
            </p>
            <p className="text-gray-500 text-sm mt-4">
              © 2025 Smart Kit Mining System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
