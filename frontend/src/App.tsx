import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import RiskAssessment from './pages/RiskAssessment';
import Suppliers from './pages/Suppliers';
import Analytics from './pages/Analytics';
import Scenarios from './pages/Scenarios';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';
import Alerts from './pages/Alerts';
import CostAnalysis from './pages/CostAnalysis';
import UserManagement from './pages/UserManagement';
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
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="scenarios" element={<Scenarios />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="cost-analysis" element={<CostAnalysis />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;