import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch latest user data
    const fetchUserData = async () => {
      try {
        const data = await authAPI.getCurrentUser();
        setUserData(data.user);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Welcome to Your Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        <div className="user-info">
          <div className="info-item">
            <label>Name:</label>
            <span>{userData?.name || 'Not provided'}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{userData?.email}</span>
          </div>
          <div className="info-item">
            <label>User ID:</label>
            <span>{userData?.id}</span>
          </div>
          {userData?.role && (
            <div className="info-item">
              <label>Role:</label>
              <span className={`role-badge role-${userData.role}`}>
                {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
              </span>
            </div>
          )}
          {userData?.createdAt && (
            <div className="info-item">
              <label>Member Since:</label>
              <span>{new Date(userData.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="dashboard-content">
          <h2>You're successfully logged in!</h2>
          <p>This is your protected dashboard. Only authenticated users can see this page.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

