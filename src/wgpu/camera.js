
let yaw = 0;
let pitch = 0;
let distance = 3.0;
export const target = [0.0, 0.0,0.0];
export const up = [0.0, 1.0, 0.0];

let isDragging = false;
let lastX = 0;
let lastY = 0;

export let needsReset = false;

export const getCameraPos = () => {
    const x = distance * Math.cos(pitch) * Math.sin(yaw);
    const y = distance * Math.sin(pitch);
    const z = distance * Math.cos(pitch) * Math.cos(yaw);
    return [x, y, z];
}

export function onMouseDown(e) {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  needsReset = true;
}
export function onMouseMove(e) {
  if (!isDragging) return;
  const dx = (e.clientX - lastX) * 0.005;
  const dy = (e.clientY - lastY) * 0.005;
  yaw += dx;
  pitch = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, pitch + dy));
  lastX = e.clientX;
  lastY = e.clientY;
}
export function onMouseUp() { isDragging = false; }

