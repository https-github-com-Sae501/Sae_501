"use client";
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useSearchParams } from 'next/navigation'


const Sculpt: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [cellSize, setCellSize] = useState(9);
    const [showOptions, setShowOptions] = useState(true);
    const [isOptionsOpen, setIsOptionsOpen] = useState(true);
    const [canvasEvents, setCanvasEvents] = useState('none');

    const handleOptionClick = (size: number) => {
        setCellSize(size);
        setShowOptions(false);
        setIsOptionsOpen(false);
        setCanvasEvents('auto');
    };
    const searchParams = useSearchParams()
    const name = searchParams.get('name')

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

        function loadHistoriqueCubesFromLocalStorage() {
            const jsonString = localStorage.getItem(name);
            if (jsonString) {
                const historiqueCubes = JSON.parse(jsonString);
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

        function onMouseClick(event) {
          event.preventDefault();

          mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
          mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);

          const intersects = raycaster.intersectObjects(cubes);
          
          if (intersects.length > 0) {
            const selectedCube = intersects[0].object;  

            const cubeInfo = {
                position: selectedCube.position.clone(),
              };
            
            historiqueCubes.push(cubeInfo);
            console.log(historiqueCubes);

            const jsonString = JSON.stringify(historiqueCubes);
            localStorage.setItem('historiqueCubes', jsonString);

            scene.remove(selectedCube);
            cubes.splice(cubes.indexOf(selectedCube), 1);
            deletedCubes.push(selectedCube);
            requestRenderIfNotRequested();
          }
        }
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
  }, [cellSize, canvasEvents]);

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden'}}>
        <div>
            {showOptions && (
            <div style={{ color: 'black' }}>
                Choisissez la taille du cube :
            </div>
            )}
            <div style={{ position: 'absolute', top: '35%', left: '32%' }}>
            {showOptions && (
                <div
                onClick={() => handleOptionClick(4)}
                style={{
                    cursor: 'pointer',
                    marginBottom: '15px',
                    backgroundColor: cellSize === 4 ? 'lightblue' : 'white',
                    padding: '30px',
                    border: '1px solid black',
                    borderRadius: '10px',
                    width: '700px',
                    fontSize: '30px',
                    textAlign: 'center'
                }}
                >
                Petit
                </div>
            )}
            {showOptions && (
                <div
                onClick={() => handleOptionClick(8)}
                style={{
                    cursor: 'pointer',
                    marginBottom: '15px',
                    backgroundColor: cellSize === 8 ? 'lightblue' : 'white',
                    padding: '30px',
                    border: '1px solid black',
                    borderRadius: '10px',
                    fontSize: '30px',
                    textAlign: 'center'
                }}
                >
                Moyen
                </div>
            )}
            {showOptions && (
                <div
                onClick={() => handleOptionClick(16)}
                style={{
                    cursor: 'pointer',
                    backgroundColor: cellSize === 16 ? 'lightblue' : 'white',
                    padding: '30px',
                    border: '1px solid black',
                    borderRadius: '10px',
                    fontSize: '30px',
                    textAlign: 'center'
                }}
                >
                Grand
                </div>
            )}
            </div>
            <button id="undoButton"
            className="absolute top-[3.5rem] left-[4.5rem] px-3 py-2 bg-black text-white rounded-md cursor-pointer select-none"
            >
            LOOKING BACK
            </button>
            <canvas
            className="overflow-y-hidden"
            id="c"
            style={{ width: '100%', height: '100%' }}
            ></canvas>
        </div>
      </div>
  );
};

export default Sculpt;

