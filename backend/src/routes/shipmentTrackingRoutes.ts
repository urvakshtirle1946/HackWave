import { Router } from 'express';
import ShipmentTrackingController from '../controllers/shipmentTrackingController';

const router = Router();
const controller = new ShipmentTrackingController();

// Get all shipments
router.get('/shipments', controller.getAllShipments.bind(controller));

// Get shipment by ID
router.get('/shipments/:id', controller.getShipmentById.bind(controller));

// Get shipments by status
router.get('/shipments/status/:status', controller.getShipmentsByStatus.bind(controller));

// Get shipments by transport mode
router.get('/shipments/mode/:mode', controller.getShipmentsByMode.bind(controller));

// Update shipment location
router.put('/shipments/:shipmentId/location', controller.updateShipmentLocation.bind(controller));

// Get shipment statistics
router.get('/stats', controller.getShipmentStats.bind(controller));

// Search shipments
router.get('/search', controller.searchShipments.bind(controller));

// Get shipments in geographic area
router.get('/area', controller.getShipmentsInArea.bind(controller));

// Get shipment history
router.get('/shipments/:shipmentId/history', controller.getShipmentHistory.bind(controller));

// Simulate movement (for testing)
router.post('/simulate-movement', controller.simulateMovement.bind(controller));

// Real-time updates (Server-Sent Events)
router.get('/real-time', controller.getRealTimeUpdates.bind(controller));

export default router;
