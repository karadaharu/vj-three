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
var transparent = new THREE.Color( 0x000000 );
// Renderer
let renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0);
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

var onChangeCallback = function(values){
  for ( var key in values ) {
    if ( key == 'is_text') {
      text.changeVisible(values[key]);
    } else if ( key == 'is_gif' && values[key] == true) {
      scene.background = null;
    } else if (key == 'is_cube') {
      cube.changeVisible(values[key]);
    } else if (key == 'is_glitch') {
      glitchPass.enabled = values[key];
    } else if (key == 'words') {
      text.words = values[key].split(",");
      text.n_words = text.words.length;
    }
  }
}

var cube = new window.Cube(scene);
var text = new window.Text(scene);
var socket = new window.Socket(onChangeCallback);
var gif = new window.Gif();
// var check = new window.Check(scene, window.innerWidth, window.innerHeight);
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

// Post processing
var composer = new THREE.EffectComposer(renderer);

var renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

var glitchPass = new THREE.GlitchPass();
composer.addPass(glitchPass);

//custom shader pass
var myEffect = {
  uniforms: {
    "tDiffuse": { value: null },
    "amount":   { value: 1.0 }
  },
  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
    "vUv = uv;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join( "\n" ),
  fragmentShader: [
    "uniform float amount;",
    "uniform sampler2D tDiffuse;",
    "varying vec2 vUv;",
    "void main() {",
    "vec4 color = texture2D( tDiffuse, vUv );",
    "vec3 c = color.rgb;",
    "color.r = c.r;",
    "color.g = c.g;",
    "color.b = c.b;",
    "gl_FragColor = vec4( color.rgb , color.a );",
    "}"
  ].join( "\n" )
}

var customPass = new THREE.ShaderPass(myEffect);
customPass.renderToScreen = true;
composer.addPass(customPass);
var last_changed = 0;

// Update
function render() {
  stats.begin();

  let waveData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(waveData);

  // cube
  if (socket.is_cube) {
    cube.updateRotation(waveData);
  }

  if (!socket.is_gif) {
    updateColor(waveData);
  }

  let cur_time = new Date().getTime() / 1000;
  if (waveData[10] > socket.sound_limit && cur_time - last_changed> 0.25) {
    last_changed = cur_time;
    if (socket.is_gif) {
      gif.changeGif();
    }
    if (socket.is_text) {
      if (socket.is_gen_txt) {
        socket.getSentence();
      }
      let is_expand = Math.random() > 0.7 ? true : false;
      if (text.is_on && Math.random() > 0.6) {
        text.clearText();
      } else {
        let is_expand = Math.random() > 0.7 ? true : false;
        if (socket.is_gen_txt) {
          text.updateText(socket.msg, waveData[0] / 200, cur_time, is_expand);
        } else {
          let ind = Math.round(Math.random()*text.n_words-0.5);
          text.updateText(text.words[ind], waveData[0] / 200, cur_time, is_expand);
        }
      }
    }
  }
  text.updateSize(cur_time);

  composer.render();
  // renderer.render(scene, camera);
  stats.end();

  requestAnimationFrame(render);
}
render();