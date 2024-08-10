import React, { useContext, useEffect, useState } from 'react';
import { BingoContext } from '../../context/BingoContext';
import { useLocation } from 'react-router-dom';
import { Typography, Grid } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import backgroundImage1 from '../../assets/Carton.png';

const BingoSquare = styled('div')(({ highlighted }) => ({
  height: '30vw',
  maxHeight: '30vh',
  width: '30vw',
  maxWidth: '30vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: highlighted ? 'rgba(106, 13, 173, 0.7)' : 'rgba(0, 0, 0, 0.5)',
  borderRadius: 8,
  margin: '3vw',
  color: '#FFFFFF',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  cursor: 'default',
  overflow: 'hidden',
  '@media (max-width: 600px)': {
    height: '35vw',
    width: '35vw',
  },
}));

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const BingoMessage = styled('div')`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 5rem;
  color: black;
  animation: ${fadeIn} 2s ease-in-out forwards;
  z-index: 20;
`;

const BingoCardDisplayContainer = styled('div')(({ diffuse }) => ({
  backgroundImage: `url(${backgroundImage1})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh',
  minWidth: '100vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,
  margin: 0,
  boxSizing: 'border-box',
  position: 'relative',
  '&::after': diffuse ? {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
    backdropFilter: 'blur(4px)',
  } : {}
}));

const UserName = styled(Typography)(() => ({
  color: '#001F54',
  textAlign: 'center',
  position: 'absolute',
  top: '7%',
  width: '100%',
  marginTop: 0,
  fontWeight: 'bold',
  zIndex: 15,
}));

const BingoCardDisplay = () => {
  const location = useLocation();
  const { selectedMusicals } = useContext(BingoContext);
  const { jugador, combinacion } = location.state || {};
  const musicalNames = combinacion ? combinacion.split(',') : [];

  const [updatedMusicals, setUpdatedMusicals] = useState([]);
  const [bingo, setBingo] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WS_URL);

    const handleWsMessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.musical) {
        setUpdatedMusicals((prev) => [...prev, data.musical]);
      }
    };

    ws.addEventListener('message', handleWsMessage);

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.removeEventListener('message', handleWsMessage);
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (musicalNames.every((musical) => selectedMusicals.includes(musical) || updatedMusicals.includes(musical))) {
      setBingo(true);
    }
  }, [selectedMusicals, updatedMusicals, musicalNames]);

  return (
    <BingoCardDisplayContainer diffuse={bingo}>
      {bingo && <BingoMessage>BINGO!</BingoMessage>}
      <UserName variant="h4" component="h2">
        {jugador ? jugador.toUpperCase() : 'Jugador'}
      </UserName>
      <Grid container justifyContent="center" alignItems="center" spacing={0}>
        {musicalNames.map((musical, index) => (
          <Grid item key={index}>
            <BingoSquare highlighted={selectedMusicals.includes(musical) || updatedMusicals.includes(musical)}>
              <Typography variant="h6" component="div">
                {musical}
              </Typography>
            </BingoSquare>
          </Grid>
        ))}
      </Grid>
    </BingoCardDisplayContainer>
  );
};

export default BingoCardDisplay;
