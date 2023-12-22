"use client";

import React, { useState, useEffect } from 'react';
import queryString from 'query-string';

const Popup: React.FC = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [localStorageName, setLocalStorageName] = useState('');

  useEffect(() => {
    const { name: sculptureNameFromUrl } = queryString.parse(window.location.search);
    if (sculptureNameFromUrl) {
      setLocalStorageName(sculptureNameFromUrl as string);
    }
  }, []);

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalStorageName(event.target.value);
  };

  const handleSave = () => {
    if (localStorageName.trim() === '') {
      alert('Veuillez entrer un nom valide.');
      return;
    }
  
    const jsonString = localStorage.getItem(localStorageName);
    const existingData = jsonString ? JSON.parse(jsonString) : [];
    const historiqueCubes = JSON.parse(localStorage.getItem('historiqueCubes') || '[]');
  
    const mergedData = [...existingData, ...historiqueCubes];
  
    localStorage.setItem(localStorageName, JSON.stringify(mergedData));
    localStorage.setItem('historiqueCubes', '');
  
    closePopup();
  };
  

  return (
    <div className='text-black'>
      <button onClick={openPopup} className="fixed bottom-[3rem] right-4 bg-black text-white px-[2rem] py-2 rounded-md cursor-pointer">
        Save
      </button>

      {isPopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="absolute w-full lg:w-1/3 md:w-1/2 p-4 rounded-lg shadow-lg bg-gray-400">
            <div className='flex flex-row items-center justify-center gap-4'>
                <h2 className="text-xl font-semibold text-black">Title</h2>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  value={localStorageName}
                  onChange={handleNameChange}
                />
            </div>
            
            <div className="mt-4 space-x-2 flex justify-end">
                    <a href='/' onClick={handleSave} className="bg-black text-white px-3 py-1 rounded cursor-pointer w-1/3 flex justify-center">
                    Save
                    </a>
              <a onClick={closePopup} className="bg-gray-300 text-gray-600 px-3 py-1 rounded cursor-pointer w-1/3 flex justify-center">
                Cancelled
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
