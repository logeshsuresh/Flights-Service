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

// /api/v1/flights/:id GET
router.get('/:id',
        FlightController.getFlight);

// /api/v1/flights/:id PATCH
router.patch('/:id',
        FlightController.updateFlight);

// /api/v1/flights/seats PATC
router.patch('/:id/seats', 
        FlightMiddlewares.validateUpdateSeatsRequest, 
        FlightController.updateSeats);

module.exports = router;