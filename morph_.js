(function(){
  // var container, stats;
  // var camera, scene, renderer;
  // var morph;
  window.Morph = function(scene) {
    this.last_per = 0;
    this.dir = 1;
    this.size = 30;
    this.geometry = new THREE.BoxGeometry( this.size, this.size, this.size);
    this.sphereGeometry = new THREE.SphereGeometry(this.size/2, 25, 25);
    this.material = new THREE.MeshLambertMaterial( { color: 0xff00ff, morphTargets: true } );
    this.vertices = [];
    this.initMorph();
    console.log(this.vertices);
    this.sphereGeometry.morphTargets.push( { name: "target", vertices: this.vertices } );
    this.mesh = new THREE.Mesh( this.sphereGeometry, this.material );
    scene.add( this.mesh );
  };

  window.Morph.prototype.initMorph = function() {
    var pair_dist = [];
    for (var v = 0; v < this.sphereGeometry.vertices.length; v++ ) {
      for (var t = 0; t < this.geometry.vertices.length; t++ ) {
        pair_dist.push( [v, t, this.geometry.vertices[t].distanceTo(this.sphereGeometry.vertices[v]) ] );
      }
    }
    var sortDist = function(a, b) {
      if (a[2] < b[2]) return -1;
      if (a[2] > b[2]) return 1;
      return 0;
    };
    var pair_dist_sort = pair_dist.sort(sortDist);
    var selected_ind = [];
    for (var v = 0; v < this.sphereGeometry.vertices.length; v++ ) {
      for ( var i = 0; i < pair_dist_sort.length; i++ ) {
        if ( pair_dist_sort[i][0] == v ) {
          var i_target = pair_dist_sort[i][1];
          this.vertices.push(this.geometry.vertices[i_target].clone());
          selected_ind.push(i_target);
          break;
        }
      }
    }
    for (var i = 0; i < this.geometry.vertices.length; i++ ) {
      if (selected_ind.indexOf(i) != -1) { continue; }
      for ( var j = 0; j < pair_dist_sort.length; j++ ) {
        if ( pair_dist_sort[j][1] != i ) { continue; }
        this.vertices[pair_dist_sort[j][0]].copy(this.geometry.vertices[i]);
        break;
      }
    }
  };

  window.Morph.prototype.morph = function(time) {
    // var bps = 0.9583;
    var bps = 120/60/4;
    var per = (cur_time % bps)/bps;
    if ( per < this.last_per ) {
      this.dir = - this.dir;
    }
    this.mesh.morphTargetInfluences[ 0 ] = this.dir == 1 ? Math.pow(per,0.5) : 1 - Math.pow(per,0.5);
    this.last_per = per;
  };

  // init();
  // animate();
  // function init() {
  //   container = document.getElementById( 'container' );
  //   camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 15000 );
  //   camera.position.z = 200;
  //   scene = new THREE.Scene();
  //   scene.background = new THREE.Color( 0x222222 );
  //   scene.fog = new THREE.Fog( 0x000000, 1, 15000 );
  //   var light = new THREE.PointLight( 0xff2200 );
  //   light.position.set( 100, 100, 100 );
  //   scene.add( light );
  //   var light = new THREE.AmbientLight( 0x111111 );
  //   scene.add( light );
  //
  //   morph = new window.Morph(scene);
  //   //
  //   var params = {
  //     percent: 0
  //   };
  //   var gui = new dat.GUI();
  //   gui.add( params, 'percent', 0, 1 ).step( 0.01 ).onChange( function( value ) { morph.mesh.morphTargetInfluences[ 0 ] = value; } );
  //   renderer = new THREE.WebGLRenderer();
  //   renderer.setPixelRatio( window.devicePixelRatio );
  //   renderer.setSize( window.innerWidth, window.innerHeight );
  //   container.appendChild( renderer.domElement );
  //
  // }
  //
  // function animate() {
  //   requestAnimationFrame( animate );
  //   render();
  // }
  // function render() {
  //   morph.mesh.rotation.y += 0.01;
  //   morph.mesh.rotation.z += 0.01;
  //   renderer.render( scene, camera );
  // }
})();