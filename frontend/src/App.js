import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import Loader from './components/Loader';

const MainContainer = styled.main`
  padding: 0 5%;
  max-width: 1600px;
  margin: 0 auto;
`;

const MovieGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding: 4rem 0;
`;

const StatusMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  padding: 4rem 0;
`;

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Set your backend base URL via env var (CRA uses REACT_APP_*)
// Example: REACT_APP_API_BASE=https://<your-api-gateway-domain>
const API_BASE = process.env.https://main.d1vmcm14slsg3d.amplifyapp.com/?.replace(/\/+$/, '') || '';

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = async (query) => {
    setSearchAttempted(true);
    setIsLoading(true);
    setError('');
    setRecommendations([]);

    try {
      const res = await fetch(`${API_BASE}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: query, num_recommendations: 10 }),
      });

      if (!res.ok) {
        // Try to read a JSON error; fallback to text
        let msg = `Request failed (${res.status})`;
        try {
          const j = await res.json();
          msg = j.detail || j.message || msg;
        } catch (_) {
          const t = await res.text();
          if (t) msg = t;
        }
        throw new Error(msg);
      }

      const data = await res.json();
      // Backend returns: { message, recommendations: [tmdbId,...] }
      const items = (data.recommendations || []).map((id) => ({ tmdbId: id }));
      setRecommendations(items);
    } catch (err) {
      setError(err.message || 'Could not fetch recommendations.');
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (error) return <StatusMessage>{error}</StatusMessage>;
    if (recommendations.length > 0) {
      return (
        <MovieGrid variants={gridVariants} initial="hidden" animate="visible">
          {recommendations.map((movie) => (
            <MovieCard key={movie.tmdbId} movie={movie} onClick={handleMovieClick} />
          ))}
        </MovieGrid>
      );
    }
    if (searchAttempted) {
      return <StatusMessage>No recommendations found. Try another movie.</StatusMessage>;
    }
    return null;
  };

  return (
    <>
      <Header />
      <MainContainer>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        {renderContent()}
      </MainContainer>
      <AnimatePresence>
        {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
      </AnimatePresence>
    </>
  );
}

export default App;
