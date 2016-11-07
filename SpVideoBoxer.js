'use strict'
let boxersCnt = 0

module.exports = class SpVideoBoxer {

  constructor(ele,files,options){
    boxersCnt++
    this.targetEle = ele
    this.files = files
    this.options = {
      movieSize: {
        width: 1366,
        height: 768,
        margin: 0
      },
      thumb: '',
      autoplay: true,
      loop: true,
      muted: true,
      controls: false
    }

    $.extend(true, this.options, options)
    
    this.canplay = false
    this.ctime = 0
    this.lastTime = 0

    this.movieSize = this.options.movieSize
    this.optScale = 2

    this.movieSize.height = this.movieSize.height
    this.autoplay = this.options.autoplay
    this.loop = this.options.loop
    this.controls = this.options.controls
    this.muted = this.options.muted
    this.thumb = this.options.thumb

    this.init()
  }

  init(){

    this.appendMovieCanvas()
    this.fixMovieSizeOffset()

    $(window).on('resize.videoBoxer',()=>{this.fixMovieSizeOffset()})
    this.virtualVideo.addEventListener('canplay',()=>{this.onCanPlayHandler()})
  }

  appendMovieCanvas(){
    let autoplay = (this.autoplay) ? 'autoplay' : ''
    let loop = (this.loop) ? 'loop' : ''
    let muted = (this.muted) ? 'muted' : ''
    let controls = (this.controls) ? 'controls' : ''

    if(this.targetEle.css('position') == 'static'){
      this.targetEle.css('position','relative')
    }

    let canvas = document.createElement('canvas')
    canvas.id = `spVideoBoxer${boxersCnt}`
    canvas.width = this.movieSize.width
    canvas.height = this.movieSize.height
    this.targetEle.append(canvas)
    this.canvas = canvas

    var dom = `<video id="videoBoxerVideo" ${autoplay} ${muted} ${controls} ${loop} poster="${this.thumb}">`

    this.files.forEach(function(filename){
      let values = filename.split('.')
      let type = values[values.length-1]
      switch(type){
        case 'mp4':
          dom+= `<source src="${filename}" type="video/mp4" />`
          break
        case 'ogv':
          dom+= `<source src="${filename}" type="video/ogg" />`
          break
        case 'webm':
          dom+= `<source src="${filename}" type="video/webm" />`
          break
      }
    })


    dom+= '</video>'

    $('body').append($(dom))
    this.virtualVideo = $('#videoBoxerVideo')[0]
    $('#videoBoxerVideo').css({'display':'none'})
    


    this.ctx = document.getElementById(`spVideoBoxer${boxersCnt}`).getContext("2d")

    this.video = $(`#${canvas.id}`)
    this.video.css({
      position:'absolute',
      top: "50%",
      left: "50%",
      verticalAlign:'top'
    })

  }

  onCanPlayHandler(){
    if(this.canplay == false){
      this.canplay = true
      this.targetEle.trigger('videoBoxer::canplay')
    }
  }

  fixMovieSizeOffset(){
    this.boxW = this.targetEle.outerWidth() + 5
    this.boxH = this.targetEle.outerHeight() + 5

    var width = 0
    var height = 0

    let hRatioDiff = this.boxH/this.boxW - this.movieSize.height/this.movieSize.width

    if(hRatioDiff > 0){
      height = this.boxH
      width = Math.ceil(this.boxH*this.movieSize.width/this.movieSize.height)

    }else {
      width = this.boxW
      let tempBoxH = this.movieSize.height
      height = Math.ceil(this.boxW*tempBoxH/this.movieSize.width)
    }

    this.video.css({
      width: width + 'px',
      height: height + 'px',
      marginLeft: -width/2 + 'px',
      marginTop: -(height/2) + 'px',
      transform:'scale(1.0,1.0)'
    })

  }

  //API
  pause(){
  }
  play(){
    Logger.debug('play')
    this.lastTime = Date.now()
    setInterval(()=>{
      var curTime = Date.now()
      var diff = Date.now() - this.lastTime
      this.lastTime = curTime
      this.ctime += diff/1000
      this.virtualVideo.currentTime = this.ctime
      this.ctx.drawImage(this.virtualVideo, 0, 0, this.movieSize.width, this.movieSize.height)
      if(this.virtualVideo.duration <= this.virtualVideo.currentTime){
          this.ctime = 0
      }
    }, 1000/40)
  }
  restart(){
  }
}