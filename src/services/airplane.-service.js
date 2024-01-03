const { AirplaneRepository } = require('../repositories');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

const airplaneRepository = new AirplaneRepository();

async function createAirplane(data) {
    try {
        const airplane = await airplaneRepository.create(data);
        return airplane;
    } catch(error) {
        if(error.name == 'SequelizeValidationError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new Airplance object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirplanes() {
    try {
        const airplanes = await airplaneRepository.getAll();
        return airplanes;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getAirplane(data) {
    try {
        const airplane = await airplaneRepository.get(data);
        return airplane;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    createAirplane,
    getAirplanes,
    getAirplane
}
