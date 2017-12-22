(function(){
  window.Socket = function(onChangeCallback){
    // 1.イベントとコールバックの定義
    this.socketio = io();
    this.socketio.on("connected", function() {});
    this.socketio.on("publish", (data) => { 
      this.addMessage(data.value); 
    });
    this.sound_limit = 30;
    this.is_gif = false;
    this.is_text = false;
    this.is_cube = false;
    this.is_win = false;
    this.is_win_rand = false;
    this.is_glitch = false;
    this.is_gen_txt = false;
    this.mirror_mode = 0;
    this.bpm = 120;
    this.text_size = 1;
    this.socketio.on("onchange", (values) => {
      this.onChange(values);
      for ( var key in values ) {
        this[key] = values[key];
      }
    });
    this.onChange = onChangeCallback;
  }

  window.Socket.prototype.addMessage = function(msg) {
    this.msg = msg;
    // var m = document.getElementById("message");
    // m.textContent = msg;
  };

  window.Socket.prototype.getSentence = function() {
    this.socketio.emit('get');
  }


})();

