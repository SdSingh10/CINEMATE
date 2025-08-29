import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
`;

const svgVariants = {
  start: { rotate: 0 },
  end: { rotate: 360 },
};

const pathVariants = {
  start: { pathLength: 0, opacity: 0 },
  end: { pathLength: 1, opacity: 1 },
};

const Loader = () => (
  <LoaderContainer>
    <motion.svg
      width="80"
      height="80"
      viewBox="0 0 50 50"
      variants={svgVariants}
      initial="start"
      animate="end"
      transition={{
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
      }}
    >
      <motion.path
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="4"
        d="M25 4 A 21 21 0 0 1 25 46 A 21 21 0 0 1 25 4"
        variants={pathVariants}
        transition={{
          duration: 1.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </motion.svg>
  </LoaderContainer>
);

export default Loader;