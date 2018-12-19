/**
 * The particles in this projet are not true particles, because their size needs to change over time, I found it easier 
 * to use low poly spheres instead, due to the fact that quality will be "crushed" by the pixelation effect. When the "particle"
 * term will be used wihtin this file, it will refer to a Sphere.
 * The particles follow a simple model, where only a speed and a direction are affected to them
 */


import * as THREE from "three";
import AudioData from "@creenv/audio/audio-analysed-data";
import config from "./config";


class Particles {
  /**
   * 
   * @param {THREE.Scene} scene 
   */
  constructor (scene) {
    this.scene = scene;
    /**
     * this array keeps track of the existing particles added to the scene 
     * @type {Array.<THREE.Mesh>}
     */
    this.particles = new Array();

    /**
     * the direction of the particules 
     * @type {Array.<THREE.Vector3>}
     */
    this.directions = new Array();

    /**
     * the speed of the particles 
     * @type {Array.<number>}
     */
    this.velocities = new Array();

    // a list of available colors 
    this.materials = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
      new THREE.MeshBasicMaterial({ color: 0x0000ff })
    ];

    // low poly sphere geometry
    this.geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
  }
  
  /**
   * Generates particles with a "random" color among those available, 
   * @param {number} number the number of particles to generate
   */
  generateParticles (number) {
    for (let i = 0; i < number; i++) {
      let particle = new THREE.Mesh(this.geometry, this.materials[i%3]);
      let direction = new THREE.Vector3(
        Math.random()-0.5, Math.random()-0.5, Math.random()-0.5
      );
      direction.normalize();
      let velocity = Math.random()*config.velocity + 0.1;

      this.particles.push(particle);
      this.directions.push(direction);
      this.velocities.push(velocity);
      
      this.scene.add(particle);
    }
  }

  /**
   * 
   * @param {number} deltaT 
   * @param {number} time 
   * @param {AudioData} audioData 
   */
  update (deltaT, time, audioData) {
    if (audioData.peak.value === 1) {
      this.generateParticles(audioData.peak.energy * config.coloredBallsNumber);
    }

    // we parse the particles for an update 
    let end = this.particles.length-1;
    for (let i = end; i >= 0; i--) {
      let particle = this.particles[i];
      let scl = particle.scale.x*(1-config.scaleDecrease);
      if (scl < 0.05) {
        // if the particle is considered too tiny to be seend, we destroy it 
        this.scene.remove(particle);
        this.particles.splice(i, 1);
        this.directions.splice(i, 1);
        this.velocities.splice(i, 1);
      } else {
        particle.position.add(this.directions[i].clone().multiplyScalar(this.velocities[i]));
        particle.scale.set(scl, scl, scl);
      }
    }
  }
};

export default Particles;