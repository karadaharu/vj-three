var fs = require('fs');
var makorvs, words;
var p_markovs = new Promise((resolve, reject) => {
  fs.readFile('markovs.json', 'utf8', (err, data) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(data);
  });
});
var p_words = new Promise((resolve, reject) => {
  fs.readFile('words.json', 'utf8', (err, data) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(data);
  });
});

var Markov = function(data) {
  this.word = data['word'];
  this.hira = data['hira'];
  this.next_words = data['next_words'];
  this.next_probs = data['next_probs'];
}

Markov.prototype.get_next = function() {
  var r = Math.random();
  var i = 0;
  while(this.next_probs[i] < r) {
    i++;
  }
  return this.next_words[i];
}

Promise.all([p_markovs, p_words]).then(function(values) {
  markovs_json = JSON.parse(values[0]); //now it an object
  markovs = markovs_json.map((m) => {return new Markov(m);});
  words = JSON.parse(values[1]); //now it an object
  var start_i = words.indexOf('\n');

  var sentence = '';
  var w = markovs[start_i].get_next();

  while ( w !== '\n') {
    sentence += w;
    i = words.indexOf(w);
    w = markovs[i].get_next();
  }
  console.log(sentence);
}, function(reason){
  console.log(reason);
});
