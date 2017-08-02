var kuromoji = require('kuromoji');
var fs = require('fs');

// この builder が辞書やら何やらをみて、形態素解析機を造ってくれるオブジェクトです。
var builder = kuromoji.builder({
  // ここで辞書があるパスを指定します。今回は kuromoji.js 標準の辞書があるディレクトリを指定
  dicPath: 'node_modules/kuromoji/dict'
});

var Markov = function(word, hira) {
  this.word = word;
  this.hira = hira;
  this.next_words = [];
  this.next_counts = [];
  this.next_probs = [];
}

Markov.prototype.add = function(next_word) {
  var nex_w_ind = this.next_words.indexOf(next_word);
  if (nex_w_ind > -1) {
    this.next_counts[nex_w_ind] += 1;
  } else {
    this.next_words.push(next_word);
    this.next_counts.push(1);
  }
}

Markov.prototype.calc_prob = function() {
  var sum = this.next_counts.reduce((a,b) => a+ b, 0);
  var cur = 0;
  for (var i = 0; i < this.next_counts.length; i++) {
    cur += this.next_counts[i];
    this.next_probs.push(cur*1.0/(sum*1.0));
  }
}

Markov.prototype.get_next = function() {
  var r = Math.random();
  var i = 0;
  while(this.next_probs[i] < r) {
    i++;
  }
  return this.next_words[i];
}

var words = [];
var markovs = [];

// 形態素解析機を作るメソッド
builder.build(function(err, tokenizer) {
  // 辞書がなかったりするとここでエラーになります(´・ω・｀)
  if(err) { throw err; }

  // tokenizer.tokenize に文字列を渡すと、その文を形態素解析してくれます。
  fs.readFile('data/godzilla.md', 'utf8', function(err, data) {
    if (err) throw err;
    var tokens = tokenizer.tokenize(data);
    for ( var i = 0, len = Object.keys(tokens).length; i < len; i++) {
      if ( i == len - 1) { continue; }
      var ind = words.indexOf(tokens[i]["surface_form"]);
      if (ind > -1) {
        markovs[ind].add(tokens[i+1]["surface_form"]);
      } else {
        words.push(tokens[i]["surface_form"]);
        var m = new Markov(tokens[i]["surface_form"], tokens[i]["pronunciation"]);
        m.add(tokens[i+1]["surface_form"]);
        markovs.push(m);
      }
    }
    for (var i = 0; i < markovs.length; i ++ ) {
      markovs[i].calc_prob();
    }
    var start_i = words.indexOf('\n');
    var sentence = '';
    console.log();
    var w = markovs[start_i].get_next();
    while ( w !== '\n') {
      sentence += w;
      i = words.indexOf(w);
      w = markovs[i].get_next();
    }
    console.log(sentence);
  });
});



