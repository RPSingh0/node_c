const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {

    console.log(req.query);

    try {

        // Build query
        // 1. Filtering
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(element => delete queryObj[element]);

        /*
        Advanced filtering
        // with mongo db:
        // {difficulty: 'easy', duration: {$gte: 5}}
        // with url:
        // {difficulty: 'easy', duration: {gte: 5}}
        // we have to replace all the sub-objects with their relative mongodb filters...
         */
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryStr))

        // const query = Tour.find(queryObj);
        const query = Tour.find(JSON.parse(queryStr));

        /*
        // await directly and this will give the query result
        // const tours = await Tour.find()
        //     .where('duration').equals(5)
        //     .where('difficulty').equals('easy');

        // console.log(req.requestTime);
         */

        // 2. Sorting



        // Execute query
        const tours = await query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours: tours
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
};

exports.getTour = async (req, res) => {

    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200)
            .json({
                status: 'success',
                data: {
                    tour
                }
            });

    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
}

exports.createTour = async (req, res) => {

    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (error) {
        res.status(400)
            .json({
                status: 'fail',
                message: 'Invalid data sent!'
            });
    }
}

exports.updateTour = async (req, res) => {

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }

}