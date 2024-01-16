import React from 'react';

const Create = () => {
  const handleCreateClick = () => {
    try {
      // Vider l'élément 'historiqueCubes' du local storage
      localStorage.setItem('historiqueCubes', '');
      console.log('historiqueCubes vidé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la suppression de historiqueCubes :', error);
    }
  };

  return (
    <div>
      <button
        className="fixed bottom-[3rem] right-4 bg-black text-white px-[2rem] py-2 rounded-md cursor-pointer select-none"
        onClick={handleCreateClick}
      >
        Create
      </button>
    </div>
  );
};

export default Create;
