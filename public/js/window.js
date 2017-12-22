(function(){
  window.Window = function(scene) {
    this.vars = {size:0.3, rotate:0};
    this.vars_orig = {size:1, rotate:0};
    this.is_moved = false;
    this.is_rand = false;
    this.is_moving = true;
    this.rand_float= Math.random();
    this.angleX = Math.cos(this.rand_float);
    this.angleY = Math.sin(this.rand_float);
    this.rand = Math.random() > 0.5 ? true : false;
    this.is_rotate = Math.random() > 0.5 ? true : false;
    this.rotate_no = Math.random() > 0.5 ? true : false;
    this.tween = new TWEEN.Tween(this.vars);
    this.tween.to({size:3}, 800)
      // .repeat(1)
      // .yoyo(true)
      .easing(TWEEN.Easing.Elastic.InOut)
      .start();


    this.sec_per_beat = 1.0;
    this.material = new THREE.MeshBasicMaterial( { color: 0x000000, opacity:0.1 } );
    this.geometry = new THREE.CircleGeometry( 10, 3, Math.PI / 2 );
    this.geometry2 = new THREE.CircleGeometry( 10, 3, -Math.PI/2 );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh2 = new THREE.Mesh( this.geometry2, this.material );
    this.mesh.matrixAutoUpdate = true;
    this.mesh.visible=false;
    this.mesh2.visible=false;

    this.tween.onUpdate(()=>{
      if (this.rand) {
        this.mesh.scale.set(this.vars.size, this.vars.size,this.vars.size);
      } else {
        this.mesh2.scale.set(this.vars.size, this.vars.size,this.vars.size);
      }
      // if (this.is_rand) {
        this.mesh.position.set(this.vars.size*10 * this.angleX,this.vars.size*10 * this.angleY, 0);
        this.mesh2.position.set(-this.vars.size*10 * this.angleX,-this.vars.size*10 * this.angleY, 0);
      // } 
      if (this.is_rotate) {
        if (this.rotate_no){
          this.mesh.rotateZ(this.vars.rotate);
        }else{
          this.mesh2.rotateZ(this.vars.rotate);
        }
      }
    });
    this.tween.onComplete(()=>{
      this.is_moved = !this.is_moved;
      if (!this.is_moved) {
        this.rand = Math.random() > 0.5 ? true : false;
      }
      this.is_rotate = Math.random() > 0.5 ? true : false;
      this.rotate_no = Math.random() > 0.5 ? true : false;
      this.is_moving = false;
    });

    scene.add( this.mesh );
    scene.add( this.mesh2 );
  };

  window.Window.prototype.start = function(){
    if (this.is_rand){
      this.rand_float= Math.random();
      this.angleX = Math.cos(this.rand_float);
      this.angleY = Math.sin(this.rand_float);
    } else { 
      var dir = Math.random();
      if ( dir >0.5 && !this.is_moved   ) {
        this.angleX =0;
        this.angleY =1;
      } else {
        this.angleX =1;
        this.angleY =0;
      }
    }
    if (this.is_moving) {
      return;
    }
    if (this.is_moved) {
      this.tween.to(this.vars_orig, 800);
    } else {
      this.mesh.scale.set(this.vars_orig.size, this.vars_orig.size,this.vars_orig.size,);
      this.mesh.scale.set(this.vars_orig.size,this.vars_orig.size,this.vars_orig.size);
      this.tween.to({size:Math.random()*4+2, rotate:0.3}, 800);
    }
    this.is_moving = true;
    this.tween.start();
  }
})();
