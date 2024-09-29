import * as THREE from 'three';
import { Controls } from './controls';
import { RenderOptions } from './renderOptions';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';


export class Render {
   private readonly webGL: THREE.WebGLRenderer;
   private readonly controls: Controls;
   private readonly camera: THREE.PerspectiveCamera;
   private scene: THREE.Scene;

   constructor(options: RenderOptions, position: THREE.Vector3) {

      const canvas = this.getCanvas(options.canvasId);
      this.webGL = new THREE.WebGLRenderer({ canvas });
      this.webGL.setSize(window.innerWidth, window.innerHeight);

      this.camera = new THREE.PerspectiveCamera(
         options.fov,
         window.innerWidth / window.innerHeight,
         options.near,
         options.far
      );
      
      this.controls = new Controls(this.camera, position);
      this.scene = new THREE.Scene();

      this.setupScene(new THREE.Scene());
   }

   public setupScene(scene: THREE.Scene) {
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 7.5).normalize();
      scene.add(directionalLight);

      this.scene = scene;


      this.scene.add(this.controls.getTarget());
   }

   private getCanvas(canvasId: string): HTMLCanvasElement {
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (canvas == null)
         throw new Error(`Failed to find canvas with id ${canvasId}`);

      return canvas;
   }

   public getControls() {
      return this.controls;
   }

   public getRenderDom(): HTMLCanvasElement {
      return this.webGL.domElement;
   }

   public render() {
      this.controls.update();
      this.webGL.render(this.scene, this.camera);
   }

   public resize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.webGL.setSize(window.innerWidth, window.innerHeight);
   }
   private ensureClockwise(vertices: number[]): number[] {
      const v1 = new THREE.Vector3(vertices[0], vertices[1], vertices[2]);
      const v2 = new THREE.Vector3(vertices[3], vertices[4], vertices[5]);
      const v3 = new THREE.Vector3(vertices[6], vertices[7], vertices[8]);

      const edge1 = new THREE.Vector3().subVectors(v2, v1);
      const edge2 = new THREE.Vector3().subVectors(v3, v1);

      const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize();

      // If the normal points downwards (y-axis negative), reverse the winding order
      if (normal.y < 0) {
         return [
            vertices[6], vertices[7], vertices[8], // v3
            vertices[3], vertices[4], vertices[5], // v2
            vertices[0], vertices[1], vertices[2]  // v1
         ];
      }

      return vertices;
   }


   public async loadModel() {
      const objLoader = new OBJLoader();
      const mtlLoader = new MTLLoader();

      const name = "adt_32_48";

      const materials = await mtlLoader.loadAsync(`/models/${name}.mtl`);
      materials.preload();
      objLoader.setMaterials(materials);

      const tile = await objLoader.loadAsync(`/models/${name}.obj`);
      this.scene.add(tile)
   }



   public async visualize() {

      const response = await fetch("http://127.0.0.1:5002/api/v1/generateMesh/adt_32_48");
      const walkableSurfaces = await response.json();
      const material = new THREE.MeshBasicMaterial({
         color: 0x00ff00,       // Green color for walkable surfaces
         transparent: true,
         opacity: 0.5,          // Semi-transparent
         side: THREE.DoubleSide, // Render both sides of the surface
         wireframe: true         // Enable wireframe mode for debugging
      });


      // Create a BufferGeometry for all triangles combined
      const geometry = new THREE.BufferGeometry();
      // Create an array to hold all the vertices
      const vertices = new Float32Array(walkableSurfaces.length * 9); // 3 vertices per triangle, 3 components (x, y, z) per vertex

      let vertexIndex = 0;
      walkableSurfaces.forEach(surface => {
         let verticesArray = [
            surface[0][0], surface[0][1], surface[0][2],  // First vertex
            surface[1][0], surface[1][1], surface[1][2],  // Second vertex
            surface[2][0], surface[2][1], surface[2][2]   // Third vertex
         ];

         // Ensure all triangles have consistent winding
         verticesArray = this.ensureClockwise(verticesArray);

         // Add each triangle's vertices to the vertices array
         vertices[vertexIndex++] = verticesArray[0];
         vertices[vertexIndex++] = verticesArray[1];
         vertices[vertexIndex++] = verticesArray[2];
         vertices[vertexIndex++] = verticesArray[3];
         vertices[vertexIndex++] = verticesArray[4];
         vertices[vertexIndex++] = verticesArray[5];
         vertices[vertexIndex++] = verticesArray[6];
         vertices[vertexIndex++] = verticesArray[7];
         vertices[vertexIndex++] = verticesArray[8];
      });

      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();

      // Create a mesh using the geometry and material
      const mesh = new THREE.Mesh(geometry, material);

      // Add the mesh to the scene
      this.scene.add(mesh);

   }

   private visualizePath(pathData: any, scene: THREE.Scene) {
      console.info(pathData)
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
      const geometry = new THREE.BufferGeometry().setFromPoints(pathData.map(coord => new THREE.Vector3(coord[0], coord[1], coord[2])));
      const line = new THREE.Line(geometry, material);
      scene.add(line);
   }

   public async fetchPath() {
      const response = await fetch('http://127.0.0.1:5002/api/v1/get_path');
      const pathData = await response.json();
      this.visualizePath(JSON.parse(pathData["path"]), this.scene);
   }
}