import React from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import './QRCodePage.css';
import botonJugar from '../../assets/boton-jugar.png'; // Importa la imagen

const QRCodePage = () => {
    const qrValue = 'https://prueba-front-chi.vercel.app/generate-bingo-card'; // URL de producción en Vercel
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
