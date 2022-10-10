import { atom } from "recoil";

export const cubePositionState = atom<{
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}>({
  key: "cubePosition", // unique ID (with respect to other atoms/selectors)
  default: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } } // default value (aka initial value)
});

export const bulletPositionState = atom<any[]>({
  key: "bulletPositions", // unique ID (with respect to other atoms/selectors)
  default: [] // default value (aka initial value)
});
