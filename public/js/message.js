(function(){
  window.Socket = function(){
    // 1.イベントとコールバックの定義
    this.socketio = io();
    this.socketio.on("connected", function() {});
    this.socketio.on("publish", (data) => { 
      this.addMessage(data.value); 
    });
    this.words = "";
    this.socketio.on("onchange", (values) => {
      if ( 'words' in values ) {
        this['words'] = values['words'];
        $('#message').val(values['words']);
      }
    });
  }

  var socket = new window.Socket();
})();
