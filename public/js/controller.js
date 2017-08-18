(function(){
  window.Socket = function(){
    // 1.イベントとコールバックの定義
    this.io = io();
    this.io.on("connected", function() {});
    this.io.on("publish", (data) => { 
      console.log(data);
    });
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

  var socket = new window.Socket();


  var Controller = function() {
    this.sound_limit = 0.1;
    this.is_gif = false;
    this.is_text = false;
    this.is_cube = false;
    this.is_glitch = false;
  }
  
  var controller = new Controller();
  var gui = new dat.GUI({
  });
  
  var names = ['is_gif', 'is_text', 'is_cube', 'is_glitch', 'sound_limit'];
  var buttons = [];
  for (var i = 0, len = names.length - 1; i < len; i++) {
    buttons[i] = gui.add(controller, names[i]);
  }
  buttons[names.length-1] = gui.add(controller, 'sound_limit', 0, 255);

  buttons.map((button, i) => {
    button.onFinishChange((value)=>{
      socket.io.emit('change', {[names[i]]:value});
    });
  });
})();

