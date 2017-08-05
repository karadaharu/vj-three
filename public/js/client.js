var socketio = io();
// 1.イベントとコールバックの定義
// var socketio = io.connect('http://localhost:8080');

socketio.on("connected", function() {});
socketio.on("publish", function (data) { addMessage(data.value); });
// socketio.on("disconnect", function () {});

// // 2.イベントに絡ませる関数の定義
function addMessage(msg) {
  console.log(msg);
  var m = document.getElementById("message");
  m.textContent = msg;
}
// function publishMessage() {
//   // var textInput = document.getElementById('msg_input');
//   // var msg = "[" + myName + "] " + textInput.value;
//   var msg ='a';
//   socketio.emit("publish", {value: msg});
//   textInput.value = '';
// }
//
// function addMessage (msg) {
//   console.log(msg);
//   // var domMeg = document.createElement('div');
//   // domMeg.innerHTML = new Date().toLocaleTimeString() + ' ' + msg;
//   // msgArea.appendChild(domMeg);
// }
//
// 3.開始処理
// socketio.emit("connected");
