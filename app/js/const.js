'use strict';

// Constantes.
const STATE_EX_EFFORT = 1;
const STATE_EX_RECOVERY = 2;
const STATE_EX_PAUSE = 3;
// 
const STATE_EX_BETWEEN = 4;
const dbName = "exerciceData";

// Version for the DB.
const dbVersion = 39;

const EFFORT_COLOR = '#F97C17';
const EFFORT_END_COLOR = 'red';
const RECOVERY_COLOR = 'rgb(53, 146, 35)';
const BETWEEN_COLOR = 'rgb(0, 154, 253)';

const TEXT_COLOR = 'rgb(110, 110, 110)';

var StateEnum = {
  PAST: 1,
  CURRENT: 2,
  FUTURE:3,
  EXECUTED:4,
  LATE:5
};
  
// List of all images.
var gymImages = [
        ["gym-null.png","", 0],
        ["gym-ab-bikes.png", "Ab bikes", 1],
        ["gym-crunch-abdos.png", "Crunch abdos", 1],
        ["gym-flexion.png", "Flexion", 1],
        ["gym-planche.png", "Plank", 1],
        ["gym-push-up.png", "Push up", 4],
        ["gym-squat.png", "Squat" , 3],
        ["gym-jump-squat.png", "Jump squat", 4],
        ["gym-side-kicks.png", "Side kicks", 1],
        ["gym-desk.png", "Desk", 3],
        ["gym-side-plank.png", "Side plank", 1],
        ["gym-air-bike-crunches.png", "Air bike crunches", 1], 
        ["gym-donkey-side-kick.png", "Donkey side kick", 1],
        ["gym-donkey-kick.png", "Donkey kick", 1],
        ["gym-single-leg-hip-raise.png", "Single leg hip raise", 5],
        ["gym-bridge.png", "Bridge", 5],
        ["gym-mountain.png", "Mountain", 3],
        ["gym-situps.png", "Situps", 1],
        ["gym-leg-raises.png", "Leg raises", 1],
        ["gym-flutter-kicks.png", "Flutter kicks", 1],

        // Weight
        ["gym-arm.png", "Arm", 6],
        ["gym-curl.png", "Curl", 6],
        ["gym-dumbbell-curl.png", "Dumbbell Bicep Curl", 2],
        ["gym-arm-triceps-extension.png", "Arm Triceps Extension", 6],
        ["gym-shoulder.png", "Shoulder", 6],
        ["gym-standing-butterfly.png", "Standing butterfly", 6],
        ["gym-thigh.png", "Thigh", 3],
        ["gym-lying-triceps-extension.png", "Lying Triceps Extension", 6],
        // Ball
        ["gym-wall-push-ups.png", "Wall push ups", 7],
        ["gym-prone-leg-raise-ball.png", "Prone Leg Raise with ball", 5],
        ["gym-push-up-ball.png", "Push up with ball", 7],
        ["gym-ball-jacknife.png", "Ball jacknife", 1],
        // Etirement
        ["gym-child-pose.png", "Child pose", 8],
        ["gym-side-lunge-strech.png", "Side lunge strech", 8]
];