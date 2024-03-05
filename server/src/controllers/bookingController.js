const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const factory = require('./handlerFactory');

exports.getCheckoutSession = async (req, res, next) => {
  try {
    // Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    // Check if the user has already booked this tour
    const booking = await Booking.findOne({
      user: req.user.id,
      tour: req.params.tourId,
    });

    if (booking) {
      return res.status(400).json({
        status: 'fail',
        message: 'Tour already booked by this user!',
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: `${req.get('origin')}/?paymentIntent=succeeded`,
      cancel_url: `${req.get('origin')}/tour/${tour.id}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: tour.price * 100,
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: [
                `https://natours-app-r8rd.onrender.com/public/img/tours/${tour.imageCover}`,
              ],
            },
          },
          quantity: 1,
        },
      ],
    });

    // Session as response
    res.status(200).json({
      status: 'success',
      session,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100;
  await Booking.create({ tour, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send().end();
};

exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
