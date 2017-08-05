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
    this.speed = 0.1;
  }
  
  var controller = new Controller();
  var gui = new dat.GUI({
  });
  
  var sound_limit = 200;
  var speed_gui = gui.add(controller, 'speed', 0, 255);
  speed_gui.onFinishChange(function(value){
    socket.io.emit('change', {sound_limit:value});
  });

})();

