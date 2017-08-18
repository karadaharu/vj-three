(function(){
    window.Text = function(scene){
      // canvas要素
      this.txt = '大丈夫だよねだよねそうだよね';
      this.words = ['大丈夫', '納豆', '夏', 'うなぎ', 'です', '愛'];
      this.n_char = this.txt.length;
      this.color = '#ffffff';
      this.char_size = 512;
      this.ratio = 1.1;
      this.is_on = true;
      this.last_changed = 0;
      this.is_expand = false;
      this.start_time = 0;
      this.target_size = 1.0;
      this.orig_size = 1.0;

      this.createBufferGeometry();

      // シェーダー
      this.material_shader = new THREE.RawShaderMaterial({
        uniforms: {
          txtTexture : {type : 't'}
        },    
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
        transparent: true
      });

      // テクスチャを読み込む
      this.createCanvas();

      this.txtTexture = new THREE.Texture(this.txtCanvas);

      // txtTexture.minFilter = THREE.LinearFilter;
      this.txtTexture.flipY = false;  // UVを反転しない (WebGLのデフォルトにする)
      this.txtTexture.needsUpdate = true;  // テクスチャを更新

      this.material_shader.uniforms.txtTexture.value = this.txtTexture;

      this.mesh = new THREE.Mesh(this.geometry, this.material_shader);

      scene.add(this.mesh);
    };

    window.Text.prototype.updateText = function(txtNew, size, cur_time, is_expand) {
      this.txtCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.txtCanvasCtx.fillStyle = this.color;
      this.txtCanvasCtx.fillText(
          txtNew, (this.canvasWidth)/2, this.char_size
          );
      this.txtTexture.needsUpdate = true;  // テクスチャを更新
      this.last_changed = new Date().getTime() / 1000;
      this.is_on = true; 
      this.geometry.attributes.position.array = this.vertices.map(function(x) {return x * size;});
      this.geometry.attributes.position.needsUpdate = true;
      this.start_time = cur_time;
      this.is_expand = is_expand;
      this.target_size = size * 1.5 * Math.log(size+1);
      this.orig_size = size;
    };

    window.Text.prototype.clearText = function() {
      this.txtCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.txtTexture.needsUpdate = true;  // テクスチャを更新        
      this.last_changed = new Date().getTime() / 1000;        
      this.is_on = false;
    };

    window.Text.prototype.updateSize = function(cur_time) {
      if (!this.is_expand) {return;}
      let ellapsed_time = cur_time - this.start_time;
      let cur_size = (this.target_size - this.orig_size) *  ellapsed_time  + this.orig_size;
      this.geometry.attributes.position.array = this.vertices.map(function(x) {return x * cur_size;});
      this.geometry.attributes.position.needsUpdate = true;
    }

    window.Text.prototype.createBufferGeometry = function() {
      // BufferGeometryを生成
      this.n_char = this.txt.length;
      this.geometry = new THREE.BufferGeometry();
      // 平面用の頂点を定義
      // d - c
      // |   |
      // a - b
      this.l = 10.0;
      this.l_w = this.l*this.n_char;
      this.l_h = this.l;
      this.l_z = 20.0;
      this.vertexPositions = [
        [-this.l_w, -this.l_h, this.l_z], // a
        [ this.l_w, -this.l_h, this.l_z], // b
        [ this.l_w,  this.l_h, this.l_z], // c
        [-this.l_w,  this.l_h, this.l_z]  // d
      ];

      // Typed Arrayで頂点データを保持
      this.vertices = new Float32Array(this.vertexPositions.length * 3);
      for (var i = 0; i < this.vertexPositions.length; i++) {
        this.vertices[i * 3 + 0] = this.vertexPositions[i][0];
        this.vertices[i * 3 + 1] = this.vertexPositions[i][1];
        this.vertices[i * 3 + 2] = this.vertexPositions[i][2];
      }

      // 頂点インデックスを生成
      this.indices = new Uint16Array([
          0, 1, 2,
          2, 3, 0
      ]);

      this.uv = new Float32Array([
          0.0, 1.0,
          1.0, 1.0,
          1.0, 0.0,
          0.0, 0.0 
      ]);

      // attributesを追加
      this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
      this.geometry.setIndex(new THREE.BufferAttribute(this.indices,  1));
      this.geometry.addAttribute('uv', new THREE.BufferAttribute(this.uv,2));
    }

    window.Text.prototype.createCanvas = function() {
      this.n_char = this.txt.length;
      this.canvasHeight = this.char_size * this.ratio;
      this.canvasWidth = this.char_size * this.n_char * this.ratio;
      this.txtCanvas = document.createElement('canvas');
      this.txtCanvas.width = this.canvasWidth;
      this.txtCanvas.height = this.canvasHeight;
      this.txtCanvasCtx = this.txtCanvas.getContext('2d');
      this.txtCanvasCtx.font = 'normal '+ this.char_size.toString()  +'px' + ' ' + 'Hiragino Mincho ProN';
      // txtCanvasCtx.fillStyle = '#ff00ff';
      this.txtCanvasCtx.textAlign = 'center';
      // txtCanvasCtx.rect(0,0, txtCanvas.width, txtCanvas.height);
      // txtCanvasCtx.fill();

      this.txtCanvasCtx.fillStyle = this.color;
      this.txtCanvasCtx.fillText(
          this.txt, (this.canvasWidth)/2, this.char_size
          );
    };

    window.Text.prototype.changeVisible = function(is_visible) {
      this.mesh.visible = is_visible;
    };
})();
