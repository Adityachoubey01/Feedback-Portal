const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/feedbackDB');

// Schema
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    rating: Number,
    message: String,
    date: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Routes
app.post('/api/feedback', async (req, res) => {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.json({ success: true });
});

app.get('/api/feedback', async (req, res) => {
    const feedbacks = await Feedback.find().sort({ date: -1 });
    res.json(feedbacks);
});

app.delete('/api/feedback/:id', async (req, res) => {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.listen(5000, () => console.log('Server running on port 5000'));
