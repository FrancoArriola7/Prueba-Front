import React from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import './QRCodePage.css';
import botonJugar from '../../assets/boton-jugar.png'; // Importa la imagen

const QRCodePage = () => {
    const localIP = '192.168.0.236'; // Reemplaza esto con tu dirección IP local
    const qrValue = `http://${localIP}:8000/api/generate-bingo-card`;
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/home');
    };

    return (
        <div className="qr-container">
            <div className="qr-code">
                <QRCode value={qrValue} size={330} />
            </div>
            <div className="qr-button-container">
                <img 
                  src={botonJugar} 
                  alt="Jugar" 
                  className="qr-button-image" 
                  onClick={handleGoHome} 
                />
            </div>
        </div>
    );
};

export default QRCodePage;
