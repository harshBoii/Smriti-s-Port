import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { gsap } from 'gsap';
import Typed from 'typed.js';
import './style.css';

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Load HDRI environment map
new RGBELoader().load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/bambanani_sunset_1k.hdr',function(texture)
{
  const envmap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.environment = envmap;
  texture.dispose();
  pmremGenerator.dispose();

loader.load(
  '/scene.gltf', // Updated path to the model in public directory
  function (gltf) {
    model = gltf.scene;
    // model.position.y = -11; // Move model down by 5 units
    model.scale.set(8, 8, 8); // Increase model size by 50%
    scene.add(model);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('An error occurred loading the model:', error);
  }
);
  });

const loader = new GLTFLoader();
let model = null;

camera.position.z = 10;
camera.position.y = 3;
camera.lookAt(0, 0, 0); // Look at the center of the scene

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas')
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

// Add OrbitControls

// Post processing setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,    // strength
  0.4,    // radius
  0.85    // threshold
);
composer.addPass(bloomPass);

// //Adding A Light
// const backLight = new THREE.PointLight('black', 10);
// backLight.position.set(0, 0, -10); // Behind the model
// scene.add(backLight);

// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// const bloomPass = new UnrealBloomPass(
//   new THREE.Vector2(window.innerWidth, window.innerHeight),
//   0.5, // strength
//   0.4, // radius
//   0.85 // threshold
// );
// composer.addPass(bloomPass);


function animate() {
  requestAnimationFrame(animate);
  
  
  if (model) {
  }
  
  composer.render();
}
animate();

window.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;

  const mouseX = (x / window.innerWidth - 0.5)*Math.PI*0.3 ;
  const mouseY = (y / window.innerHeight - 0.5)*Math.PI*0.15 ;

  gsap.to(model.rotation, {
    x: mouseY,
    y: mouseX,
    duration: 5,
    ease: "power2.out"
  });
});

// Initialize Typed.js
const typed = new Typed('.left', {
  strings: ['A Biochemist', 'A Bioinformatics Specialist', 'A Machine Learning Researcher', 'A Molecular Data Scientist'],
  typeSpeed: 50,
  backSpeed: 50,
  backDelay: 2000,
  loop: true,
  showCursor: true,
  cursorChar: '|',
  fadeOut: true,
  fadeOutClass: 'typed-fade-out',
  fadeOutDelay: 500
});
