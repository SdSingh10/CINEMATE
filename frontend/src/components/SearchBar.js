import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SearchSection = styled.section`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const HeroTitle = styled(motion.h2)`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  letter-spacing: -2px;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-secondary);
  margin-bottom: 3rem;
  max-width: 600px;
`;

const SearchForm = styled(motion.form)`
  position: relative;
  width: 100%;
  max-width: 600px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 20px 70px 20px 30px;
  font-size: 1.2rem;
  border-radius: 50px;
  border: 1px solid var(--color-border);
  background-color: var(--color-glass);
  backdrop-filter: blur(10px);
  color: var(--color-text-primary);
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 0 0 0px var(--color-accent);

  &::placeholder {
    color: var(--color-text-secondary);
  }

  &:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 4px rgba(138, 66, 245, 0.3);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--color-accent-hover);
  }
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <SearchSection>
      <HeroTitle initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        Discover Your Next Favorite Film
      </HeroTitle>
      <HeroSubtitle initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        Provide a movie you love, and our AI will find your next cinematic obsession.
      </HeroSubtitle>
      <SearchForm onSubmit={handleSubmit} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
        <SearchInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., The Matrix, Spirited Away, Parasite..."
          disabled={isLoading}
        />
        {/* This button has type="submit" to reliably trigger the form's onSubmit event */}
        <SearchButton type="submit" disabled={isLoading}>
          <FiSearch size={22} />
        </SearchButton>
      </SearchForm>
    </SearchSection>
  );
};

export default SearchBar;