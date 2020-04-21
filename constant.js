const matSize = 4;
const factor = 100;
const speed = 5;
const roundedCorner = 4;

const direction = {
  0: new p5.Vector(-1, 0),
  1: new p5.Vector(1, 0),
  2: new p5.Vector(0, -1),
  3: new p5.Vector(0, 1)
};

const colors = [
  '#f0e6ef', // 2
  '#b8bedd', // 4
  '#efc3e6', // 8
  '#f0a6ca', // 16
  '#f4acb7', // 32
  '#68d8d6', // 64
  '#ef476f', // 128
  '#8093f1', // 256
  '#72ddf7', // 512
  '#adf7b6', // 1024
  '#f7567c' // 2048
];
const isGame = false; // Set this true to play game, false for A.I.