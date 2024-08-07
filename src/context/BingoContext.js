// src/context/BingoContext.js
import React, { createContext, useState } from 'react';

export const BingoContext = createContext();

export const BingoProvider = ({ children }) => {
  const [selectedMusicals, setSelectedMusicals] = useState([]);

  const addSelectedMusical = (musical) => {
    setSelectedMusicals((prevMusicals) => [...prevMusicals, musical]);
  };

  return (
    <BingoContext.Provider value={{ selectedMusicals, addSelectedMusical }}>
      {children}
    </BingoContext.Provider>
  );
};
