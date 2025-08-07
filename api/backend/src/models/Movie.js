const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  overview: { type: String },
  genres: [{ id: Number, name: String }],
  poster_url: { type: String },
  release_date: { type: String },
  vote_average: { type: Number },
  vote_count: { type: Number },
}, {
  timestamps: true
});

movieSchema.index({ title: 'text', overview: 'text' });
const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;