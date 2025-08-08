const express = require('express');
const axios = require('axios');
const Movie = require('../models/Movie');
const router = express.Router();

// The address of our future Python ML service
const ML_SERVICE_URL = '/api/ml-service/recommend';

router.get('/', async (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).json({ msg: 'A movie title query parameter is required.' });
  }

  try {
    // --- Primary Method: Call the Python ML Service ---
    console.log(`Forwarding recommendation request for "${title}" to ML service...`);
    const mlResponse = await axios.post(ML_SERVICE_URL, { title });
    const recommendedMovieIds = mlResponse.data.recommendations; // Expecting a list of tmdbIds

    // Fetch full movie details from our DB for the recommended IDs
    const recommendations = await Movie.find({ tmdbId: { $in: recommendedMovieIds } });
    
    // The ML service might return IDs in order, but MongoDB find doesn't guarantee order.
    // We can re-order them here if needed.
    const orderedRecommendations = recommendedMovieIds.map(id => recommendations.find(m => m.tmdbId == id));

    res.json(orderedRecommendations);

  } catch (error) {
    // --- Fallback Method: Use Simple Genre-Based Logic ---
    console.warn('ML service call failed or is unavailable. Using fallback genre-based recommendation.');
    
    // This code runs if the Python server is down or returns an error
    try {
      const likedMovie = await Movie.findOne({ title: { $regex: new RegExp(title, 'i') } });
      if (!likedMovie) return res.status(404).json({ msg: 'Movie not found in database.' });

      const likedMovieGenreIds = likedMovie.genres.map(g => g.id);
      const recommendations = await Movie.find({
        'genres.id': { $in: likedMovieGenreIds },
        '_id': { $ne: likedMovie._id },
        'vote_average': { $gte: 6.0 }, // Only recommend decent movies
        'vote_count': { $gte: 100 }    // With enough votes to be credible
      })
      .sort({ vote_average: -1 })
      .limit(12);

      res.json(recommendations);
    } catch (fallbackError) {
      console.error(`Fallback logic failed: ${fallbackError.message}`);
      res.status(500).send('Server Error');
    }
  }
});

module.exports = router;