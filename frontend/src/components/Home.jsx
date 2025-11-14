import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Authentication App</h1>
        <p className="home-subtitle">
          A secure authentication system built with React and Express
        </p>
        <div className="home-buttons">
          <Link to="/login" className="home-button primary">
            Login
          </Link>
          <Link to="/signup" className="home-button secondary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

