/**
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * @license MIT 
 */

import * as THREE from "three";
import AudioData from "@creenv/audio/audio-analysed-data";
import { knuthShuffle } from "knuth-shuffle";

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
     * the original position of the main balls 
     * @type {Array.<THREE.Vector3}
     */
    this.originalBallsPosition = new Array(config.mainBallsNb);

    /**
     * for each audio band, an array of indexes of all the main balls under the influence of such a frequency range
     * @type {Array.<Array.<number>>}
     */
    this.bandsBalls = new Array(8);

    /** THE MATERIALS */
    this.mainMaterial = new THREE.MeshBasicMaterial({
      color: 0x444444
    });
    this.betweenMaterial = new THREE.MeshBasicMaterial({
      color: 0x111111
    });
  }

  init () {
    return new Promise((resolve, reject) => {
      // we fulfill the array of main balls 
      for (let i = 0; i < this.mainBalls.length; i++) {
        let pos = this.getRandomBallPosition();
        this.mainBalls[i] = new THREE.Mesh(new THREE.SphereGeometry(0.4), this.mainMaterial);
        this.mainBalls[i].position.copy(pos);
        this.originalBallsPosition[i] = pos;
        this.mainBallsDirections[i] = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
        this.mainBallsDirections[i].normalize();
        this.scene.add(this.mainBalls[i]);
      }

      // we create the inbetween balls and then we fulfill them 
      for (let i = 0; i < this.mainBalls.length*config.ballsBetweenNb; i++) {
        this.betweenBalls[i] = new THREE.Mesh(new THREE.SphereGeometry(0.15), this.betweenMaterial);
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
    for (let i = 0; i < config.mainBallsNb; i++) {
      allIndexes[i] = i;
    }
    knuthShuffle(allIndexes);
    for (let i = 0; i < 8; i++) {
      let indexesBand = allIndexes.splice(0, perBand);
      this.bandsBalls[i] = indexesBand;
    }
    allIndexes.forEach((idx) => {
      this.bandsBalls[0].push(idx);
    });
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
      let a = this.mainBalls[i].position;
      let b = this.mainBalls[(i==this.mainBalls.length-1)?0:i+1].position;
      let ba = new THREE.Vector3();
      ba.subVectors(b, a);
      // we parse the between balls 
      for (let j = 0; j < config.ballsBetweenNb; j++) {
        let idx = j + i*config.ballsBetweenNb;
        let gd = j/config.ballsBetweenNb;
        let c = ba.clone().multiplyScalar(gd);
        let newPos = a.clone().add(c);
        this.betweenBalls[idx].position.copy(newPos);
      }
    }
  }

  /**
   * 
   * @param {number} deltaT 
   * @param {number} time 
   * @param {AudioData} audioData 
   */
  update (deltaT, time, audioData) {
    let treble2 = config.trebleRandomness/2.0;
    // we update the balls given the audio data 
    for (let i = 0; i < 8; i++) {
      // for each band, we update the balls positions 
      this.bandsBalls[i].forEach((index) => {
        // index is the index of the ball in the array 
        let pos = this.originalBallsPosition[index];
        let rx = (Math.random()*config.trebleRandomness-treble2);
        let ry = (Math.random()*config.trebleRandomness-treble2);
        let rz = (Math.random()*config.trebleRandomness-treble2);
        pos.x+= rx + rx * audioData.energy * config.energyTreble;
        pos.y+= ry + ry * audioData.energy * config.energyTreble;
        pos.z+= rz + rz * audioData.energy * config.energyTreble;
        // we add the randomness to the original position 

        // attracted by the center 
        let c = new THREE.Vector3().sub(pos);
        c.normalize();
        pos.add(c.multiplyScalar(config.centerAttraction));


        let ball = this.mainBalls[index];
        let direction = this.mainBallsDirections[index];
        let movement = direction.clone().multiplyScalar(audioData.multibandEnergy[i]*0.1);
        ball.position.set(
          pos.x + movement.x,
          pos.y + movement.y,
          pos.z + movement.z,
        );
        ball.scale.set(1+audioData.energy/50.0, 1+audioData.energy/50.0, 1+audioData.energy/50.0)
      });
    }
    
    // we update the links 
    this.computeBetweenBallsPositions();
  }
};

export default ChainedBalls;