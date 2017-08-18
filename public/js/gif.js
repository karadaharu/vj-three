(function(){
  window.Gif = function() {
    this.imgs = ['hanabi.gif', 'eye.gif'];
    this.n_imgs = this.imgs.length;
    this.cur_img = 1;
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
  };
})();
