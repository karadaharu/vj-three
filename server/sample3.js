var Sample = function(data) {
  this.data = data;
}

module.exports.prepare = function(callback) {
  var p = new Promise((resolve, reject) => {
    setTimeout( () => {
      var sample = new Sample("success!");
      resolve(sample);
    }, 1000);
  });
  
  p.then((sample) => {
    callback(sample);
  });
}
