export class RenderOptions {
   readonly canvasId: string;
   readonly fov: number;
   readonly near: number;
   readonly far: number;
   readonly ambientLightColor: number;
   readonly ambientLightStrength: number;

   constructor(canvasId: string, fov: number, near: number, far: number, ambientLightColor: number, ambientLightStrength: number) {
      this.canvasId = canvasId;
      this.fov = fov;
      this.near = near;
      this.far = far;
      this.ambientLightColor = ambientLightColor;
      this.ambientLightStrength = ambientLightStrength;
   }

   public static CreateDefault(): RenderOptions {
      return new RenderOptions('webrender', 75, 0.1, 10000, 0xFFFFFF, 0.5);
   }
}
