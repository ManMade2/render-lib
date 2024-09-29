import { Render } from './render'
import { RenderOptions } from './renderOptions'
import * as THREE from 'three';

const pos = new THREE.Vector3(-203.125, 80.47032928466797, -8865.62353515625);

const gl = new Render(RenderOptions.CreateDefault(), pos);
const controls = gl.getControls();
const dom = gl.getRenderDom();


/*#region EventListeners*/

dom.addEventListener("mousemove", (event) => {
   controls.onMouseMove(event);
});

dom.addEventListener('mousedown', (event) => {
   // if (event.button === 0) controls.leftMouse(true);
   if (event.button === 2) controls.rightMouse(true);
});

dom.addEventListener('mouseup', (event) => {
   // if (event.button === 0) controls.leftMouse(false);
   if (event.button === 2) controls.rightMouse(false);
});

dom.addEventListener('contextmenu', (event: MouseEvent) => {
   event.preventDefault();
});

document.addEventListener('keydown', (event) => {
   switch (event.code) {
      case 'KeyW':
         controls.forward(true);
         break;
      case 'KeyS':
         controls.backward(true);
         break;
      case 'KeyA':
         controls.left(true);
         break;
      case 'KeyD':
         controls.right(true);
         break;
      case 'KeyQ':
         controls.down(true);
         break;
      case 'KeyE':
         controls.up(true);
         break;
   }
});

document.addEventListener('keyup', (event) => {
   switch (event.code) {
      case 'KeyW':
         controls.forward(false);
         break;
      case 'KeyS':
         controls.backward(false);
         break;
      case 'KeyA':
         controls.left(false);
         break;
      case 'KeyD':
         controls.right(false);
         break;
      case 'KeyQ':
         controls.down(false);
         break;
      case 'KeyE':
         controls.up(false);
         break;
   }
});



/*#endregion*/


function loop() {
   requestAnimationFrame(loop);
   gl.render();
}

loop();
