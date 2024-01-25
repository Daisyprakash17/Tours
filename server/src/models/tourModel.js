const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name is required'],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Tour duration is required'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Max group size is required'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour difficulty is required'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        messages: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val *10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, , 'Tour price is required'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Tour summary is required'],
      minlength: [10, 'Tour summary must have 10 characters min'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Tour description is required'],
      minlength: [10, 'Tour description must have 10 characters min'],
    },
    imageCover: {
      type: String,
      required: [true, 'Tour image cover is required'],
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

const tourModel = mongoose.model('Tour', tourSchema);

module.exports = tourModel;
