// AUDIO
window.AudioContext = window.webkitAudioContext || window.AudioContext;
let context = new AudioContext();
let analyser = context.createAnalyser();
analyser.fftSize = 64;

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
// Access to Mic throgh getUserMedia
navigator.getUserMedia(
	{ video:false, audio:true },
	function(stream) {
		var mic = context.createMediaStreamSource(stream);
		mic.connect(analyser);
	},
	function(error) { return; }
);

// Scene
let scene = new THREE.Scene();

// Renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
document.body.appendChild( renderer.domElement );

// Camera
let camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set(0, 0, 100);

// Lights
let n_light = 4;
let lights = [];
let light_colors = [[0, 0.50,0.5], [0.5, 0.5, 0.5], [1.0, 0.5 ,0.5]];
let light_poss = [[-100,-100,100], [100,100,100], [0,-100,100]];
for (let i = 0; i < n_light-1; i++) {
    let col = new THREE.Color().setHSL(light_colors[i][0],light_colors[i][1],light_colors[i][2]);
    let directionalLight = new THREE.DirectionalLight(col, 0.5);
    directionalLight.position.set(light_poss[i][0],light_poss[i][1],light_poss[i][2]);
    lights.push(directionalLight);
    scene.add(directionalLight);
}
let light = new THREE.AmbientLight(0xff0000,0.5);
lights.push(light);
scene.add( light );

function updateColor(waveData) {
    let scale = 30000;
    for (let i = 0; i < n_light; i++) {
        let col = lights[i].color.getHSL();
        col.h = col.h + (waveData[0+i*4] - 128) / scale;    
        col.h = col.h - Math.floor(col.h);
        col.s = col.s + (waveData[1+i*4] - 128) / scale;
        col.s = (col.s - Math.floor(col.s)) / 3.0 + 0.3;
        col.l = col.l + (waveData[2+i*4] - 128) / scale;
        col.l = (col.l - Math.floor(col.l)) / 3.0 + 0.3;
        lights[i].color.setHSL(col.h, col.s, col.l);
        if (i==n_light-1) {
            scene.background = lights[i].color;
        }
    }
}

var cube = new window.Cube(scene);
var text = new window.Text(scene);


var Controller = function() {
    this.speed = 0.1;
}

var controller = new Controller();
var gui = new dat.GUI({
});

var sound_limit = 200;
var speed_gui = gui.add(controller, 'speed', 0, 255);
speed_gui.onFinishChange(function(value){
    sound_limit = value;
});

// Update
function render() {
    requestAnimationFrame(render);

	let waveData = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(waveData);
    cube.updateRotation(waveData);
    updateColor(waveData);

    if (waveData[0] > sound_limit && (new Date().getTime() / 1000) - text.last_changed> 0.1) {
        if (text.is_on) {
            text.clearText();
        } else {
            let ind = Math.round(Math.random()*4-0.5);
            text.updateText(text.words[ind], waveData[0] / 80);
        }  
    }

    renderer.render(scene, camera);
}
render();