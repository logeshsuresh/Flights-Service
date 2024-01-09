const { StatusCodes } = require('http-status-codes');
const { FlightRepository } = require('../repositories');
const { Op } = require('sequelize');
const AppError = require('../utils/errors/app-error');
const { compareTime } = require('../utils/helpers/datetime-helper');


const flightRepository = new FlightRepository();

async function createFlight(data) {
    try {
        if (!compareTime(data.arrivalTime, data.departureTime)) {
            throw new AppError('Departure time should be lesser than arrival time', StatusCodes.BAD_REQUEST);
        }
        const flight = await flightRepository.create(data);
        return flight;
    } catch(error) {
        if(error.name == 'SequelizeValidationError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        console.log(error);
        throw new AppError('Cannot create a new Flight object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllFlights(query) {
    let customFilter = {};
    let sortFilter = [];
    const endingTripTime = "23:59:00";
    if (query.trips) {
        [departureAirportId, arrivalAirportId] = query.trips.split('-');
        customFilter.departureAirportId = departureAirportId;
        customFilter.arrivalAirportId = arrivalAirportId;
    }
    if (query.price) {
        [minPrice, maxPrice] = query.price.split('-');
        customFilter.price = {
            [Op.between] : [minPrice, (maxPrice === undefined) ? 20000 : maxPrice]
        }
    }
    if (query.totalSeats) {
        totalSeats = query.totalSeats;
        customFilter.totalSeats = {
            [Op.gte] : [totalSeats]
        }
    }
    if (query.tripDate) {
        customFilter.departureTime = {
            [Op.between] : [query.tripDate, query.tripDate + endingTripTime]
        }
    }
    if (query.sort) {
        const params = query.sort.split(',');
        const sortFilters = params.map((param) => param.split('_'));
        sortFilter = sortFilters;
    }
    try {
        const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
        return flights;
    } catch (error) {
        console.log(error);
        throw new AppError('Cannot fetch data of all the flights', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getFlight(id) {
    try {
        const flight = await flightRepository.get(id);
        return flight;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError('The flight you requested is not present', error.statusCode);
        }
        throw new AppError('Cannot fetch data of all the flights', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateFlight(id, data) {
    try {
        const flight = await flightRepository.update(id, data);
        return flight;
    } catch (error) {
        console.log(error);
        if (error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError('The flight you requested is not present', error.statusCode); 
        }
        throw new AppError('Cannot update the flights', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateSeats(data) {
    try {
        const response = await flightRepository.updateRemainingSeats(data.flightId, data.seats, data.dec);
        return response;
    } catch (error) {
        console.log(error);
        throw new AppError('Cannot update the seats of flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createFlight,
    getAllFlights,
    getFlight,
    updateFlight,
    updateSeats
}