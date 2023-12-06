"use client";
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useSearchParams } from 'next/navigation'

interface CubeInfo {
  cellSize: number;
}
interface AnotherChildProps {
  infoFromChild: string;
}

const Sculpt: React.FC<AnotherChildProps>  = ({ infoFromChild }) => {0
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(9);
  const [showOptions, setShowOptions] = useState(true);
  const [isOptionsOpen, setIsOptionsOpen] = useState(true);
  const [canvasEvents, setCanvasEvents] = useState('none');
  const [historiqueCubes, setHistoriqueCubes] = useState<CubeInfo[]>([]);

  const handleOptionClick = (size: number) => {
    setCellSize(size);
    setShowOptions(false);
    setIsOptionsOpen(false);
    setCanvasEvents('auto');

    const cubeInfo = {
      cellSize: size,
    };

    setHistoriqueCubes([...historiqueCubes, cubeInfo]);
    console.log(cubeInfo)
    console.log(historiqueCubes)
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
        const canvas = document.querySelector('#c');
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

        canvas.style.pointerEvents = canvasEvents;

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

          if (jsonString) {
            const historiqueCubes = JSON.parse(jsonString);
            const tailles = historiqueCubes.length > 0 ? historiqueCubes[0].taille : null;
            setCellSize(tailles)
            setShowOptions(false)

            historiqueCubes.forEach(cubeInfo => {
              cubes.forEach((cube, index) => {
                if (cube.position.equals(cubeInfo.position)) {
                  scene.remove(cube);
                  cubes.splice(index, 1);
                }
              });
            });
          }
        }
        loadHistoriqueCubesFromLocalStorage();

        //------------- Fonction au click --------------------------
        
        const nombreDeBlocsCassables = infoFromChild; // Vous pouvez changer cette valeur selon vos besoins
        console.log("nomber de bloc"+ infoFromChild)

        function onMouseClick(event) {
        //   const nombreDeBlocsCassables = 1; // Vous pouvez changer cette valeur selon vos besoins
        console.log(nombreDeBlocsCassables)
        event.preventDefault();
        
          mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
          mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);
        
          const intersects = raycaster.intersectObjects(cubes);
        
          if (intersects.length > 0) {
            const selectedCube = intersects[0].object;
        
            const selectedIndex = cubes.indexOf(selectedCube);
        
            if (selectedIndex !== -1) {
              // Retirer le nombre de blocs cassables spécifié
              for (let i = 0; i < nombreDeBlocsCassables; i++) {
                const cubeIndexToRemove = selectedIndex + i;
                if (cubeIndexToRemove < cubes.length) {
                  const cubeToRemove = cubes[cubeIndexToRemove];
                  scene.remove(cubeToRemove);
                  cubes.splice(cubeIndexToRemove, 1);
                  deletedCubes.push(cubeToRemove);
                }
              }
        
              // Mettre à jour l'historique
              const cubeInfo = {
                position: selectedCube.position.clone(),
                taille: cellSize,
              };
              historiqueCubes.push(cubeInfo);
        
              const jsonString = JSON.stringify(historiqueCubes);
              localStorage.setItem('historiqueCubes', jsonString);
        
              requestRenderIfNotRequested();
            }
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

      main();
    }
  }, [showOptions, cellSize, canvasEvents]);

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

