import { Uniform, Vector2 } from "three";
import { Effect, BlendFunction } from "postprocessing";

// Using rollup-plugin-string to import text files.
import fragment from "./stretch.frag";


const NB_STRECHES = 10;


class StretchEffect extends Effect {

	constructor(options) {
		let dists = new Array();
		for (let i = 0; i < NB_STRECHES; i++) {
			let angle = Math.random()*2*Math.PI;
			let distance = 0.02 + Math.random() * 0.07;
			dists[i] = new Vector2(distance*Math.cos(angle), distance*Math.sin(angle));
		}
		super("DotsEffect", fragment, {
			blendFunction: BlendFunction.NORMAL,
			uniforms: new Map([
				[ "distorsion", { type: "v2v", value: dists } ],
				[ "strength", { type: "f", value: options.strength } ],
				[ "appliance", { type: "f", value: options.appliance } ]
			])
		});
		
		this.distanceMin = options.distanceMin;
		this.distanceRange = options.distanceRange; 
	}

	setRandomDirections () {
		let dists = new Array();
		for (let i = 0; i < NB_STRECHES; i++) {
			let angle = Math.random()*2*Math.PI;
			let distance = this.distanceMin + Math.random() * this.distanceRange;
			dists[i] = new Vector2(distance*Math.cos(angle), distance*Math.sin(angle));
		}
		this.uniforms.get("distorsion").value = dists;
	}

};

export default StretchEffect;