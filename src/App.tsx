import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ActivityLogs from './pages/ActivityLogs';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'dashboard':
        return <Dashboard />;
      case 'about':
        return <About />;
      case 'activity-logs':
        return <ActivityLogs />;
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'signup':
        return <SignUp onNavigate={setCurrentPage} />;
      default:
        return <Home />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        {currentPage !== 'login' && currentPage !== 'signup' && currentPage !== 'activity-logs' && (
          <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        )}
        {currentPage === 'activity-logs' && (
          <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        )}
        {renderPage()}
      </div>
    </AuthProvider>
  );
}

export default App;
