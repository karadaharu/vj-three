(function(){
  // var container, stats;
  // var camera, scene, renderer;
  // var morph;

  window.Morph = function(scene) {
    this.last_per = 0;
    this.spb = 60/120;
    this.dir = 1;
    this.size = 70;
    this.is_ready = false;
    this.geometry = new THREE.BoxGeometry( this.size, this.size, this.size);
    this.sphereGeometry = new THREE.SphereGeometry(this.size/2, 25, 25);
    this.material = new THREE.MeshLambertMaterial( { color: 0xff00ff, morphTargets: true } );
    this.verticesSet = [];
    this.verticesSet.push(this.initMorph(this.geometry));
    this.sphereGeometry.morphTargets.push( { name: "cube", vertices: this.verticesSet[0] } );
    this.initModelMorph(scene);
  };

  window.Morph.prototype.initModelMorph = function(scene) {
    this.mesh = new THREE.Mesh( this.sphereGeometry, this.material );
    scene.add( this.mesh );
    this.is_ready = true;
    // var loader = new THREE.JSONLoader();
    // loader.load( "model/horse.js", ( geometry ) => {
    //   geometry.scale(0.2, 0.2, 0.2);
    //   this.verticesSet.push(this.initMorph(geometry));
    //   this.sphereGeometry.morphTargets.push( { name: "horse", vertices: this.verticesSet[1] } );
    //   this.mesh = new THREE.Mesh( this.sphereGeometry, this.material );
    //   scene.add( this.mesh );
    //   this.is_ready = true;
    // });
  };
  window.Morph.prototype.initMorph = function(geometry) {
    var vertices = [];
    var pair_dist = [];
    for (var v = 0; v < this.sphereGeometry.vertices.length; v++ ) {
      for (var t = 0; t < geometry.vertices.length; t++ ) {
        pair_dist.push( [v, t, geometry.vertices[t].distanceTo(this.sphereGeometry.vertices[v]) ] );
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
          vertices.push(geometry.vertices[i_target].clone());
          selected_ind.push(i_target);
          break;
        }
      }
    }
    for (var i = 0; i < geometry.vertices.length; i++ ) {
      if (selected_ind.indexOf(i) != -1) { continue; }
      for ( var j = 0; j < pair_dist_sort.length; j++ ) {
        if ( pair_dist_sort[j][1] != i ) { continue; }
        vertices[pair_dist_sort[j][0]].copy(geometry.vertices[i]);
        break;
      }
    }
    return vertices;
  };

  window.Morph.prototype.morph = function(time) {
    var per = (cur_time % this.spb)/this.spb;
    if ( per < this.last_per ) {
      this.dir = - this.dir;
    }
    if (this.is_ready) {
      this.mesh.morphTargetInfluences[ 0 ] = this.dir == 1 ? Math.pow(per,0.5) : 1 - Math.pow(per,0.5);
      // this.mesh.morphTargetInfluences[ 1 ] = 1;
    }
    this.last_per = per;
  };
})();
