const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc Create booking request
// @route POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { eventId, seats } = req.body;
    const numSeats = seats || 1;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const seatsAvailable = event.totalSeats - event.seatsBooked;

    if (seatsAvailable < numSeats) {
      return res.status(400).json({
        message: `Only ${seatsAvailable} seats left`,
      });
    }

    const totalAmount = event.price * numSeats;

    // Reserve seats until admin confirms/rejects
    event.seatsBooked += numSeats;
    await event.save();

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      seats: numSeats,
      totalAmount,

      // Payment will be handled after admin confirmation
      paymentStatus: 'pending',
      paymentId: '',

      // Admin will confirm this
      status: 'pending',
    });

    res.status(201).json({
      message: 'Booking request submitted. Waiting for admin confirmation.',
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc Get logged-in user's bookings
// @route GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate('event')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc Cancel a booking
// @route PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        message: 'Already cancelled',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Release reserved seats
    const event = await Event.findById(booking.event);

    if (event) {
      event.seatsBooked = Math.max(
        0,
        event.seatsBooked - booking.seats
      );

      await event.save();
    }

    res.json({
      message: 'Booking cancelled',
      booking,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};