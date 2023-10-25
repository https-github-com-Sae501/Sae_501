"use client";

import React, { useState } from 'react';

const Popup: React.FC = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [localStorageName, setLocalStorageName] = useState(''); 
  
  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const handleNameChange = (event) => {
    setLocalStorageName(event.target.value);
  };

  const handleSave = () => {
    if (localStorageName.trim() === '') {
      alert('Veuillez entrer un nom valide.');
      return;
    }
    const jsonString = localStorage.getItem('historiqueCubes');
    localStorage.setItem(localStorageName, jsonString); 

    closePopup();
  };

  return (
    <div>
      <button onClick={openPopup} className="fixed bottom-[3rem] right-4 bg-black text-white px-[2rem] py-2 rounded-md cursor-pointer">
        Save
      </button>

      {isPopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="absolute w-1/3 p-4 rounded-lg shadow-lg bg-gray-400">
            <div className='flex flex-row items-center justify-center gap-4'>
                <h2 className="text-xl font-semibold text-black">Title</h2>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={localStorageName}
                  onChange={handleNameChange}
                />
            </div>
            
            <div className="mt-4 space-x-2 flex justify-end">
                    <a href='/' onClick={handleSave} className="bg-black text-white px-3 py-1 rounded cursor-pointer">
                    Save
                    </a>
              <a onClick={closePopup} className="bg-gray-300 text-gray-600 px-3 py-1 rounded cursor-pointer">
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
