import React from "react";
import Icon from '../assets/icon.svg?react';
import { Typography, Box } from "@mui/material";

const sizeMap = {
  sm: "1.8",
  md: "2.5",
  lg: "3",
};

function Logo({ size = "sm", variant = "full" }) {
  const fontSize = sizeMap[size];
  const iconSize = `calc(${parseFloat(fontSize) + 0.2}rem)`; // Calcular o tamanho do ícone com base no rem

  return (
    <Box display="flex" alignItems="baseline" gap={1}>
      <Icon style={{ height: iconSize, width: iconSize }} />
      {variant === "full" && (
        <Typography
          variant="logo"
          sx={{ fontSize: `${fontSize}rem` }}
        >
          Bibliophile
        </Typography>
      )}
    </Box>
  );
};

export default Logo;