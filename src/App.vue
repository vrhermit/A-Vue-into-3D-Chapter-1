<template>
  <div id="app">
    <h1>A Vue into 3D</h1>
    <h2>Chapter 1.3: A-Frame Controller Interactions</h2>
    <p>
      This is the example sandbox for this
      <a href="https://radicalappdev.com/?p=2276">blog post</a>
    </p>
    <SceneController />
  </div>
</template>

<script>
import SceneController from "./components/SceneController";

export default {
  name: "App",
  components: {
    SceneController,
  },
};
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
