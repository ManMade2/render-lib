export class RenderOptions {
   readonly canvasId: string;
   readonly fov: number;
   readonly near: number;
   readonly far: number;
   readonly ambientLightColor: number;
   readonly ambientLightStrength: number;
   readonly assetsPath: string;

   constructor(canvasId: string, assetsPath: string, fov: number, near: number, far: number, ambientLightColor: number, ambientLightStrength: number) {
      this.canvasId = canvasId;
      this.fov = fov;
      this.assetsPath = assetsPath;
      this.near = near;
      this.far = far;
      this.ambientLightColor = ambientLightColor;
      this.ambientLightStrength = ambientLightStrength;
   }

   public static CreateDefault(): RenderOptions {
      return new RenderOptions('webrender','/static/assets', 75, 0.1, 10000, 0xFFFFFF, 0.5);
   }
}
