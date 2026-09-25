const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

// @desc Admin dashboard stats
// @route GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();

    const totalUsers = await User.countDocuments({
      role: 'user',
    });

    const totalBookings = await Booking.countDocuments({
      status: 'confirmed',
    });

    const revenueAgg = await Booking.aggregate([
      {
        $match: {
          status: 'confirmed',
          paymentStatus: 'paid',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    const recentBookings = await Booking.find({
      status: 'confirmed',
    })
      .populate('event', 'title')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalEvents,
      totalUsers,
      totalBookings,
      totalRevenue,
      recentBookings,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// @desc Get all bookings for a specific event
// @route GET /api/admin/events/:id/bookings
exports.getEventBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      event: req.params.id,
    })
      .populate('user', 'name email')
      .populate('event', 'title');

    res.json(bookings);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// @desc Get all pending bookings
// @route GET /api/admin/bookings/pending
exports.getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: 'pending',
    })
      .populate('user', 'name email')
      .populate(
        'event',
        'title date time location price'
      )
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// @desc Confirm booking and send email
// @route PUT /api/admin/bookings/:id/confirm
exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate(
        'event',
        'title date time location price'
      );

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    if (booking.status === 'confirmed') {
      return res.status(400).json({
        message: 'Booking already confirmed',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        message: 'Booking is cancelled',
      });
    }

    // Confirm booking
    booking.status = 'confirmed';

    // No real payment gateway yet
    booking.paymentStatus = 'pending';

    await booking.save();

    // Send confirmation email using Brevo
    try {
      const emailResponse = await fetch(
        'https://api.brevo.com/v3/smtp/email',
        {
          method: 'POST',

          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
          },

          body: JSON.stringify({
            sender: {
              name:
                process.env.EMAIL_FROM_NAME ||
                'EventSetu',

              email: process.env.EMAIL_USER,
            },

            to: [
              {
                email: booking.user.email,
                name: booking.user.name || 'User',
              },
            ],

            subject: `Booking Confirmed - ${booking.event.title}`,

            htmlContent: `
              <div
                style="
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  max-width: 600px;
                  margin: auto;
                "
              >

                <h2>🎉 Booking Confirmed!</h2>

                <p>
                  Hello ${booking.user.name || 'User'},
                </p>

                <p>
                  Your booking has been confirmed by
                  the EventSetu admin.
                </p>

                <h3>Event Details</h3>

                <p>
                  <strong>Event:</strong>
                  ${booking.event.title}
                </p>

                <p>
                  <strong>Date:</strong>
                  ${booking.event.date || 'As scheduled'}
                </p>

                <p>
                  <strong>Time:</strong>
                  ${booking.event.time || 'As scheduled'}
                </p>

                <p>
                  <strong>Location:</strong>
                  ${booking.event.location || 'Event venue'}
                </p>

                <p>
                  <strong>Seats:</strong>
                  ${booking.seats}
                </p>

                <p>
                  <strong>Total Amount:</strong>
                  ₹${booking.totalAmount}
                </p>

                <hr />

                <p>
                  Thank you for using
                  <strong>EventSetu</strong>.
                </p>

                <p>
                  See you at the event! 🎵
                </p>

              </div>
            `,
          }),
        }
      );

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
        throw new Error(
          emailData.message ||
          'Brevo email failed'
        );
      }

      console.log(
        'Confirmation email sent successfully:',
        emailData.messageId
      );

    } catch (emailError) {
      console.error(
        'Email sending failed:',
        emailError.message
      );

      return res.json({
        message:
          'Booking confirmed, but email could not be sent.',
        booking,
      });
    }

    // Final success response
    res.json({
      message:
        'Booking confirmed and email sent successfully.',
      booking,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};