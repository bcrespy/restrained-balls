import { Uniform, Vector2 } from "three";
import { Effect, BlendFunction } from "postprocessing";

// Using rollup-plugin-string to import text files.
import fragment from "./noise.frag";


const NB_STRECHES = 10;


class NoiseEffect extends Effect {
	constructor(options) {
		super("noiseEffect", fragment, {
			blendFunction: BlendFunction.ADD,
			uniforms: new Map([
        [ "opacity", { type: "f", value: 0.2 } ],
			])
    });
  }
  
  set strength (strength) {
    this.uniforms.get("strength").value = strength;
  }
};

export default NoiseEffect;