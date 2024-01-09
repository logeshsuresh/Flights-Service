const express = require('express');

const { FlightController } = require('../../controllers');
const { FlightMiddlewares } = require('../../middlewares');

const router = express.Router();

// /api/v1/flights POST
router.post('/', 
        FlightMiddlewares.validateCreateRequest,
        FlightController.createFlight);

// /api/v1/flights?trips=MUM-DEL GET
router.get('/', 
        FlightController.getAllFlights);

// /api/v1/flights/:id
router.get('/:id',
        FlightController.getFlight);

// /api/v1/flights/:id
router.patch('/:id',
        FlightController.updateFlight);

module.exports = router;