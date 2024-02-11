const Tour = require('./../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getAllTours = async (req, res) => {

    console.log(req.query);

    try {
        // Build Query
        // 1. Filtering
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(element => delete queryObj[element]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryStr))

        let query = Tour.find(JSON.parse(queryStr));

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            console.log(sortBy);
            query = query.sort(sortBy);
            // query = query.sort(req.query.sort);

            // sort, if tied, by second parameter
            // sort('price ratingsAverage')
        } else {
            query = query.sort('-createdAt');
        }

        // Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields); // projecting the fields
        } else {
            // (-) (minus) means excluding a field
            query = query.select('-__v');
        }

        // Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        // page=2&limit=10, 1-10: page 1, 11-20: page 2, 21-30: page 3
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) {
                throw new Error('This page does not exist');
            }
        }

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