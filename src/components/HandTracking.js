//import logo from './logo.svg';

import React, {useRef, useState} from 'react'
import "@tensorflow/tfjs-backend-webgl";
import * as handpose from "@tensorflow-models/handpose"
import Webcam from 'react-webcam'
import { drawHand } from './utility';
import * as fp from "fingerpose"



function HandTracking() {
  const webcamRef= useRef(null)
  const canvasRef=useRef(null)

  const [pose, setPose]= useState(null)

  const runHandpose = async () =>{
    const net = await handpose.load()
    console.log('Handpose model loaded')
    // loop detect hands
    setInterval (()=>{
      detect(net)
    }, 100)
  };

  const detect = async (net) => {
    //check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState ===4
    ){
      //get video proportion
      const video = webcamRef.current.video
  
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight

      //set video proportion
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      //set canvas
      canvasRef.current.width= videoWidth
      canvasRef.current.height= videoHeight

      //make detections
      const hand = await net.estimateHands(video)

      if(hand.length >0){
        const GE = new fp.GestureEstimator([
    
          // add "✌🏻" and "👍" as sample gestures
          fp.Gestures.ThumbsUpGesture,
      ]);
     
      const gesture = await GE.estimate(hand[0].landmarks,8)

      if(gesture.gestures !== undefined && gesture.gestures.length >0){
        const confidence = gesture.gestures.map(
          (prediction) => prediction.score
        )
        console.log('confidence array:', confidence)
        const maxCon = confidence.indexOf(Math.max.apply(null, confidence))
        console.log('maxCon:', maxCon)

        setPose(gesture.gestures[maxCon].name);
        console.log('pose:', pose);
      }
     
      }

      const ctx = canvasRef.current.getContext("2d")
      drawHand(hand, ctx)
      return pose;
    }
  }

  runHandpose()

  return (
    <div className="App">
      <header className="App-header">
        <Webcam 
        ref={webcamRef}
        style={{
            position:"absolute",
            marginLeft:"top",
            marginRight:"auto",
            paddingLeft:25,
            left:0,
            right:0,
            textAlign: "center",
            zindex: 9,
            width: 200,
            height: 200,
        }}
       />
       <canvas
       ref={canvasRef}
       style={{
        position:"absolute",
          marginLeft:"top",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign: "center",
          zindex: 9,
          width: 200,
          height: 200,
       }}/>

      </header>
    </div>
  );
}

export default HandTracking;