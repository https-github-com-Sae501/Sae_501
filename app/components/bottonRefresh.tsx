"use client";

import React from 'react';

const BottonRefresh: React.FC = () => {
  const handleClick = () => {
    // Réinitialise la scène en recréant les cubes
    const jsonString = localStorage.getItem('historiqueCubes');
    const historiqueCubes = JSON.parse(jsonString) || [];
    
    

    // Efface les données du localStorage
    localStorage.removeItem('historiqueCubes');
    
    window.location.reload();
  };

  return (
    <button onClick={handleClick} className="fixed top-[3.5rem] left-4 bg-black text-white px-3  py-2 rounded-md cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17 7.98506C16.7554 6.22528 15.9391 4.59472 14.6766 3.34455C13.4142 2.09439 11.7758 1.29398 10.0137 1.06661C8.25159 0.839245 6.46362 1.19754 4.9252 2.0863C3.38678 2.97507 2.18325 4.34499 1.5 5.98506M1 1.98506V5.98506H5M1 9.98506C1.24456 11.7448 2.06093 13.3754 3.32336 14.6256C4.58579 15.8757 6.22424 16.6761 7.98633 16.9035C9.74841 17.1309 11.5364 16.7726 13.0748 15.8838C14.6132 14.995 15.8168 13.6251 16.5 11.9851M17 15.9851V11.9851H13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>
  );
};

export default BottonRefresh;
