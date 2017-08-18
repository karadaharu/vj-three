// Cubes
(function() {
    // window.cube = {};
    window.Cube = function(scene) {
        this.cubes = [];
        this.n_cubes = 4;
        this.x_interval = 30;
        this.size = 12;
        for (i = 0; i < this.n_cubes; i++) {
            let geometry = new THREE.BoxGeometry(this.size,this.size,this.size);
            let material = new THREE.MeshPhongMaterial( { color: '#ffffff' } );
            let cube = new THREE.Mesh( geometry, material );
            cube.position.set(i*this.x_interval-(this.n_cubes/2)*this.x_interval+this.size, 0, 0);
            this.cubes.push(cube);
            scene.add( cube );
        }
        this.rotations = [];
        for (i = 0; i < this.n_cubes; i++) {
            this.rotations.push(new THREE.Vector3(1,0,0));
        }
    };
    window.Cube.prototype.updateRotation = function(waveData) {
        for (i = 0; i < this.n_cubes; i++) {
            this.rotations[i].add(new THREE.Vector3(waveData[0+i],waveData[4+i],waveData[8+i])).normalize();
            if (!isNaN(this.rotations[i].x)) {      
                this.cubes[i].rotateOnAxis(this.rotations[i],waveData[12+i]/1000);
            }
        } 
    };

    window.Cube.prototype.changeVisible = function(is_visible) {
      for (i = 0; i < this.n_cubes; i++) {
        this.cubes[i].visible = is_visible;
      }
    }
})();
