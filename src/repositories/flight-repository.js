const { Sequelize } = require('sequelize');

const CrudRepository = require("./crud-repository");
const { Flight, Airplane, Airport, City } = require('../models');
const db = require('../models');

class FlightRepository extends CrudRepository {
    constructor() {
        super(Flight);
    }

    async getAllFlights(filter, sort) {
        const response = await Flight.findAll({
            where: filter,
            order: sort,
            include: [
                {
                model: Airplane,
                as: 'airplaneDetail',
                required: true
                },
                {
                    model: Airport,
                    required: true,
                    as: 'departureAirport',
                    on : {
                        col1: Sequelize.where(Sequelize.col("Flight.departureAirportId"), "=", Sequelize.col("departureAirport.code"))
                    },
                    include: {
                        model: City,
                        required: true
                    }
                },
                {
                    model: Airport,
                    required: true,
                    as: 'arrivalAirport',
                    on : {
                        col1: Sequelize.where(Sequelize.col("Flight.arrivalAirportId"), "=", Sequelize.col("arrivalAirport.code"))
                    },
                    include: {
                        model: City,
                        required: true
                    }
                }
            ]
        });
        return response;    
    }

    async updateRemainingSeats(flightId, seats, dec = 1) {
        await db.sequelize.query(`SELECT * FROM Flights WHERE Flights.id = ${flightId} FOR UPDATE`);
        const flight = await Flight.findByPk(flightId);
        if (parseInt(dec)) {
            await flight.decrement('totalSeats', {by: seats});
        } else {
            await flight.increment('totalSeats', {by: seats});
        }
        flight.save();
        return flight;
    }
}

module.exports = FlightRepository;