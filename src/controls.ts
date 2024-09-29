import { PerspectiveCamera, Vector3, Vector2, Mesh } from "three";
import { BaseControl } from "./baseControl"

export class Controls extends BaseControl {
   private readonly cameraDistance = 20;
   private readonly cameraHeight = 10;
   private readonly rotationSpeed = 0.005;
   private readonly movementSpeed = 1;

   constructor(camera: PerspectiveCamera, position: Vector3) {
      super(camera, position);
   }

   handleMovement(direction: Vector3): void {

      if (direction.length() <= 0)
         return;

      direction.normalize().applyAxisAngle(new Vector3(0, 1, 0), this.target.rotation.y);
      this.target.position.add(direction.multiplyScalar(this.movementSpeed));
   }

   updateCameraPos(camera: PerspectiveCamera, target: Mesh) {
      const offset = new Vector3(0, this.cameraHeight, this.cameraDistance);
      offset.applyAxisAngle(new Vector3(0, 1, 0), target.rotation.y);

      camera.position.copy(target.position).add(offset);
      camera.lookAt(target.position);
   }

   handleDrag(mousePos: Vector2): void {

      const delta = new Vector2().subVectors(mousePos, this.prevMousePos);
      this.prevMousePos.copy(mousePos);
      this.target.rotation.y += delta.x * this.rotationSpeed;
   }
}