/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * 
 * 
 **/

import * as THREE from "three";


class Camera {
  /**
   * 
   * @param {THREE.Scene} scene 
   * @param {THREE.Vector3} position 
   */
  constructor (scene, position = new THREE.Vector3(0, 0, 10)) {
    this.scene = scene;

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
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

  }
};

export default Camera;