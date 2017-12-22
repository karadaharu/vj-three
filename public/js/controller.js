(function(){
  window.Socket = function(controller, gif_gui){
    // 1.イベントとコールバックの定義
    this.io = io();
    this.io.on("connected", function() {});
    this.io.on("publish", (data) => { 
      console.log(data);
    });
    this.io.on("file_change", (data) => {
      for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].indexOf('.gif') != -1) {
          var file = data[i].replace(".gif","");
          if (!(file in this.controller)) {
            this.controller[file] = false;
            this.buttons[this.n_buttons]= this.gif_gui.add(this.controller, file);
            this.names[this.n_buttons++] = file;
          }
        }
      }

     this.buttons.map((button, i) => {
        button.onFinishChange((value)=>{
          if (value) {
            socket.io.emit('change', {['gif_add']:this.names[i]});
          } else {
            socket.io.emit('change', {['gif_remove']:this.names[i]});
          }
        });
      });
    });
    this.controller = controller;
    this.gif_gui = gif_gui;
    this.buttons = [];
    this.names = [];
    this.n_buttons = 0;
  }

  window.Socket.prototype.addMessage = function(msg) {
    this.msg = msg;
    // console.log(msg);
    // var m = document.getElementById("message");
    // m.textContent = msg;
  };

  window.Socket.prototype.getSentence = function() {
    console.log('getget');
    this.socketio.emit('get');
  }



  var Controller = function() {
    this.sound_limit = 0.1;
    this.is_gif = false;
    this.is_text = false;
    this.is_cube = false;
    this.is_win = false;
    this.is_win_rand = false;
    this.is_glitch = false;
    this.is_gen_txt = false;
    this.is_morph = false;
    this.is_morph_rand = false;
    this.is_morph_wire = false;
    this.is_col_diff = false;
    this.words = 'HONGO SALOON,ようこそ,Merry Christmas';
    this.bpm = 120;
    this.mirror_mode = 0;
    this.text_size = 1;
    this.morph_size = 100;
  }
  
  var controller = new Controller();
  var gui = new dat.GUI({});
  
  var names = ['is_gif', 'is_text', 'is_cube', 'is_win','is_win_rand','is_glitch','is_gen_txt', 'is_morph','is_morph_rand','is_morph_wire','is_col_diff','words', 'sound_limit', 'bpm', 'mirror_mode', 'text_size', 'morph_size'];
  var buttons = [];
  var len = names.length-5;
  for (var i = 0; i < len; i++) {
    buttons[i] = gui.add(controller, names[i]);
  }
  buttons[len] = gui.add(controller, 'sound_limit', 0, 255);
  buttons[len+1] = gui.add(controller, 'bpm', 0, 255);
  buttons[len+2] = gui.add(controller, 'mirror_mode', 0, 7).step(1);
  buttons[len+3] = gui.add(controller, 'text_size', 0, 10);
  buttons[len+4] = gui.add(controller, 'morph_size', 0, 200);


  var gifs = gui.addFolder('GIF');

  buttons.map((button, i) => {
    button.onFinishChange((value)=>{
      socket.io.emit('change', {[names[i]]:value});
    });
  });

  var socket = new window.Socket(controller, gifs);

})();
