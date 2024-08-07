// src/App.js
import React from 'react';
import { BingoProvider } from './context/BingoContext';
import HomePage from './Components/Pages/HomePage';
import BingoCardDisplay from './Components/Pages/BingoCardDisplay';
import QRCodePage from './Components/Pages/QRCodePage';
import BingoCardGenerator from './Components/BingoCardGenerator';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BingoProvider>
      <Router>
        <Routes>
          <Route path="/" element={<QRCodePage />} />
          <Route path="/bingo-card-display" element={<BingoCardDisplay />} />
          <Route path="/generate-bingo-card" element={<BingoCardGenerator />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    </BingoProvider>
  );
}

export default App;