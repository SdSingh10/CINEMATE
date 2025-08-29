import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CardContainer = styled(motion.div)`
  position: relative;
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
`;

const PosterImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const InfoOverlay = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(13, 12, 15, 1) 20%, rgba(13, 12, 15, 0) 100%);
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const MovieCard = ({ movie, onClick }) => {
  return (
    <CardContainer
      layoutId={`card-container-${movie.tmdbId}`}
      variants={cardVariants}
      onClick={() => onClick(movie)}
      whileHover="hover"
      initial="rest"
      animate="rest"
      style={{ perspective: '1000px' }}
    >
      <PosterImage
        src={movie.poster_url}
        alt={movie.title}
        layoutId={`card-image-${movie.tmdbId}`}
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.1 },
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      <InfoOverlay>
        <Title>{movie.title}</Title>
      </InfoOverlay>
    </CardContainer>
  );
};

export default MovieCard;