import { PerspectiveCamera, Vector3, BoxGeometry, MeshStandardMaterial, Mesh, Vector2 } from "three";

export abstract class BaseControl {
   protected readonly target: Mesh;
   protected prevMousePos: Vector2 = new Vector2();

   private isDragging: boolean = false;
   private readonly camera: PerspectiveCamera;
   private readonly directions: { [key: string]: boolean } = {};


   constructor(camera: PerspectiveCamera, position: Vector3) {
      this.camera = camera;
      camera.position.set(position.x, position.y, position.z);

      this.target = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ color: 0x00ff00 }));
      this.target.position.set(position.x, position.y, position.z);
   }

   abstract handleMovement(direction: Vector3): void
   abstract updateCameraPos(camera: PerspectiveCamera, target: Mesh): void
   abstract handleDrag(position: Vector2): void;

   public update() {

      const direction = new Vector3()

      if (this.directions['forward']) {
         direction.z -= 1;
      }
      if (this.directions['backward']) {
         direction.z += 1;
      }
      if (this.directions['left']) {
         direction.x -= 1;
      }
      if (this.directions['right']) {
         direction.x += 1;
      }
      if (this.directions['up']) {
         direction.y += 1;
      }
      if (this.directions['down']) {
         direction.y -= 1;
      }

      this.updateCameraPos(this.camera, this.target);
      this.handleMovement(direction);
   }

   public forward(down: boolean) {
      this.directions["forward"] = down;
   }

   public backward(down: boolean) {
      this.directions["backward"] = down;
   }

   public left(down: boolean) {
      this.directions["left"] = down;
   }

   public right(down: boolean) {
      this.directions["right"] = down;
   }

   public up(down: boolean) {
      this.directions["up"] = down;
   }

   public down(down: boolean) {
      this.directions["down"] = down;
   }

   public rightMouse(down: boolean) {
      this.prevMousePos.set(0, 0);
      this.isDragging = down;
   }

   public leftMouse() {
   }

   public getTarget(): Mesh {
      return this.target;
   }


   public onMouseMove(event: MouseEvent) {
      if (!this.isDragging)
         return;

      this.handleDrag(new Vector2(event.clientX, event.clientY));
   }
}