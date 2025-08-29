import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar } from 'react-icons/fi';

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
`;

const ModalWrapper = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  z-index: 1001;
  border-radius: 20px;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
`;

const ModalContent = styled.div`
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PosterContainer = styled(motion.div)`
  flex: 0 0 300px;
  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
    flex: none;
  }
`;

const Poster = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Info = styled(motion.div)`
  padding: 30px;
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 12px;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  margin-bottom: 20px;
`;

const Rating = styled.span`
  color: #f5c518;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Overview = styled.p`
  font-size: 1rem;
  line-height: 1.6;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 1002;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MovieModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <AnimatePresence>
      <Backdrop onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <ModalWrapper layoutId={`card-container-${movie.tmdbId}`} onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}><FiX size={24} /></CloseButton>
          <ModalContent>
            <PosterContainer>
              <Poster layoutId={`card-image-${movie.tmdbId}`} src={movie.poster_url} alt={movie.title} />
            </PosterContainer>
            <Info initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <Title>{movie.title}</Title>
              <Stat>
                <Rating><FiStar /> {movie.vote_average}</Rating>
              </Stat>
              <Overview>{movie.overview}</Overview>
            </Info>
          </ModalContent>
        </ModalWrapper>
      </Backdrop>
    </AnimatePresence>
  );
};

export default MovieModal;