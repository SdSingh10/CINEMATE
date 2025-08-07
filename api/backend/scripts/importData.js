const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('../src/models/Movie');

dotenv.config({ path: './.env' });

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const MONGODB_URI = process.env.MONGO_URI;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const importMovies = async () => {
  if (!TMDB_API_KEY || !MONGODB_URI) {
    console.error('Missing environment variables. Check your .env file.');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected for script...');

  const movies = [];
  fs.createReadStream('./data/movies_metadata.csv')
    .pipe(csv())
    .on('data', (row) => {
      if (row.id && row.title && row.vote_average && parseFloat(row.vote_average) >= 1 && row.adult === 'False') {
        movies.push(row);
      }
    })
    .on('end', async () => {
      console.log(`CSV file processed. Found ${movies.length} potential movies to import.`);
      
      for (let i = 0; i < movies.length; i++) {
        const movieData = movies[i];
        try {
          const existingMovie = await Movie.findOne({ tmdbId: movieData.id });
          if (existingMovie) {
            console.log(`(${i + 1}/${movies.length}) Skipping: ${movieData.title} (already exists)`);
            continue;
          }

          const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieData.id}?api_key=${TMDB_API_KEY}`);
          const posterPath = tmdbResponse.data.poster_path;

          if (!posterPath) {
            console.log(`(${i + 1}/${movies.length}) Skipping: ${movieData.title} (no poster)`);
            continue;
          }
          
          let genres = [];
          try {
             genres = JSON.parse(movieData.genres.replace(/'/g, '"'));
          } catch(e) { /* Genre parsing can fail, default to empty array */ }

          const movie = new Movie({
            tmdbId: movieData.id,
            title: movieData.title,
            overview: movieData.overview,
            genres: genres,
            poster_url: `https://image.tmdb.org/t/p/w500${posterPath}`,
            release_date: movieData.release_date,
            vote_average: parseFloat(movieData.vote_average),
            vote_count: parseInt(movieData.vote_count, 10),
          });

          await movie.save();
          console.log(`(${i + 1}/${movies.length}) Imported: ${movie.title}`);

          await sleep(50);
        } catch (error) {
          console.error(`(${i + 1}/${movies.length}) Failed for ${movieData.title}: ${error.response ? error.response.statusText : error.message}`);
        }
      }
      
      console.log('Data import script finished!');
      mongoose.disconnect();
    });
};

importMovies().catch(err => console.error('Script execution failed:', err));