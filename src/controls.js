import config from "./config";

export default {
  object: config,

  controls: [
    [
      "balls",

      {
        property: "trebleRandomness",
        min: 0, max: 1.5, step: 0.0001
      },

      {
        property: "energyTreble",
        min: 0, max: 10.0, step: 0.0001
      },

      {
        property: "centerAttraction",
        min: 0, max: 0.01, step: 0.0001
      }
    ],

    [
      "camera",

      {
        property: "cameraDistance",
        min: 0, max: 100, step: 0.5
      },

      {
        property: "rotationSpeed",
        min: 0, max: 3.0, step: 0.0001
      }
    ],

    [
      "colored dots",

      {
        property: "scaleDecrease",
        min: 0, max: 0.2, step: 0.0001
      },

      {
        property: "coloredBallsNumber",
        min: 0, max: 1.0, step: 0.0001
      },

      {
        property: "velocity",
        min: 0, max: 3.0, step: 0.00001
      }
    ],

    [
      "post processing",

      {
        property: "aberationStrength",
        min: 0, max: 5.0, step: 0.1
      }
    ]
  ]
}