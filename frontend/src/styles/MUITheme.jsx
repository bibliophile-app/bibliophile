import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  spacing: 8,

  palette: {
    // Cores principais da interface
    primary:   { main: '#1C4280' },       // azul profundo
    secondary: { main: '#9CC4E4' },       // azul claro
    background: {
      default: '#2C343F',                // fundo principal (cinza)
      surface: '#14171C',                // fundo de cartões e elementos elevados
      muted:   '#556678',                // elementos neutros, linhas, botões desativados
    },
  
    // Neutros
    neutral: {
      main: '#E9F2F9',                   // quase branco azulado
      secondary: '#FFFFFF',             // branco puro para contraste
    },
  
    // Feedback e mensagens
    error:   { main: '#E83030' },        // vermelho vivo
    warning: { main: '#FF9800' },        // laranja vibrante
    success: { main: '#09DE5A' },        // verde neon
    info:    { main: '#15B48F' },        // ciano equilibrado
  
    // Cores auxiliares
    white:  { main: '#FFFFFF' },
    black:  { main: '#000000' },
    red:    { main: '#E83030' },
    yellow: { main: '#FFD12B' },
    orange: { main: '#FF9800' },
    brown:  { main: '#8E7143' },
    green:  { main: '#09DE5A' },
    cyan:   { main: '#15B48F' },
    purple: { main: '#6762CD' },         // tom frio, combina com o azul
    pink:   { main: '#F73EF6' },
  },
  

  shape: {
    borderRadius: {
      rounded: '50px',
      pill: '20px',
    },

  },


  typography: {
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    allVariants: {
      color: '#E9F2F9',
    },
    h1: {
      fontSize: '2rem',            // maior para impacto
      lineHeight: '2.5rem',
      fontWeight: 800,              // quase bold, mas ainda elegante
    },
    h2: {
      fontSize: '1.75rem',
      lineHeight: '2.25rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.5rem',
      lineHeight: '2rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      lineHeight: '1.75rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: 500,
    },
    p: {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      fontWeight: 400,
    },
    small: {
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontWeight: 400,
    },
    logo: {
      fontFamily: "'Libre Baskerville', serif",
      fontWeight: 600,
      color: '#E9F2F9',
    },    
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          transition: theme.transitions.create(
            ['border-color', 'background-color', 'transform', 'color'],
            { duration: theme.transitions.duration.short }
          ),
          '&:hover': {
            transform: 'scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        }),
      },
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
        color: 'primary',
      },
    },
  },  
});

export default theme;
