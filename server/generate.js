var Bot = function(markovs, words) {
  this.markovs = markovs;
  this.words = words;
}


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

Bot.prototype.gen_sentence = function() {
  var start_i = this.words.indexOf('\n');
  var sentence = '';
  var w = this.markovs[start_i].get_next();

  while ( w !== '\n') {
    sentence += w;
    i = this.words.indexOf(w);
    w = this.markovs[i].get_next();
  }
  return sentence;
}

module.exports.build = function(callback) {
  var fs = require('fs');
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

  Promise.all([p_markovs, p_words]).then( (values) => {
    var markovs_json = JSON.parse(values[0]); //now it an object
    var markovs = markovs_json.map((m) => {return new Markov(m);});
    var words = JSON.parse(values[1]); //now it an object
    var bot = new Bot(markovs, words);
    callback(bot);
  }, function(reason){
    console.log(reason);
  });
}
