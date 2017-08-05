(function(){
  window.Socket = function(){
    // 1.イベントとコールバックの定義
    this.socketio = io();
    this.socketio.on("connected", function() {});
    this.socketio.on("publish", (data) => { 
      this.addMessage(data.value); 
    });
  }

  window.Socket.prototype.addMessage = function(msg) {
    this.msg = msg;
    console.log(msg);
    var m = document.getElementById("message");
    m.textContent = msg;
  };

  window.Socket.prototype.getSentence = function() {
    console.log('getget');
    this.socketio.emit('get');
  }

})();

