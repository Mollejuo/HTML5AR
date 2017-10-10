/*
Copyright 2017 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

//'use strict';
var resize_called =false;
var videoElement = document.querySelector('video');
//var audioSelect = document.querySelector('select#audioSource');
//var videoSelect = document.querySelector('select#videoSource');
var back_camera_id=null;
navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


function gotSources(sourceInfos) {
  for (var i = 0; i !== sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    //var option = document.createElement('option');
    //option.value = sourceInfo.deviceId;
    if (sourceInfo.kind === 'audiooutput') {
      //option.text = sourceInfo.label || 'microphone ' +
       // (audioSelect.length + 1);
      //audioSelect.appendChild(option);
    } else if (sourceInfo.kind === 'videoinput') {
      //$('#test').append('cam'+option.value+"<br>");
      //option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
      //videoSelect.appendChild(option);
      back_camera_id=sourceInfo.deviceId;

    } else {
      //console.log('Some other kind of source: ', sourceInfo);
    }
  }

  start();
}

// if (typeof MediaStreamTrack === 'undefined' ||
//     typeof MediaStreamTrack.getSources === 'undefined') {
//   alert('This browser does not support MediaStreamTrack.getSources().');
// } else {
  navigator.mediaDevices.enumerateDevices().then(function(e) {
    gotSources(e);
  });
//}

function successCallback(stream) {

  window.stream = stream; // make stream available to console
  //videoElement.pause();
  videoElement.src = window.URL.createObjectURL(stream);

   videoElement.play();
  //videoElement.load();
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function start() {

  $('#the-loader-overlay').css('width',$(window).width()+"px");
  $('#the-loader-overlay').css('height',$(window).height()+"px");
  if (window.stream) {
    //videoElement.src = null;
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  //var audioSource = audioSelect.value;
  var videoSource = back_camera_id;//videoSelect.value;
  //$('#test').append('bcid: '+back_camera_id+"<br>");
  var constraints = {
    // audio: {
    //   optional: [{
    //     sourceId: audioSource
    //   }]
    // },
    video: {
      optional: [{
        sourceId: videoSource
      }]
    }
  };
  navigator.getUserMedia(constraints, successCallback, errorCallback);

  setTimeout(function () {
    if(resize_called==false) {
      $(window).resize();
      resize_called = true;
      setTimeout(function () {
        $('#the-loader-overlay').remove();
      },1000);

    }
  },2000);
}

//audioSelect.onchange = start;
//videoSelect.onchange = start;

//start();

