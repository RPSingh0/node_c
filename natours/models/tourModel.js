const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters']
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour should have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // this only points to current doc on NEW document creation
                return val < this.price; // 100 < 200
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }


    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    // for enabling the virtual properties
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

// virtual properties
tourSchema
    .virtual('durationWeeks')
    .get(function () {
        return this.duration / 7;
    });

// Document middleware: runs before the .save() and .create() command
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true});
    // console.log(this);
    next();
});

// Query middleware, in case of find it will not run for queries executed with findOne and others.
// we need to use a regular expression as below to make it work will all

// tourSchema.pre('find', function (next) {
//     this.find({
//         secretTour: {$ne: true}
//     });
//     next();
// });

tourSchema.pre(/^find/, function (next) {
    this.find({
        secretTour: {$ne: true}
    });
    this.start = Date.now();
    next();
})

tourSchema.post(/^find/, function (docs, next) {
    // console.log(`Query took: ${Date.now() - this.start} milliseconds !`);
    // console.log(docs);
    next();
});

// Aggregation middleware
tourSchema.pre('aggregate', function (next) {

    this.pipeline().unshift({$match: {secretTour: {$ne: true}}})

    /*
    [
  { '$match': { ratingsAverage: [Object] } },
  {
    '$group': {
      _id: [Object],
      num: [Object],
      numRatings: [Object],
      avgRating: [Object],
      avgPrice: [Object],
      minPrice: [Object],
      maxPrice: [Object]
    }
  },
  { '$sort': { avgPrice: 1 } }
]

     */
    // console.log(this.pipeline());
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;