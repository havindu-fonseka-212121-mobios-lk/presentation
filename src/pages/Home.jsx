import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAction } from '../reducers/auth.reducer';
import './Home.css';

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Home Page</h1>
        {user && (
          <div className="user-info">
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Mobile:</strong> {user.mobileNo}</p>
            <p><strong>Role:</strong> {user.userRole?.position}</p>
          </div>
        )}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
