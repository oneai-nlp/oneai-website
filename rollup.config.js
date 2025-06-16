export default {
  input: "./src/main.js",
  output: {
    file: "out/main.js",
    format: "iife",
    strict: false,
    globals: {
      "/Users/michaelgur/VS Code/agent-create-ui/agent18/external.js": "window",
      $: "jQuery",
    },
  },
  external: ["./external.js"],
};
