import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BingoCardGenerator.css';

const BingoCardGenerator = () => {
    const [playerName, setPlayerName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleNameChange = (e) => {
        setPlayerName(e.target.value);
        if (error) setError(''); // Limpia el error si el usuario comienza a escribir nuevamente
    };

    const generateBingoCard = async () => {
        if (!playerName.trim()) {
            setError('Debe ingresar un nombre para generar el cartón.'); // Mensaje de error si el campo está vacío
            return; // No continúa con la generación del cartón
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/cartons/generar/', { jugador: playerName });
            navigate('/bingo-card-display', { state: response.data });
        } catch (error) {
            console.error(error);
            setError('Error al generar el cartón. Por favor intente nuevamente.');
        }
    };

    return (
        <div className="bingoCardContainer">
            <input
                type="text"
                className="inputText"
                value={playerName}
                onChange={handleNameChange}
                placeholder="Nombre"
            />
            <button className="buttonGenerate" onClick={generateBingoCard}>
                Generar Cartón
            </button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default BingoCardGenerator;
