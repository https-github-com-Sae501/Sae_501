"use client";
import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Axios, { AxiosError } from 'axios';
import Link from "next/link";

// Fonction pour décoder le JWT
const parseJwt = (token: string | null): { id?: string } | null => {
  if (!token) {
    return null;
  }

  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

  const decodedToken = JSON.parse(jsonPayload);

  console.log('Contenu brut du token décodé:', decodedToken);

  return decodedToken;
};


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

  type Cube = {
    position: { x: number; y: number; z: number };
    s: number;
  };

  const areCubesEqual = (cube1: Cube, cube2: Cube): boolean => {
    // Comparaison des propriétés position (x, y, z), s et size
    return (
      cube1.position.x === cube2.position.x &&
      cube1.position.y === cube2.position.y &&
      cube1.position.z === cube2.position.z &&
      cube1.s === cube2.s // Comparaison de la propriété 's'
    );
  };

  const handleSave = async () => {
    try {
        // Récupérer le token utilisateur depuis le stockage local
        const authToken = localStorage.getItem('authToken');
        console.log('Token utilisateur:', authToken);

        // Vérifier si le token est manquant
        if (!authToken) {
            console.error('Token utilisateur manquant.');
            alert('Impossible de sauvagarder la sculpture. Veuillez vous connecter.');
            return;
        }

        // Décoder le token
        const decodedToken = parseJwt(authToken);
        console.log('Token décodé:', decodedToken);

        // Vérifier si le décodage du token a échoué
        if (!decodedToken || !decodedToken.id) {
            console.error('Identifiant utilisateur manquant dans le token.');
            alert('Identifiant utilisateur manquant dans le token. Veuillez vous reconnecter.');
            return;
        }

        // Récupérer les données du cube depuis le stockage local
        const jsonString = localStorage.getItem(localStorageName);
        const existingData = jsonString ? JSON.parse(jsonString) : [];
        const historiqueCubes = JSON.parse(localStorage.getItem('historiqueCubes') || '[]');

       // Fusionner les données sans doublons
const mergedDataWithoutDuplicates = [
  ...existingData,
  ...historiqueCubes.filter((newCube: Cube) =>
    !existingData.some((existingCube: Cube) => areCubesEqual(existingCube, newCube))
  )
];

// Afficher les données du cube à envoyer
console.log('Données du cube à envoyer:', {
  cubeData: mergedDataWithoutDuplicates,
  name: localStorageName,
  user: decodedToken.id,
});

        // Envoyer les données au serveur
        const response = await Axios.post(
            'http://127.0.0.1:8000/api/cubes',
            {
                cubeData: mergedDataWithoutDuplicates,
                name: localStorageName,
                user: `/api/users/${decodedToken.id}`,
            },
            {
                headers: {
                    'Content-Type': 'application/ld+json',
                }
            }
        );

        if (response.status === 200) {
            console.log('Données envoyées avec succès');
            console.log(response.data);

            // Effacer les données dans le stockage local
            localStorage.removeItem(localStorageName);
            localStorage.setItem('historiqueCubes', '');
            closePopup();
          }
          alert('Success');
          location.reload()
    } catch (error: any) {
        handleError(error);
    }
  };

  const handleError = (error: AxiosError) => {
    console.error('Erreur lors de l\'envoi des données au serveur :', error);
    if (Axios.isAxiosError(error) && error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error('Erreur côté serveur:', error.response.data);
      alert('Erreur côté serveur. Veuillez réessayer plus tard.');
    } else {
      // Une autre erreur s'est produite
      console.error('Erreur inattendue:', error.message);
      alert('Erreur inattendue. Veuillez réessayer plus tard.');
    }
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
                className="text-black w-full p-2 border border-gray-300 rounded"
                value={localStorageName}
                onChange={handleNameChange}
              />
            </div>

            <div className="mt-4 space-x-2 flex justify-end">

            <Link href="/">
              <button onClick={handleSave} className="bg-black text-white px-3 py-1 rounded cursor-pointer">
                Save
              </button>
            </Link>
              
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
