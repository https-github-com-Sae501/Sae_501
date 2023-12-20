"use client";
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useSearchParams } from 'next/navigation';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface CubeInfo {
  cellSize: number;
}
interface SculptProps {
  toolSize?: number;
}

const Sculpt: React.FC<SculptProps> = ({ toolSize }) => {
  // const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState<number>(0);
  const [showOptions, setShowOptions] = useState(true);
  const [isOptionsOpen, setIsOptionsOpen] = useState(true);
  const [canvasEvents, setCanvasEvents] = useState('none');
  const [historiqueCubes, setHistoriqueCubes] = useState([]);
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      function main() {
        const canvasElement = document.querySelector('#c');
        if (canvasElement instanceof HTMLCanvasElement || canvasElement instanceof OffscreenCanvas) {
          const canvas = canvasElement;

          const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
          const fov = 75;
          const aspect = window.innerWidth / window.innerHeight;
          const near = 0.1;
          const far = 1000;
          const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
          camera.position.set(-cellSize * 0.8, cellSize * 1.3, -cellSize * 0.8);
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
          scene.background = new THREE.Color('lightblue');

          function addLight(x, y, z) {
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
          const cubes = [];
          const deletedCubes = [];

          // Code de création des cubes
          for (let y = 0; y < cellSize; ++y) {
            for (let z = 0; z < cellSize; ++z) {
              for (let x = 0; x < cellSize; ++x) {
                const offset = y * cellSize * cellSize + z * cellSize + x;
                cell[offset] = 1;
              }
            }
          }

          for (let y = 0; y < cellSize; ++y) {
            for (let z = 0; z < cellSize; ++z) {
              for (let x = 0; x < cellSize; ++x) {
                const offset = y * cellSize * cellSize + z * cellSize + x;
                const block = cell[offset];
                if (block) {
                  const mesh = new THREE.Mesh(geometry, material);
                  mesh.position.set(x, y, z);
                  scene.add(mesh);
                  cubes.push(mesh);
                }
              }
            }
          }


          const raycaster = new THREE.Raycaster();
          const mouse = new THREE.Vector2();

          canvas.addEventListener('click', onMouseClick);
          document.querySelector('#undoButton').addEventListener('click', restoreDeletedCube);
          const historiqueCubes = [];

          //------------- Ouvrir Sculpture --------------------------

          function loadHistoriqueCubesFromLocalStorage() {
            const jsonString = localStorage.getItem(name);
            const jsonStringHistoriqueCubes = localStorage.getItem('historiqueCubes');

            const historiqueCubes = JSON.parse(jsonString);
            const historiqueCubesFromStorage = jsonStringHistoriqueCubes ? JSON.parse(jsonStringHistoriqueCubes) : [];

            if (!Array.isArray(historiqueCubes)) {
              console.error('historiqueCubes is not an array:', historiqueCubes);
              return;
            }

            const combinedHistoriqueCubes = [...historiqueCubes, ...historiqueCubesFromStorage];

            const tailles = combinedHistoriqueCubes.length > 0 ? combinedHistoriqueCubes[0].s : null;
            setCellSize(tailles);
            setShowOptions(false);

            combinedHistoriqueCubes.forEach(cubeInfo => {
              cubes.forEach((cube, index) => {
                if (cube.position.equals(cubeInfo.position)) {
                  scene.remove(cube);
                  cubes.splice(index, 1);
                }
              });
            });
          }

          loadHistoriqueCubesFromLocalStorage();

          //------------- Fonction au click --------------------------

          function onMouseClick(event) {
            event.preventDefault();

            mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(cubes);

            if (intersects.length > 0) {
              const selectedCube = intersects[0].object;
              const selectedIndex = cubes.indexOf(selectedCube);

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

          // Fonction pour enregistrer dans l'historique des cubes
          function saveToHistoriqueCubes() {
            const historiqueCubesData = [];

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

            // Fusionner les données existantes avec les nouvelles données
            const combinedData = [...existingData, ...historiqueCubesData];

            // Enregistrer le résultat dans le stockage local
            const jsonString = JSON.stringify(combinedData);
            localStorage.setItem('historiqueCubes', jsonString);

          }

          function removeSingleCube(index) {
            if (index < cubes.length) {
              const cubeToRemove = cubes[index];
              scene.remove(cubeToRemove);
              cubes.splice(index, 1);
              deletedCubes.push(cubeToRemove);
            }

          }

          function removeBlocksWithinRadius(centerIndex, radius) {
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


          //------------- Restorer un Cube --------------------------
          function restoreDeletedCube() {
            if (deletedCubes.length > 0) {
              const cubeToRestore = deletedCubes.pop();
              scene.add(cubeToRestore);
              cubes.push(cubeToRestore);
              requestRenderIfNotRequested();
            }
          }
          function resizeRendererToDisplaySize(renderer) {
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

          function render() {
            renderRequested = undefined;
            if (resizeRendererToDisplaySize(renderer)) {
              const canvas = renderer.domElement;
              camera.aspect = canvas.clientWidth / canvas.clientHeight;
              camera.updateProjectionMatrix();
            }
            controls.update();
            renderer.render(scene, camera);
          }

          render();

          function requestRenderIfNotRequested() {
            if (!renderRequested) {
              renderRequested = true;
              requestAnimationFrame(render);
            }
          }

          controls.addEventListener('change', requestRenderIfNotRequested);
          window.addEventListener('resize', requestRenderIfNotRequested);
        }
      }

      main();
    }

  }, [showOptions, cellSize, canvasEvents, toolSize]);



  return (
    <div className="w-full h-full overflow-hidden relative ">
      {showOptions && (
        <div className="text-black backdrop-blur-md absolute inset-0 flex items-center justify-center">
          <div className="p-4 w-96 text-2xl text-center font-semibold">
            Choisissez la taille du cube :
            <div
              onClick={() => handleOptionClick(4)}
              className={`cursor-pointer mt-4 ${cellSize === 4 ? 'bg-lightblue' : 'bg-white'} p-4 border border-black rounded-md text-2xl text-center`}
            >
              Petit
            </div>
            <div
              onClick={() => handleOptionClick(8)}
              className={`cursor-pointer mt-4 ${cellSize === 8 ? 'bg-lightblue' : 'bg-white'} p-4 border border-black rounded-md text-2xl text-center`}
            >
              Moyen
            </div>
            <div
              onClick={() => handleOptionClick(16)}
              className={`cursor-pointer mt-4 ${cellSize === 16 ? 'bg-lightblue' : 'bg-white'} p-4 border border-black rounded-md text-2xl text-center`}
            >
              Grand
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
      <canvas className="overflow-hidden" id="c" style={{ width: '100%', height: '100%' }}></canvas>
    </div>


  );
};

export default Sculpt;

