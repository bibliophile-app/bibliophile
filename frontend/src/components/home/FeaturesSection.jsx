import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material';
import FeatureCard from './FeatureCard';
import { featureCardsData } from '../../data/featureData';


const SectionWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: '1px auto',
  padding: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: '#E0E0E0',
  fontSize: '1rem',
  marginBottom: theme.spacing(1),
  textAlign: 'left',
  opacity: 0.8,
}));

const FeaturesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridTemplateRows: 'repeat(2, 1fr)',
  gap: theme.spacing(1), // Aproxima os cards diminuindo o gap

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