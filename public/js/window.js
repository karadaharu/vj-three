(function(){
  window.Window = function(scene) {
    this.vars = {size:0.3};
    this.tween = new TWEEN.Tween(this.vars);
    this.tween.to({size:3}, 800)
      .repeat(1)
      .yoyo(true)
      .easing(TWEEN.Easing.Elastic.InOut)
      .start();
    this.sec_per_beat = 1.0;
    this.material = new THREE.MeshBasicMaterial( { color: 0x000000, opacity:0.1 } );
    this.geometry = new THREE.CircleGeometry( 10, 3, Math.PI / 2 );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.matrixAutoUpdate = true;

    this.tween.onUpdate(()=>{
      this.mesh.scale.set(this.vars.size, this.vars.size,this.vars.size );
    });
    this.tween.onComplete(()=>{
      this.tween.to({size:Math.random()*2+2}, 800);
      this.tween
        .repeat(1)
        .yoyo(true)
        .start();
    });

    scene.add( this.mesh );
  };

  window.Window.prototype.update = function(time) {
    // var per = (time % this.sec_per_beat)/this.sec_per_beat;
    // var size = Math.sin(per*Math.PI*2)+1;
    // var size = Math.acos(Math.cos(time*Math.PI /this.sec_per_beat ));
    // this.mesh.scale.set(size, size , 1);
  }
})();
