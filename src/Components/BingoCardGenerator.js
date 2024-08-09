import React, { useState } from 'react';
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
            const response = await fetch('http://127.0.0.1:8000/api/cartons/generar/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jugador: playerName }),
            });

            if (!response.ok) {
                throw new Error('Error al generar el cartón.');
            }

            const data = await response.json();
            navigate('/bingo-card-display', { state: data });
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
