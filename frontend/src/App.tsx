import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import PortHubs from './pages/PortHubs';
import Warehouses from './pages/Warehouses';
import Shipments from './pages/Shipments';
import RoutesPage from './pages/Routes';
import RouteDefinition from './pages/RouteDefinition';
import ShipmentCreation from './pages/ShipmentCreation';
import ShipmentHistory from './pages/ShipmentHistory';
import RoadFleet from './pages/RoadFleet';
// import AirCargo from './pages/AirCargo';
import RailCargo from './pages/RailCargo';
import Disruptions from './pages/Disruptions';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import AITest from './pages/AITest';
import VulnerabilityAssessment from './pages/VulnerabilityAssessment';
import ShipmentTracking from './pages/ShipmentTracking';
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
          <Route path="vulnerability-assessment" element={<VulnerabilityAssessment />} />
          <Route path="ai-test" element={<AITest />} />
          <Route path="shipment-tracking" element={<ShipmentTracking />} />
          <Route path="shipment-creation" element={<ShipmentCreation />} />
          <Route path="route-definition" element={<RouteDefinition />} />
          <Route path="shipment-history" element={<ShipmentHistory />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="customers" element={<Customers />} />
          <Route path="port-hubs" element={<PortHubs />} />
          <Route path="warehouses" element={<Warehouses />} />
          <Route path="shipments" element={<Shipments />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="road-fleet" element={<RoadFleet />} />
          {/* <Route path="air-cargo" element={<AirCargo />} /> */}
          <Route path="rail-cargo" element={<RailCargo />} />
          <Route path="disruptions" element={<Disruptions />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;