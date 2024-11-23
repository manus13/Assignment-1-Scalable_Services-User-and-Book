const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    condition: { type: String, required: true },
    availability: { type: Boolean, required: true },
    location: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
