import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import FeatureCard from './FeatureCard';
import { featureCardsData } from '../../data/featureData';

const SectionWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 1400, // aumenta a largura máxima
  margin: '40px auto',
  boxSizing: 'border-box',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: '#E0E0E0',
  fontSize: '1.2rem',
  marginBottom: theme.spacing(1),
  textAlign: 'left',
  textTransform: 'uppercase',
  opacity: 0.8,
}));

const FeaturesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridTemplateRows: 'repeat(2, 1fr)',
  gap: theme.spacing(1), // Aproxima os cards diminuindo o gap
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'none',
  },
}));

const FeaturesSection = () => {
  return (
    <SectionWrapper>
      <SectionTitle>O BIBLIOPHILE PERMITE QUE VOCÊ...</SectionTitle>
      <FeaturesGrid>
        {featureCardsData.map((feature, index) => (
          <FeatureCard key={index} icon={feature.icon} title={feature.title} />
        ))}
      </FeaturesGrid>
    </SectionWrapper>
  );
};

export default FeaturesSection;