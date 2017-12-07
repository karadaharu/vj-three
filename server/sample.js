var Sample = function() {
  this.init();
}

Sample.prototype.init = () => {
  var p = new Promise((resolve, reject) => {
    setTimeout( () => {
      resolve("success!");
    }, 1000);
  });

  p.then( (value) => {
    this.v = value;
  });
}

var sample = new Sample();
console.log(sample);
