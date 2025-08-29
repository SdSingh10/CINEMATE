import React from 'react';
import styled, { keyframes } from 'styled-components';
import MovieCard from './MovieCard';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
  /* Add this animation to the grid itself */
  animation: ${fadeIn} 0.5s ease-out;
`;

// No longer need a separate CardWrapper for animation

const MovieGrid = ({ movies, onCardClick }) => {
  return (
    <Grid>
      {/* The key is now on the MovieCard directly */ }
      {movies.map(movie => (
        <MovieCard 
          key={movie.tmdbId || movie.id} 
          movie={movie} 
          onClick={onCardClick} 
        />
      ))}
    </Grid>
  );
};

export default MovieGrid;