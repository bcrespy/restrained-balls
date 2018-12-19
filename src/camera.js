/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * 
 **/

import * as THREE from "three";
import OrbitControls from "three";

import config from "./config";


class Camera {
  /**
   * 
   * @param {THREE.Scene} scene 
   * @param {THREE.Vector3} position 
   */
  constructor (scene, position = new THREE.Vector3(0, 0, config.cameraDistance)) {
    this.scene = scene;

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = config.cameraDistance;
    //this.camera.position.set(position.x, position.y, position.z);
    this.camera.lookAt(0, 0, 0);
  }

  _onResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  get () {
    return this.camera;
  }

  update (deltaT, time) {
    let x = config.cameraDistance * Math.cos(time/3000.0*config.rotationSpeed);
    let z = config.cameraDistance*1.7 * Math.sin(time/3000.0*config.rotationSpeed);
    this.camera.position.setX(x);
    this.camera.position.setZ(z);
    this.camera.lookAt(0,0,0);
  }
};

export default Camera;