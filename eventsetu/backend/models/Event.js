const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, default: 0 },
    totalSeats: { type: Number, required: true, min: 1 },
    seatsBooked: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

eventSchema.virtual('seatsAvailable').get(function () {
  return this.totalSeats - this.seatsBooked;
});
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
