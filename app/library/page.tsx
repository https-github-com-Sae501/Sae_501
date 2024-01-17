"use client";
import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import Header from '../components/header';
import Footer from '../components/footer';
import BottonCreate from '../components/bottonCreate';
import Link from 'next/link';
import Axios, { AxiosError } from 'axios';
import jwt from 'jsonwebtoken';

interface Cube {
  name: string;
  user: string; // Utilisez "user" ici pour correspondre à votre base de données
  id: number; // Utilisez "id" ici si c'est le champ dans votre token
  cubeData: any[];
}

const LibraryPage = () => {
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [selectedCube, setSelectedCube] = useState<THREE.Mesh | null>(null);
  const [scene, setScene] = useState<THREE.Scene>(new THREE.Scene());

  // Fonction pour extraire l'ID d'une URL utilisateur
  const getUserIdFromUrl = (userUrl: string) => {
    const segments = userUrl.split('/');
    return parseInt(segments[segments.length - 1], 10);
  };

  const getFullCubeData = async (cubeId: number) => {
    try {
      localStorage.removeItem('historiqueCubes');
      const response = await Axios.get(`http://127.0.0.1:8000/api/cubes/${cubeId}`);
      const fullCubeData = response.data;
      console.log('Full Cube Data:', fullCubeData);
      // Utilisez les données complètes du cube comme nécessaire
    } catch (error) {
      console.error('Error fetching full cube data:', error);
    }
  };
  

  useEffect(() => {
    const fetchCubes = async () => {
      try {
        // Obtenez le token de l'utilisateur connecté depuis le local storage
        const userToken = localStorage.getItem('authToken') || '';
        console.log('Token récupéré depuis le local storage:', userToken);
    
        // Utilisez jsonwebtoken pour décoder le token et extraire l'ID utilisateur
        const decodedToken = jwt.decode(userToken) as { id: number } | null;
        const userIdFromToken = decodedToken ? decodedToken.id : null;
        console.log('ID utilisateur extrait du token:', userIdFromToken);
    
        // Mettez à jour l'état avec l'ID de l'utilisateur connecté
        setLoggedInUserId(userIdFromToken);
    
        // Si l'ID de l'utilisateur est disponible, récupérez les cubes
        if (userIdFromToken) {
          const response = await Axios.get('http://127.0.0.1:8000/api/cubes');
          console.log('Réponse de la requête API:', response.data);
    
          const allCubes = response.data['hydra:member'];
          console.log('Tous les cubes de la réponse API:', allCubes);
    
          // Filtrer les cubes par user
          const userCubes = allCubes.filter((cube: Cube) => getUserIdFromUrl(cube.user) === userIdFromToken);
          console.log('Cubes filtrés par user:', userCubes);
    
          // Mettre à jour l'état avec les cubes filtrés
          setCubes(userCubes);
        }
      } catch (error: any) {
        if (Axios.isAxiosError(error)) {
          console.error('Erreur lors de la récupération des cubes :', error.message);
        } else {
          console.error('Erreur inconnue lors de la récupération des cubes :', error);
        }
      }
    };

    fetchCubes();
  }, [loggedInUserId]);  // Assurez-vous d'inclure toutes les dépendances nécessaires

  return (
    <div className="bg-white h-screen w-screen color-foreground">
      <Header />
      <h1 className="text-black text-4xl font-bold p-4 pt-12">Library</h1>
      <ul className='px-8 grid grid-cols-6 max-w-screen max-h-full gap-3'>
        {Array.isArray(cubes) && cubes.length > 0 ? (
          cubes.map((cube, index) => (
            <li className='text-black' key={index} onClick={() => getFullCubeData(cube.id)}>
              <Link href={`/sculpt?name=${cube.name}`}>
                <div className='flex flex-col items-center'>
                  <img src="../sculptureBase.PNG" alt="SculptureDeBase" width={250} height={250} />
                  <p>{cube.name}</p>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p className='text-black'>No cube available</p>
        )}
      </ul>
      <Link href='./sculpt'><BottonCreate></BottonCreate></Link>
      <Footer />
    </div>
  );
};

export default LibraryPage;
