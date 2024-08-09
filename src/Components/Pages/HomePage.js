import React, { useContext, useEffect, useState } from 'react';
import { BingoContext } from '../../context/BingoContext';
import './Home.css';

const HomePage = () => {
  const { addSelectedMusical } = useContext(BingoContext);
  const [currentMusical, setCurrentMusical] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    </div>
  );
};

export default HomePage;
