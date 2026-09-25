const Event = require('../models/Event');

// @desc Get all events (with optional search/category/upcoming filter)
// @route GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      filter.category = category;
    }
    let query = Event.find(filter).populate('createdBy', 'name email');
    if (sort === 'price_asc') query = query.sort({ price: 1 });
    else if (sort === 'price_desc') query = query.sort({ price: -1 });
    else query = query.sort({ date: 1 });

    const events = await query;
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single event
// @route GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Create event (admin only)
// @route POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, location, image, price, totalSeats } = req.body;
    if (!title || !description || !date || !time || !location || !totalSeats) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      image,
      price: price || 0,
      totalSeats,
      createdBy: req.user._id,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update event (admin only)
// @route PUT /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    Object.assign(event, req.body);
    const updated = await event.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete event (admin only)
// @route DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
