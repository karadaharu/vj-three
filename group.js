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

// canvas要素
var txt = '落ち着け';
var n_char = txt.length;
var char_size = 512;
var ratio = 1.1;
var canvasHeight = char_size * ratio;
var canvasWidth = char_size * n_char * ratio;

// BufferGeometryを生成
var geometry = new THREE.BufferGeometry();
// 平面用の頂点を定義
// d - c
// |   |
// a - b
var l = 10.0;
var l_w = l*n_char;
var l_h = l;
var l_z = 20.0;
var vertexPositions = [
    [-l_w, -l_h, l_z], // a
    [ l_w, -l_h, l_z], // b
    [ l_w,  l_h, l_z], // c
    [-l_w,  l_h, l_z]  // d
];

// Typed Arrayで頂点データを保持
var vertices = new Float32Array(vertexPositions.length * 3);
for (var i = 0; i < vertexPositions.length; i++) {
    vertices[i * 3 + 0] = vertexPositions[i][0];
    vertices[i * 3 + 1] = vertexPositions[i][1];
    vertices[i * 3 + 2] = vertexPositions[i][2];
}

// 頂点インデックスを生成
var indices = new Uint16Array([
    0, 1, 2,
    2, 3, 0
]);

var uv = new Float32Array([
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0 
]);

// attributesを追加
geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setIndex(new THREE.BufferAttribute(indices,  1));
geometry.addAttribute('uv', new THREE.BufferAttribute(uv,2));


// ふつうの
var material = new THREE.MeshLambertMaterial({
    color: 0xff0000
});

// シェーダー
var material_shader = new THREE.RawShaderMaterial({
    uniforms: {
        txtTexture : {type : 't'}
    },    
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    transparent: true
});

// テクスチャを読み込む
var txtCanvas = document.createElement('canvas');
txtCanvas.width = canvasWidth;
txtCanvas.height = canvasHeight;
var txtCanvasCtx = txtCanvas.getContext('2d');
txtCanvasCtx.font = 'normal '+ char_size.toString()  +'px' + ' ' + 'Hiragino Mincho ProN';
// txtCanvasCtx.fillStyle = '#ff00ff';
txtCanvasCtx.textAlign = 'center';
// txtCanvasCtx.rect(0,0, txtCanvas.width, txtCanvas.height);
// txtCanvasCtx.fill();

txtCanvasCtx.fillStyle = '#ffffff';
txtCanvasCtx.fillText(
    // txt, txtCanvas.width, txtCanvas.height
    txt, (canvasWidth)/2, char_size
);
var txtTexture = new THREE.Texture(txtCanvas);

// txtTexture.minFilter = THREE.LinearFilter;
txtTexture.flipY = false;  // UVを反転しない (WebGLのデフォルトにする)
txtTexture.needsUpdate = true;  // テクスチャを更新

material_shader.uniforms.txtTexture.value = txtTexture;

var mesh = new THREE.Mesh(geometry, material_shader);
var mesh1 = new THREE.Mesh(geometry, material);

scene.add(mesh);

var updateText = function(txtCanvasCtx, txtOld, txtNew) {
    txtCanvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    txtCanvasCtx.fillStyle = '#000000';
    txtCanvasCtx.fillText(
        txtNew, (canvasWidth)/2, char_size        
    );
    txtTexture.needsUpdate = true;  // テクスチャを更新     
};


var Controller = function() {
    this.speed = 0.1;
}
var controller = new Controller();

var gui = new dat.GUI({
    height : 5 * 32 - 1
});
gui.add(controller, 'speed', -5, 5);

// Update
function render() {
    requestAnimationFrame(render);

	let waveData = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(waveData);
    cube.updateRotation(waveData);
    updateColor(waveData);

    renderer.render(scene, camera);
}
render();