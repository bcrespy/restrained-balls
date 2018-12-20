import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import AudioData from "@creenv/audio/audio-analysed-data";

// the values of the config object will be modifier by user controls 
import config from "./config";

import Camera from "./camera";
import ChainedBalls from "./chained-balls";
import Particles from "./particles";

import { EffectComposer, EffectPass, RenderPass, PixelationEffect, BlendFunction } from "postprocessing";
import NoiseEffect from "./shaders/noise/noise.shader";
import AberationEffect from "./shaders/aberration/aberration.shader";



class Visualizer {
  constructor () {
    this.chainedBalls = null;
    this.particles = null;
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
      this.particles = new Particles(this.scene);


      /** EFFECT COMPOSER */
      this.composer = new EffectComposer(this.renderer, { depthTexture: true });

      this.noiseEffect = new NoiseEffect({
        blendFunction: BlendFunction.SOFT_LIGHT
      });

      this.pixellationEffect = new PixelationEffect(3);

      this.aberationEffect = new AberationEffect({
        strength: 0.0
      });

      this.eff1 = new EffectPass(this.camera.get(), this.aberationEffect, this.pixellationEffect);
      this.eff2 = new EffectPass(this.camera.get(), this.noiseEffect)
      this.eff2.renderToScreen = true;

      this.composer.addPass(new RenderPass(this.scene, this.camera.get()));
      this.composer.addPass(this.eff1);
      this.composer.addPass(this.eff2);
      /** END COMPOSER */

      document.body.appendChild(this.renderer.domElement); 

      // ORBIT CONTROLS 
      const controls = new OrbitControls(this.camera.get(), this.renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;

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
    this.camera.update(deltaT, time);
    if (audioData.peak.value == 1.0) {
      this.aberationEffect.setRandomDirections();
    }
    this.aberationEffect.strength = audioData.peak.value/100.0*config.aberationStrength;
    this.particles.update(deltaT, time, audioData);
    this.chainedBalls.update(deltaT, time, audioData);
    this.composer.render(deltaT);
  }
}

export default Visualizer;