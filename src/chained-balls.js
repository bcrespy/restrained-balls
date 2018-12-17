/**
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * @license MIT 
 */

import * as THREE from "three";
import AudioData from "@creenv/audio/audio-analysed-data";
import shuffle from "knuth-shuffle";

import config from "./config";


class ChainedBalls {
  /**
   * 
   * @param {THREE.Scene} scene 
   */
  constructor (scene) {
    this.scene = scene;

    /**
     * the "main" balls position, 
     * @type {Array.<THREE.Mesh>}
     */
    this.mainBalls = new Array(config.mainBallsNb);

    /**
     * all the balls position we can find between the main balls 
     * @type {Array.<THREE.Mesh>}
     */
    this.betweenBalls = new Array(config.ballsBetweenNb * config.mainBallsNb);

    /**
     * the direction in which each ball is supposed to be moving under the influence of the audio 
     * @type {Array.<THREE.Vector3>}
     */
    this.mainBallsDirections = new Array(config.mainBallsNb);

    /**
     * for each audio band, an array of indexes of all the main balls under the influence of such a frequency range
     * @type {Array.<Array.<number>>}
     */
    this.bandsBalls = new Array(8);

    /** THE MATERIALS */
    this.mainMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000
    });
    this.betweenMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });
  }

  init () {
    return new Promise((resolve, reject) => {
      // we fulfill the array of main balls 
      for (let i = 0; i < this.mainBalls.length; i++) {
        let pos = this.getRandomBallPosition();
        this.mainBalls[i] = new THREE.Mesh(new THREE.SphereGeometry(0.5), this.mainMaterial);
        this.mainBalls[i].position.copy(pos);
        this.mainBallsDirections[i] = new THREE.Vector3(Math.random(), Math.random(), Math.random());
        this.mainBallsDirections[i].normalize();
        this.scene.add(this.mainBalls[i]);
      }

      // we create the inbetween balls and then we fulfill them 
      for (let i = 0; i < this.mainBalls.length*config.ballsBetweenNb; i++) {
        this.betweenBalls[i] = new THREE.Mesh(new THREE.SphereGeometry(0.2), this.betweenMaterial);
        this.scene.add(this.betweenBalls[i]);
      }
      this.computeBetweenBallsPositions();

      this.dispatchIndexes();

      resolve();
    });
  }

  /**
   * dispatch bands indexes 
   */
  dispatchIndexes () {
    let perBand = Math.floor(config.mainBallsNb / 8);
    let allIndexes = new Array(config.mainBallsNb);
    allIndexes.map((val, idx) => idx);
    console.log("is supposed to be [1, 2, 3, ..., 150, 151]: ", allIndexes);
    shuffle(allIndexes);
    console.log("is supposed to be shuffled: ", allIndexes);
    for (let i = 0; i < 8; i++) {
      let indexesBand = allIndexes.splice(0, perBand);
      this.bandsBalls[i] = indexesBand;
    }
  }
  
  /**
   * generates a random position for the ball using a distribution where distance from center [0;1] is squared so that objects
   * are rather centered
   */
  getRandomBallPosition () {
    let rnd = Math.random();
    let r = rnd*rnd * config.maxDistance;
    let theta = Math.random()*2*Math.PI;
    let alpha = Math.random()*Math.PI;
    return new THREE.Vector3(
      r * Math.cos(theta) * Math.sin(alpha),
      r * Math.sin(theta) * Math.cos(alpha),
      r * Math.cos(alpha)
    );
  }

  /**
   * computes the position of the balls between the main balls, given the position of the main balls
   */
  computeBetweenBallsPositions () {
    for (let i = 0; i < this.mainBalls.length; i++) {
      let a = this.mainBalls[i];
      let b = this.mainBalls[(i==this.mainBalls.length-1)?0:i+1];
      let ba = new THREE.Vector3();
      ba.subVectors(b, a);
      // we parse the between balls 
      for (let j = 0; j < config.ballsBetweenNb; j++) {
        let idx = j + i*config.ballsBetweenNb;
        let gd = j/config.ballsBetweenNb;
        let c = ba.clone().multiplyScalar(gd);
        let newPos = a.clone().add(c);
        this.betweenBalls[idx].copy(newPos);
      }
    }
  }

  /**
   * 
   * @param {number} deltaT 
   * @param {number} time 
   * @param {AudioData} audioData 
   */
  render (deltaT, time, audioData) {

  }
};

export default ChainedBalls;