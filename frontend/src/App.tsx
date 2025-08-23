import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import RiskAssessment from './pages/RiskAssessment';
import Transportation from './pages/Transportation';
import Simulation from './pages/Simulation';
import Infrastructure from './pages/Infrastructure';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="risk-assessment" element={<RiskAssessment />} />
          <Route path="transportation" element={<Transportation />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="infrastructure" element={<Infrastructure />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;