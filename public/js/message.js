(function(){
  window.Socket = function(){
    // 1.イベントとコールバックの定義
    this.io = io();
    this.io.on("connected", function() {});
    this.io.on("publish", (data) => { 
      this.addMessage(data.value); 
    });
    this.words = "";
    this.io.on("onchange", (values) => {
      if ( 'words' in values ) {
        this['words'] = values['words'];
        $('#message').val(values['words']);
      }
    });
  }

  var socket = new window.Socket();

  $('.btn').on('click', function(){
    console.log('click');
    socket.io.emit('change', {'words':$('#message').val()});
  });
})();
