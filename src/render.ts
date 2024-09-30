import * as THREE from 'three';
import { Controls } from './controls';
import { RenderOptions } from './renderOptions';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { DebugHelper } from './debugHelper';

export { RenderOptions } from './renderOptions';
export { Controls } from './controls';

export class Render
{
   private readonly webGL: THREE.WebGLRenderer;
   private readonly controls: Controls;
   private readonly camera: THREE.PerspectiveCamera;
   private readonly assetsPath: string;
   private scene: THREE.Scene;

   constructor(options: RenderOptions, position: THREE.Vector3)
   {
      const canvas = this.getCanvas(options.canvasId);
      this.webGL = new THREE.WebGLRenderer({ canvas, antialias: true });
      this.webGL.setPixelRatio(window.devicePixelRatio);
      this.assetsPath = options.assetsPath;

      this.camera = new THREE.PerspectiveCamera(
         options.fov,
         window.innerWidth / window.innerHeight,
         options.near,
         options.far
      );

      this.controls = new Controls(this.camera, position);
      this.scene = new THREE.Scene();
      this.resize();

      window.addEventListener('resize', () =>
      {
         this.resize();
      });

      this.setupScene(new THREE.Scene());
   }

   public debugView(mesh: [x: number, y: number, z: number][][])
   {
      const debugMesh = DebugHelper.createMesh(mesh);
      this.scene.add(debugMesh);
   }

   public setupScene(scene: THREE.Scene)
   {
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 7.5).normalize();
      scene.add(directionalLight);

      this.scene = scene;
      this.scene.add(this.controls.getTarget());
   }

   private getCanvas(canvasId: string): HTMLCanvasElement
   {
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (canvas == null)
         throw new Error(`Failed to find canvas with id ${canvasId}`);

      return canvas;
   }

   private resize()
   {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.webGL.setSize(window.innerWidth, window.innerHeight);
   }

   public getControls()
   {
      return this.controls;
   }

   public getRenderDom(): HTMLCanvasElement
   {
      return this.webGL.domElement;
   }

   public render()
   {
      this.controls.update();
      this.webGL.render(this.scene, this.camera);
   }

   public async loadModel(name: string)
   {
      const objLoader = new OBJLoader();
      const mtlLoader = new MTLLoader();

      const materials = await mtlLoader.loadAsync(`${this.assetsPath}/materials/${name}.mtl`);
      materials.preload();
      objLoader.setMaterials(materials);

      const tile = await objLoader.loadAsync(`${this.assetsPath}/models/${name}.obj`);
      this.scene.add(tile);
   }
}