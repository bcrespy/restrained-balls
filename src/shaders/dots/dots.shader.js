import { Uniform, Vector3 } from "three";
import { Effect, BlendFunction } from "postprocessing";

// Using rollup-plugin-string to import text files.
import fragment from "./dots.frag";


class DotsEffect extends Effect {

	constructor(options) {
		super("DotsEffect", fragment, {
			blendFunction: BlendFunction.NORMAL,
			uniforms: new Map([
				[ "pointSize", new Uniform(options.pointSize) ],
				[ "gap", new Uniform(options.gap) ],
				[ "inverted", new Uniform(options.invert) ],
				[ "invertAll", new Uniform(options.invertAll) ],
				[ "greyscale", new Uniform(options.greyscale) ],
				[ "contrast", new Uniform(options.contrast) ],
			])
		});
	}

	set pointSize (size) {
		this.uniforms.get("pointSize").value = size;
	}

	set gap (gap) {
		this.uniforms.get("gap").value = gap;
	}

	set invert (invert) {
		this.uniforms.get("inverted").value = invert;
	}

	set invertAll (invert) {
		this.uniforms.get("invertAll").value = invert;
	}

	set greyscale (greyscale) {
		this.uniforms.get("greyscale").value = greyscale;
	}
	
	set contrast (contrast) {
		this.uniforms.get("contrast").value = contrast;
	}

};

export default DotsEffect;