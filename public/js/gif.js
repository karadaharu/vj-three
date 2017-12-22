(function(){
  window.Gif = function() {
    this.imgs = [];
    this.n_imgs = this.imgs.length;
    this.cur_img = 0;
    this.gif = document.createElement('img');
    this.gif.setAttribute('src', 'img/'+this.imgs[this.cur_img]);
    this.gif.setAttribute('width', window.innerWidth);
    document.body.appendChild(this.gif);
  };
  
  window.Gif.prototype.changeGif =  function() {
    this.cur_img = this.cur_img + 1;
    if (this.n_imgs - 1 < this.cur_img) {
      this.cur_img = 0;
    }
    this.gif.setAttribute('src', 'img/'+this.imgs[this.cur_img]);
    var naturalRatio = this.gif.naturalHeight / this.gif.naturalWidth;
    var windowRatio = window.innerHeight / window.innerWidth;
    console.log(naturalRatio);
    console.log(windowRatio);
    if (windowRatio > naturalRatio) {
      this.gif.setAttribute('height', window.innerHeight);
      this.gif.removeAttribute('width');
    } else {
      this.gif.setAttribute('width', window.innerWidth);
      this.gif.removeAttribute('height');
    }
  };
})();
