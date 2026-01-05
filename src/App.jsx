import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Home from './pages/HomeV2';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/home" /> : <Login />} 
        />
        <Route 
          path="/home" 
          element={isAuthenticated ? <Home /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
