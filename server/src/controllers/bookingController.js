const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');

exports.getCheckoutSession = async (req, res, next) => {
  try {
    // Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: 'https://localhost:3000/',
      cancel_url: `https://localhost:3000/tour/${tour.id}`,
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
              images: [`https://www.natours.dev/img/tours/${tour.imageCover}`], // TODO: replace with live project url
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
