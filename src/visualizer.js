import * as THREE from "three";
import AudioData from "@creenv/audio/audio-analysed-data";

// the values of the config object will be modifier by user controls 
import config from "./config";

import Camera from "./camera";
import ChainedBalls from "./chained-balls";

import { EffectComposer, EffectPass, RenderPass } from "postprocessing";



class Visualizer {
  constructor () {
    this.chainedBalls = null;
  }

  init () {
    return new Promise((resolve, reject) => {
      this.scene = new THREE.Scene();
      this.camera = new Camera(this.scene);
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this._onResize();

      /** SCENE ELEMENTS */
      this.chainedBalls = new ChainedBalls(this.scene);

      /** EFFECT COMPOSER */
      this.composer = new EffectComposer(this.renderer, { depthTexture: true });

      this.renderPass = new RenderPass(this.scene, this.camera.get());
      this.renderPass.renderToScreen = true;

      this.composer.addPass(this.renderPass);
      /** END COMPOSER */

      document.body.appendChild(this.renderer.domElement); 


      // BINDIGNS 
      this._onResize = this._onResize.bind(this);

      // EVENTS 
      window.addEventListener("resize", this._onResize);

      this.chainedBalls.init().then(resolve).catch(reject);
    });
  }

  _onResize () {
    this.camera._onResize();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
 
  /**
   * @param {number} deltaT the time elapsed since last frame call
   * @param {number} time the total elapsed time since the beginning of the app
   * @param {AudioData} audioData analysed audio data
   */
  render (deltaT, time, audioData) {
    //this.renderer.render(this.scene, this.camera.get());
    this.composer.render(deltaT);
  }
}

export default Visualizer;