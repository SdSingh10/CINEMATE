import React from 'react';
import styled from 'styled-components';
import { FaVideo } from 'react-icons/fa';

const HeaderWrapper = styled.header`
  padding: 25px 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-text-primary);
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
`;

const Header = () => (
  <HeaderWrapper>
    <LogoContainer>
      <FaVideo size={28} color="var(--color-accent)" />
      <LogoText>CINEMATE</LogoText>
    </LogoContainer>
  </HeaderWrapper>
);

export default Header;