const CrudRepository = require("./crud-repository");
const { Flight } = require('../models');

class FlightRepository extends CrudRepository {
    constructor() {
        super(Flight);
    }

    async getAllFlights(filter) {
        try {
            const response = await Flight.findAll({
                where: filter
            });
            return response;
        } catch (error) {
            console.log("******************");
            console.log(error);
            console.log("****************");
        }
        
    }
}

module.exports = FlightRepository;