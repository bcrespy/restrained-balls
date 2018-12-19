import { Uniform, Vector2 } from "three";
import { Effect, BlendFunction } from "postprocessing";

// Using rollup-plugin-string to import text files.
import fragment from "./aberration.frag";


const NB_STRECHES = 10;


class AberrationEffect extends Effect {
	constructor(options) {
    let directions = null;
    
		super("aberrationEffect", fragment, {
			blendFunction: BlendFunction.NORMAL,
			uniforms: new Map([
        [ "directions", { type: "v2v", value: directions } ],
        [ "strength", { type: "f", value: options.strength } ],
			])
    });
    
    this.setRandomDirections();
		
		this.distanceMin = options.distanceMin;
		this.distanceRange = options.distanceRange; 
  }
  
  set strength (strength) {
    this.uniforms.get("strength").value = strength;
  }

	setRandomDirections () {
		this.uniforms.get("directions").value = this.generateRandomDirections();
  }
  
  generateRandomDirections () {
    let dists = new Array();
		dists[0] = this.generateRandomDirection();
		dists[1] = this.generateRandomDirection();
    dists[2] = this.generateRandomDirection();
    return dists;
  }

  generateRandomDirection () {
    let angle = Math.random() * 2 * Math.PI;
    return new Vector2(Math.cos(angle), Math.sin(angle));
  }
};

export default AberrationEffect;