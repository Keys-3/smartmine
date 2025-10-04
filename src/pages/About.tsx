import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function About() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    setTimeout(() => {
      setSubmitMessage('Thank you for contacting us! We will respond to your inquiry within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const teamMembers = [
    {
      name: 'Avnishka Bhardwaj',
      role: 'Team Lead',
      description: '3rd Year B.Tech (C.S.E) student.',
    },
    {
      name: 'Samarth Sharma',
      role: 'Head of Operations',
      description: '3rd Year B.Tech (C.S.E) student.',
    },
    {
      name: 'Piyush Negi',
      role: 'R&D Manager',
      description: '2nd Year B.Tech (I.T) student.',
    },
    {
      name: 'Parth Garg',
      role: 'Hardware Developer',
      description: '3rd Year B.Tech (C.S.E) student.',
    },
    {
      name: 'Shreya Sharma',
      role: 'Marketing Head',
      description: '3rd Year B.Tech (A.I.M.L) student.',
    },
    {
      name: 'Prithvi Singh',
      role: 'Software Developer',
      description: '3rd Year B.Tech (C.S.E) student.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <section className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              About Us
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Dedicated to making mining operations safer through innovative technology
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4">
                At SmartMine, we believe that every miner deserves to return home safely at the end of their shift. Our mission is to leverage cutting-edge technology to create a comprehensive safety monitoring system that protects lives underground.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Founded by a team of engineers, mining professionals, and safety experts, we understand the unique challenges faced in mining operations. Our Smart Kit Mining System represents years of research, development, and field testing.
              </p>
              <p className="text-lg text-gray-700">
                We are committed to continuous innovation, working closely with mining companies and safety organizations to evolve our technology and set new standards for mining safety worldwide.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
                <h3 className="text-4xl font-bold mb-2">10+</h3>
                <p className="text-amber-100">Years Experience</p>
              </div>
              <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl p-6 text-white">
                <h3 className="text-4xl font-bold mb-2">5000+</h3>
                <p className="text-gray-300">Miners Protected</p>
              </div>
              <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl p-6 text-white">
                <h3 className="text-4xl font-bold mb-2">50+</h3>
                <p className="text-gray-300">Mining Sites</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
                <h3 className="text-4xl font-bold mb-2">24/7</h3>
                <p className="text-amber-100">Support Available</p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Safety First</h3>
                <p className="text-gray-600">
                  Every decision we make prioritizes the safety and wellbeing of miners above all else.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We continuously push the boundaries of technology to provide better solutions.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Reliability</h3>
                <p className="text-gray-600">
                  Our systems are built to work flawlessly in the most challenging conditions.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-xl p-6 text-center hover:shadow-xl transition-shadow"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{member.name}</h3>
                  <p className="text-amber-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Get In Touch</h2>
              <p className="text-lg text-gray-700 mb-8">
                Have questions about our Smart Kit Mining System? Want to schedule a demo or discuss implementation at your site? We're here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                    <p className="text-gray-600">contact@smartmine.com</p>
                    <p className="text-gray-600">support@smartmine.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 765-4321</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Office</h3>
                    <p className="text-gray-600">123 Mining Safety Boulevard</p>
                    <p className="text-gray-600">Tech Valley, CA 94025</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
                <h3 className="font-semibold text-slate-900 mb-2">Business Hours</h3>
                <p className="text-gray-700">Monday - Friday: 8:00 AM - 6:00 PM PST</p>
                <p className="text-gray-700">Emergency Support: 24/7</p>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl shadow-xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Send className="w-6 h-6 text-amber-500" />
                  <h3 className="text-2xl font-bold text-slate-900">Contact Form</h3>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
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

                  <div className="mb-5">
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

                  <div className="mb-5">
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="Inquiry about Smart Mining Kit"
                    />
                  </div>

                  <div className="mb-5">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  {submitMessage && (
                    <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">{submitMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-amber-400 mb-2">SmartMine</h3>
            <p className="text-gray-400">Protecting miners with intelligent technology</p>
            <p className="text-gray-500 text-sm mt-4">
              © 2025 Smart Kit Mining System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
