(function() {
  window.Check = function(scene, w, h) {
    this.geometry = new THREE.PlaneBufferGeometry( 2, 2 );
    this.uniforms = {
      u_resolution: { type: "v2", value: new THREE.Vector2() },
    };

    this.uniforms.u_resolution.value.x = w;
    this.uniforms.u_resolution.value.y = h;
    // this.material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    this.material = new THREE.ShaderMaterial( {
      uniforms: this.uniforms,
      vertexShader: document.getElementById( 'vCheckShader' ).textContent,
      fragmentShader: document.getElementById( 'fCheckShader' ).textContent
    } );
    scene
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    scene.add( this.mesh );
  };
})();
