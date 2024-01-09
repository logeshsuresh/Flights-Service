const { StatusCodes } = require('http-status-codes');

const { FlightService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

/**
 * POST : /flights 
 * req-body {
                flightNumber: AE 101,
                airplaneId: A320,
                departureAirportId: 1,
                arrivalAirportId: 2,
                departureTime: 12:15:00,
                arrivalTime: 2:45:00,
                price: 2500,
                boardingGate: 5,
                totalSeats: 200
        }
 */
async function createFlight(req, res) {
    try {
        const flight = await FlightService.createFlight({
            flightNumber: req.body.flightNumber,
            airplaneId: req.body.airplaneId,
            departureAirportId: req.body.departureAirportId,
            arrivalAirportId: req.body.arrivalAirportId,
            departureTime: req.body.departureTime,
            arrivalTime: req.body.arrivalTime,
            price: req.body.price,
            boardingGate: req.body.boardingGate,
            totalSeats: req.body.totalSeats
        });
        SuccessResponse.data = flight;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function getAllFlights(req, res) {
    try {
        const flights = await FlightService.getAllFlights(req.query);
        SuccessResponse.data = flights;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function getFlight(req, res) {
    try {
        const flight = await FlightService.getFlight(req.params.id);
        SuccessResponse.data = flight;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

/**
 * PATCH : /flights/:id
 * req-body {data: {seats: 10}}
 */
async function updateFlight(req, res) {
    try {
        const flight = await FlightService.updateFlight(
            req.params.id,
            req.body.data
        );
        SuccessResponse.data = flight;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    createFlight,
    getAllFlights,
    getFlight,
    updateFlight
}