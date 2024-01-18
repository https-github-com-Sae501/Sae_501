"use client";
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useSearchParams } from 'next/navigation';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import axios from 'axios';

interface SculptProps {
  toolSize?: number;
}



const Sculpt: React.FC<SculptProps> = ({ toolSize }) => {
  const [cellSize, setCellSize] = useState<number>(0);
  const [showOptions, setShowOptions] = useState(true);
  const [isOptionsOpen, setIsOptionsOpen] = useState(true);
  const [canvasEvents, setCanvasEvents] = useState('none');
  const [historiqueCubes, setHistoriqueCubes] = useState<Array<string | { cellSize: number; }>>(['']);
  const [cubesCreated, setCubesCreated] = useState(false);

  const handleOptionClick = (size: number) => {
    setCellSize(size);
    setShowOptions(false);
    setIsOptionsOpen(false);
    setCanvasEvents('auto');

    const cubeInfo = {
      cellSize: size,
    };

    setHistoriqueCubes([...historiqueCubes, cubeInfo]);
  };
  const searchParams = useSearchParams()
  const name = searchParams.get('name')

  const handleLookingBack = () => {
    const jsonString = localStorage.getItem('historiqueCubes');
    if (jsonString) {
      const historiqueCubesData = JSON.parse(jsonString);

      if (historiqueCubesData.length > 0) {
        historiqueCubesData.pop();

        const updatedJsonString = JSON.stringify(historiqueCubesData);
        localStorage.setItem('historiqueCubes', updatedJsonString);

        setHistoriqueCubes(historiqueCubesData);
      }
    }
  };

  window.addEventListener('beforeunload', () => {
    // Vider l'historique des cubes dans le local storage
    localStorage.removeItem('historiqueCubes');
});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const main = function () {
        const canvas = document.querySelector('#c') as HTMLCanvasElement;
        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        console.log('Avant de définir la position de la caméra :', camera.position);
        console.log(cellSize)
        camera.position.set(-cellSize * 0.8, cellSize * 1.3, -cellSize * 0.8);
        console.log('Après avoir défini la position de la caméra :', camera.position);
        const controls = new OrbitControls(camera, canvas);
        controls.target.set(cellSize / 2, cellSize / 3, cellSize / 2);
        controls.mouseButtons = {
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE, // Activer la rotation avec le bouton droit
        };

        if (!showOptions) {
          handleOptionClick(cellSize);
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#18181b');

        const addLight = function (x: number, y: number, z: number) {
          const color = 0xFFFFFF;
          const intensity = 3;
          const light = new THREE.DirectionalLight(color, intensity);
          light.position.set(x, y, z);
          scene.add(light);
        }

        addLight(-1, 2, 4);
        addLight(1, -1, -2);

        const cell = new Uint8Array(cellSize * cellSize * cellSize);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 'gray' });
        let cubes: THREE.Mesh[] = [];
        const deletedCubes: THREE.Mesh[] = [];

        const areCoordsEqual = (coord1: any, coord2: any) => {
          const equal = coord1.x === coord2.x && coord1.y === coord2.y && coord1.z === coord2.z;
          console.log(`Comparaison des coordonnées (${coord1.x}, ${coord1.y}, ${coord1.z}) et (${coord2.x}, ${coord2.y}, ${coord2.z}) : ${equal}`);
          return equal;
        };
        
        const isObjectWithCoords = (coord: any) => {
          return (
            typeof coord === 'object' &&
            coord !== null &&
            'x' in coord &&
            'y' in coord &&
            'z' in coord &&
            typeof coord.x === 'number' &&
            typeof coord.y === 'number' &&
            typeof coord.z === 'number'
          );
        };
        
        
        const createNewCube = () => {
          try {
            console.log('Création d\'un nouveau cube...');
            const historiqueCubes = JSON.parse(localStorage.getItem('historiqueCubes') || '[]') || [];            

            // Filtrer les éléments invalides de historiqueCubes
            const validCoords = historiqueCubes.filter((coord:any) =>
              isObjectWithCoords(coord)
            );
            console.log(historiqueCubes)
            console.log('Contenu de historiqueCubes après le filtrage :', validCoords);
        
            // Remplir la cellule de cubes
            for (let y = 0; y < cellSize; ++y) {
              for (let z = 0; z < cellSize; ++z) {
                for (let x = 0; x < cellSize; ++x) {
                  const offset = y * cellSize * cellSize + z * cellSize + x;
                  cell[offset] = 1;
        
                  // Vérifier si les coordonnées existent dans historiqueCubes (après le filtrage)
                  const isCubeInHistory = validCoords.some((coord:any) => {
                    if (isObjectWithCoords(coord)) {
                      console.log('Coord dans historiqueCubes :', coord);
                      return areCoordsEqual(coord, { x, y, z });
                    }
                    console.log('Coord invalides dans historiqueCubes :', coord);
                    return false;
                  });

                  // Créer un cube uniquement s'il n'est pas dans historiqueCubes
                  if (cell[offset] && !isCubeInHistory) {
                    console.log(`Vérification avant création - Coords: (${x}, ${y}, ${z}), Historique: ${JSON.stringify(validCoords)}`);
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(x, y, z);
                    scene.add(mesh);
                    cubes.push(mesh);

                    console.log(`Cube at (${x}, ${y}, ${z}) créé`);

                    
                  }
                }
              }
            }
        
            console.log('Cubes created:', cubes);
            console.log('Position de la caméra :', camera.position);


            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            //------------- Fonction au click --------------------------

        const onMouseClick: EventListener = function (event: Event) {
          const mouseEvent = event as MouseEvent; // Convertir l'événement en MouseEvent
          mouseEvent.preventDefault();

          mouse.x = (mouseEvent.clientX / renderer.domElement.clientWidth) * 2 - 1;
          mouse.y = -(mouseEvent.clientY / renderer.domElement.clientHeight) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);

          const intersects = raycaster.intersectObjects(cubes);

          if (intersects.length > 0) {
            const selectedObject = intersects[0].object;
            if (selectedObject instanceof THREE.Mesh) {
              const selectedMesh = selectedObject as THREE.Mesh;

              // Maintenant, vous pouvez accéder aux propriétés spécifiques à Mesh
              const selectedIndex = cubes.indexOf(selectedMesh);

              if (selectedIndex !== -1) {
                const cubeIndexToRemove = selectedIndex;

                // Suppression en fonction de la valeur de toolSize
                switch (toolSize) {
                  case 1:
                    // Supprimer uniquement le bloc cliqué
                    removeSingleCube(cubeIndexToRemove);
                    break;
                  case 2:
                    // Supprimer le bloc cliqué et le bloc à gauche s'il existe
                    removeSingleCube(cubeIndexToRemove);
                    removeSingleCube(cubeIndexToRemove - 1);
                    break;
                  case 4:
                    // Supprimer les blocs autour du bloc cliqué
                    removeBlocksWithinRadius(cubeIndexToRemove, 1);
                    break;
                  // Ajoutez d'autres cas selon les besoins
                  default:
                    break;
                }

                requestRenderIfNotRequested();

                // Enregistrement dans l'historique des cubes après la suppression
                saveToHistoriqueCubes();
              }
            }
          }
        }

        //------------- Restorer un Cube --------------------------
        const restoreDeletedCube = function () {
          if (deletedCubes.length > 0) {
            const cubeToRestore = deletedCubes.pop();
            if (cubeToRestore) {
              scene.add(cubeToRestore);
              cubes.push(cubeToRestore);
              requestRenderIfNotRequested();
            }
          }
        }

        canvas.addEventListener('click', onMouseClick);
        const undoButton = document.querySelector('#undoButton');
        if (undoButton) {
          undoButton.addEventListener('click', restoreDeletedCube);
        } else {
          console.error("L'élément avec l'ID 'undoButton' n'a pas été trouvé dans le document.");
        }
    
          } catch (error) {
            console.error('Erreur lors de la création du nouveau cube :', error);
          }
      };

      const loadHistoriqueCubesFromDatabase = async () => {
        try {
          const selectedCubeName = new URLSearchParams(window.location.search).get('name');
          
          if (selectedCubeName) {
            // Récupérer les données des cubes depuis l'API
            const response = await axios.get(`https://mmi21-01.mmi-limoges.fr/api/sculpts`);
      
            if (response.status !== 200) {
              throw new Error(`Erreur lors du chargement des cubes. Statut : ${response.status}`);
            }
      
            const cubesData = response.data['hydra:member'];
            console.log('Cubes Data:', cubesData);
      
            if (!Array.isArray(cubesData)) {
              throw new Error('cubesData n\'est pas un tableau');
            }
      
            // Charger l'historique actuel depuis le localStorage
            console.log('Avant le chargement initial - localStorage:', localStorage.getItem('historiqueCubes'));
            const historiqueCubes = JSON.parse(localStorage.getItem('historiqueCubes') || '[]') || [];
            console.log('historiqueCubes au chargement :', historiqueCubes);
      
      
            // Rechercher le cube spécifique en fonction du nom dans l'URL
            const selectedCubeInfo = cubesData.find(cubeInfo => cubeInfo.name === selectedCubeName);
      
            if (selectedCubeInfo) {
              selectedCubeInfo.cubeData.forEach((cubeData:any) => {
                // Récupérer la valeur de "s"
                const sValue = cubeData.s;
                console.log('Value of "s":', sValue);
      
                // Si la valeur de "s" existe et est un nombre, appelez handleOptionClick avec la valeur de "s"
                if (typeof sValue === 'number') {
                  handleOptionClick(sValue); // Assurez-vous que cette fonction ferme le pop-up
                }
      
                // Vérifier si les coordonnées du cube existent déjà dans historiqueCubes (en ignorant la taille `s`)
                const coordAlreadyExists = historiqueCubes.some((coord:any) => (
                  coord.x === cubeData.position.x &&
                  coord.y === cubeData.position.y &&
                  coord.z === cubeData.position.z
                ));
      
                if (!coordAlreadyExists) {
                  // Ajouter les coordonnées du cube à l'historique
                  historiqueCubes.push({
                    x: cubeData.position.x,
                    y: cubeData.position.y,
                    z: cubeData.position.z,
                    s: sValue
                  });
      
                  // Afficher `historiqueCubes` après chaque ajout
                  console.log('Après ajout de coordonnée - historiqueCubes :', historiqueCubes);
      
                  // Stocker à nouveau les données dans le localStorage
                  localStorage.setItem('historiqueCubes', JSON.stringify(historiqueCubes));
                }
              });
            } else {
              console.log('Aucune donnée trouvée pour le cube spécifié dans l\'URL');
            }
      
            // Créer un nouveau cube si nécessaire
            createNewCube();
      
            // Afficher le contenu de l'historique après traitement
            console.log('Contenu de historiqueCubes :', historiqueCubes);
      
          } else {
            console.log("Aucun nom de cube dans l'URL. Création d'un nouveau cube");
            createNewCube();
          }
        } catch (error) {
          console.error('Erreur lors du chargement des cubes depuis la base de données :', error);
        }
      };

      
           
        
        // Appeler la fonction pour charger les cubes depuis la base de données
        loadHistoriqueCubesFromDatabase();



        // Fonction pour enregistrer dans l'historique des cubes
        const saveToHistoriqueCubes = function () {
          const historiqueCubesData: { position: THREE.Vector3, s: number }[] = [];
        
          deletedCubes.forEach(cube => {
            const cubeInfo = {
              position: cube.position.clone(),
              s: cellSize,
            };
            historiqueCubesData.push(cubeInfo);
          });
        
          // Récupérer les données existantes dans le stockage local
          const existingDataString = localStorage.getItem('historiqueCubes');
          const existingData = existingDataString ? JSON.parse(existingDataString) : [];
        
          // Filtrer les nouvelles données pour éviter les doublons
          const uniqueHistoriqueCubesData = historiqueCubesData.filter(newCube => {
            return !existingData.some((existingCube:any) => {
              return (
                newCube.position.equals(existingCube.position) &&
                newCube.s === existingCube.s
              );
            });
          });
        
          // Fusionner les données existantes avec les nouvelles données uniques
          const combinedData = [...existingData, ...uniqueHistoriqueCubesData];
        
          // Enregistrer le résultat dans le stockage local
          const jsonString = JSON.stringify(combinedData);
          localStorage.setItem('historiqueCubes', jsonString);
        };

        const removeSingleCube = function (index: number) {
          if (index < cubes.length) {
            const cubeToRemove = cubes[index];
            scene.remove(cubeToRemove);
            cubes.splice(index, 1);
            deletedCubes.push(cubeToRemove);
          }

        }

        const removeBlocksWithinRadius = function (centerIndex: number, radius: number) {
          const centerPosition = cubes[centerIndex].position;
          const cubesToRemoveIndices = [];

          for (let i = 0; i < cubes.length; i++) {
            const cube = cubes[i];
            const distance = centerPosition.distanceTo(cube.position);

            if (distance <= radius) {
              scene.remove(cube);
              deletedCubes.push(cube);
              cubesToRemoveIndices.push(i);
            }
          }

          // Supprime les blocs du tableau cubes après le parcours
          for (const index of cubesToRemoveIndices) {
            cubes.splice(index, 1);
          }
        }

        const resizeRendererToDisplaySize = function () {
          const canvas = renderer.domElement;
          const width = canvas.clientWidth;
          const height = canvas.clientHeight;
          const needResize = canvas.width !== width || canvas.height !== height;
          if (needResize) {
            renderer.setSize(width, height, false);
          }
          return needResize;
        }

        let renderRequested = false;

        const render = function () {
          renderRequested = false;
          if (resizeRendererToDisplaySize()) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
          }
          controls.update();
          renderer.render(scene, camera);
        }

        render();

        const requestRenderIfNotRequested = function () {
          if (!renderRequested) {
            renderRequested = true;
            requestAnimationFrame(render);
          }
        }

        controls.addEventListener('change', requestRenderIfNotRequested);
        window.addEventListener('resize', requestRenderIfNotRequested);
        // }
      }

      main();
    }

  }, [showOptions, cellSize, canvasEvents, toolSize]);



  return (
    <div className="w-full h-full overflow-hidden relative ">
      {showOptions && (
        <div className="text-white backdrop-blur-md absolute inset-0 flex items-center justify-center">
          <div className="p-4 w-96 text-2xl text-center font-semibold">
            Choose the size of the cube:
            <div
              onClick={() => handleOptionClick(4)}
              className={`cursor-pointer mt-4 text-white ${cellSize === 4 ? 'bg-lightblue' : 'bg-black'} p-4 border border-black rounded-md text-2xl text-center`}
            >
              Small
            </div>
            <div
              onClick={() => handleOptionClick(8)}
              className={`cursor-pointer mt-4 text-white ${cellSize === 8 ? 'bg-lightblue' : 'bg-black'} p-4 border border-black rounded-md text-2xl text-center`}
            >
              Medium
            </div>
            <div
              onClick={() => handleOptionClick(16)}
              className={`cursor-pointer mt-4 text-white ${cellSize === 16 ? 'bg-lightblue' : 'bg-black'} p-4 border border-black rounded-md text-2xl text-center`}
            >
              Large
            </div>
          </div>
        </div>
      )}
      <button
        id="undoButton"
        className="absolute top-[3.5rem] left-[4.5rem] px-3 py-2 bg-black text-white rounded-md cursor-pointer select-none"
        onClick={handleLookingBack}
      >
        UNDO
      </button>
      <canvas className="overflow-hidden" id="c" style={{ width: '100vw', height: '100vh' }}></canvas>
    </div>


  );
};

export default Sculpt;

