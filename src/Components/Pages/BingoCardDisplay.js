// src/components/Pages/BingoCardDisplay.js
import React, { useContext, useEffect, useState } from 'react';
import { BingoContext } from '../../context/BingoContext';
import { useLocation } from 'react-router-dom';
import { Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';
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

const BingoCardDisplayContainer = styled('div')(() => ({
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
}));

const UserName = styled(Typography)(() => ({
  color: '#001F54',
  textAlign: 'center',
  position: 'absolute',
  top: '7%',
  width: '100%',
  marginTop: 0,
  fontWeight: 'bold',
}));

const BingoCardDisplay = () => {
  const location = useLocation();
  const { selectedMusicals } = useContext(BingoContext);
  const { jugador, combinacion } = location.state || {};
  const musicalNames = combinacion.split(',');

  const [updatedMusicals, setUpdatedMusicals] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/game/');

    const handleWsMessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.musical) {
        setUpdatedMusicals((prev) => [...prev, data.musical]);
      }
    };

    ws.addEventListener('message', handleWsMessage);

    return () => {
      ws.removeEventListener('message', handleWsMessage);
      ws.close();
    };
  }, []);

  return (
    <BingoCardDisplayContainer>
      <UserName variant="h4" component="h2">
        {jugador.toUpperCase()}
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
