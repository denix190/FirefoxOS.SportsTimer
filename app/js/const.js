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
        ["gym-push-up.png", "Push up", 1],
        ["gym-squat.png", "Squat" , 1],
        ["gym-jump-squat.png", "Jump squat", 1],
        ["gym-side-kicks.png", "Side kicks", 1],
        ["gym-desk.png", "Desk", 1],
        ["gym-side-plank.png", "Side plank", 1],
        ["gym-air-bike-crunches.png", "Air bike crunches", 1], 
        ["gym-donkey-side-kick.png", "Donkey side kick", 1],
        ["gym-donkey-kick.png", "Donkey kick", 1],
        ["gym-single-leg-hip-raise.png", "Single leg hip raise", 1],
        ["gym-bridge.png", "Bridge", 1],
        ["gym-mountain.png", "Mountain", 1],
        ["gym-situps.png", "Situps", 1],
        ["gym-leg-raises.png", "Leg raises", 1],
        ["gym-flutter-kicks.png", "Flutter kicks", 1],

        // Weight
        ["gym-arm.png", "Arm", 2],
        ["gym-curl.png", "Curl", 2],
        ["gym-dumbbell-curl.png", "Dumbbell Curl", 2],
        ["gym-arm-triceps-extension.png", "Arm Triceps Extension", 2],
        ["gym-shoulder.png", "Shoulder", 2],
        ["gym-standing-butterfly.png", "Standing butterfly", 2],
        ["gym-thigh.png", "Thigh", 2],
        ["gym-lying-triceps-extension.png", "Lying Triceps Extension", 2],
        // Ball
        ["gym-wall-push-ups.png", "Wall push ups", 3],
        ["gym-prone-leg-raise-ball.png", "Prone Leg Raise with ball", 3],
        ["gym-push-up-ball.png", "Push up with ball", 3],
        ["gym-ball-jacknife.png", "Ball jacknife", 3],
        // Etirrement
        ["gym-child-pose.png", "Child pose", 4],
        ["gym-side-lunge-strech.png", "Side lunge strech", 4]
];