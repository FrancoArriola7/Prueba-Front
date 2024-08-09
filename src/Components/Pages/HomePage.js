import React, { useContext, useEffect, useState } from 'react';
import { BingoContext } from '../../context/BingoContext';
import './Home.css';

const HomePage = () => {
  const { addSelectedMusical } = useContext(BingoContext);
  const [currentMusical, setCurrentMusical] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/game/');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.musical) {
        setCurrentMusical(data.musical);
        addSelectedMusical(data.musical);
        setShowModal(true);
        setTimeout(() => setShowModal(false), 5000);
      }
    };

    return () => ws.close();
  }, [addSelectedMusical]);

  const handleSelectOption = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/elegir_musical/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        const newOption = data.musical;
        addSelectedMusical(newOption);
        setCurrentMusical(newOption);
        setShowModal(true);

        // Call the API to update the bingo cards
        await fetch(`${process.env.REACT_APP_API_URL}/actualizar_cartones/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ musical: newOption }),
        });
      } else {
        console.error('Error al seleccionar musical:', data.message);
      }
    } catch (error) {
      console.error('Error al seleccionar musical:', error);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reset`, {
        method: 'POST', // Asume que el endpoint /reset acepta una solicitud POST
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setResetMessage('Juego reiniciado correctamente.');
      } else {
        setResetMessage('Error al reiniciar el juego.');
      }
    } catch (error) {
      console.error('Error al reiniciar el juego:', error);
      setResetMessage('Error al reiniciar el juego.');
    }

    // Mostrar el mensaje por un corto período de tiempo
    setTimeout(() => setResetMessage(''), 3000);
  };

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 5000); // Close after 5 seconds

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [showModal]); // Effect runs when showModal changes

  return (
    <div className="container">
      <button onClick={handleSelectOption} className="button-82-pushable">
        <span className="button-82-shadow"></span>
        <span className="button-82-edge"></span>
        <span className="button-82-front text">JUGAR</span>
      </button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {currentMusical}
          </div>
        </div>
      )}
      <button className="reset-button" onClick={handleReset}>
        Reset
      </button>
      {resetMessage && <p className="reset-message">{resetMessage}</p>}
    </div>
  );
};

export default HomePage;
