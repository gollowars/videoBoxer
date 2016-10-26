'use strict'

module.exports = class VideoBoxer {
  ////////////////////
  //@pram (object: jQueryObject, array: videoFiles, object: options)
  ////////////////////

  constructor(ele,files,options){
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
    
    this.movieSize = this.options.movieSize
    this.movieSize.height = this.movieSize.height - (this.movieSize.marign*2)
    this.autoplay = this.options.autoplay
    this.loop = this.options.loop
    this.controls = this.options.controls
    this.muted = this.options.muted
    this.thumb = this.options.thumb

    this.init()
  }

  init(){

    this.appendMovieDom()
    this.fixMovieSizeOffset()

    $(window).on('resize.videoBoxer',()=>{this.fixMovieSizeOffset()})
    this.video[0].addEventListener('canplay',()=>{this.onCanPlayHandler()})
  }

  appendMovieDom(){
    let autoplay = (this.autoplay) ? 'autoplay' : ''
    let loop = (this.loop) ? 'loop' : ''
    let muted = (this.muted) ? 'muted' : ''
    let controls = (this.controls) ? 'controls' : ''

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

    ////////////////////
    // style
    ////////////////////
    if(this.targetEle.css('position') == 'static'){
      this.targetEle.css('position','relative')
    }
    this.video = $(dom)
    this.video.css({
      position:'absolute',
      top: "50%",
      left: "50%",
      verticalAlign:'top'
    })


    this.targetEle.append(this.video)
  }

  onCanPlayHandler(){
    this.targetEle.trigger('videoBoxer::canplay')
  }

  fixMovieSizeOffset(){
    this.boxW = this.targetEle.outerWidth() + 5
    this.boxH = this.targetEle.outerHeight() + 5

    var width = 0
    var height = 0

    let hRatioDiff = this.boxH/this.boxW - this.movieSize.height/this.movieSize.width
    let opticalHScale = this.boxH/this.movieSize.height

    if(hRatioDiff > 0){
      height = this.boxH*opticalHScale
      width = Math.ceil(this.boxH*this.movieSize.width/this.movieSize.height)

    }else {
      width = this.boxW
      let tempBoxH = this.movieSize.height + (this.movieSize.marign*2)
      height = Math.ceil(this.boxW*tempBoxH/this.movieSize.width)
    }

    // console.log('act width : ',width)

    this.video.css({
      width: width + 'px',
      height: height + 'px',
      marginLeft: -width/2 + 'px',
      marginTop: -(height/2) + 'px'
    })
  }

  //API
  pause(){
    this.video[0].pause()
  }
  play(){
    this.video[0].play()
  }
  restart(){
    this.video[0].restart()
  }
}