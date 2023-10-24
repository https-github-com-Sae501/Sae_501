"use client";
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Sculpt: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      function main() {
        const canvas = document.querySelector('#c');
        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        const cellSize = 8;
        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(-cellSize * 0.8, cellSize * 1.3, -cellSize * 0.8);

        const controls = new OrbitControls(camera, canvas);
        controls.target.set(cellSize / 2, cellSize / 3, cellSize / 2);


        
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
        document.querySelector('#undoButton').addEventListener('click', restoreDeletedCube); // Ajout de l'événement pour le bouton "Retour en arrière"


        function onMouseClick(event) {
          event.preventDefault();

        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(cubes);

        if (intersects.length > 0) {
          const selectedCube = intersects[0].object;
          scene.remove(selectedCube);
          cubes.splice(cubes.indexOf(selectedCube), 1);
          deletedCubes.push(selectedCube); // Ajoutez le cube supprimé au tableau
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
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <button id="undoButton" style={{position:'absolute', top:'60px', left:'10px', padding:'10px 20px', backgroundColor:'black',color:'#fff', border:'none', borderRadius:'5px', cursor:'pointer'}}>LOOKING BACK</button>
      <canvas className="overflow-y-hidden" id="c" style={{ width: '100%', height: '100%' }}></canvas>
    </div>
  );
  
};

export default Sculpt;