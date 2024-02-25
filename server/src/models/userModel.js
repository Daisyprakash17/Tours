const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      unique: true,
      trim: true,
      minlength: 6,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'guide'],
      default: 'user',
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // will never be shown in any output
    },
    confirmPassword: {
      type: String,
      required: [true, 'Confirm Password is required'],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: 'Password and Confirm Password does not match.',
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
userSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'user',
  localField: '_id',
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirm password field
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
