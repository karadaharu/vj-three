var kuromoji = require('kuromoji');

// この builder が辞書やら何やらをみて、形態素解析機を造ってくれるオブジェクトです。
var builder = kuromoji.builder({
  // ここで辞書があるパスを指定します。今回は kuromoji.js 標準の辞書があるディレクトリを指定
  dicPath: 'node_modules/kuromoji/dict'
});

// 形態素解析機を作るメソッド
builder.build(function(err, tokenizer) {
  // 辞書がなかったりするとここでエラーになります(´・ω・｀)
  if(err) { throw err; }

  // tokenizer.tokenize に文字列を渡すと、その文を形態素解析してくれます。
  var tokens = tokenizer.tokenize("今日は森へ行った");
  for ( var i = 0, len = Object.keys(tokens).length; i < len; i++) {
    console.log(tokens[i]["surface_form"]);
  }
});


var fs = require('fs')
fs.readFile('data/godzilla.md', 'utf8', function(err, data) {
  if (err) throw err;
  console.log(data)
});
