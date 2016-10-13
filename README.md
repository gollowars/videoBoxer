# videoBoxer

videoBoxer is simple video backgrounds width jQuery

## requred
jQuery


## install
```
npm install videoBoxer
```

## example
```
import VideoBoxer from 'VideoBoxer'

let movieArray = ['/videos/sample.mp4','/videos/sample.ogv','/videos/sample.webm']
let options = {
  movieSize: {
    width: 582,
    height: 360
  },
  thumb: '/videos/sample.png'
}

this.videoBoxer = new VideoBoxer($('#movieArea'),movieArray,options)
```
