var p = new Promise((resolve, reject) => {
  setTimeout( () => {
    resolve("success!");
  }, 500);
});
var v;
p.then( (value) => {
  v = value;
  console.log(v);
});