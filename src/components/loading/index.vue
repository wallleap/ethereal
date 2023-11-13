<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'Loading',
})
</script>

<template>
  <div class="loading">
    <svg class="loading-circle" viewBox="0 0 50 50">
      <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="8" />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0;
  width: 50px;
  height: 50px;
  transform: translate(-50%, -50%);
  z-index: 2;

  .loading-circle {
    width: 50px;
    height: 50px;
    animation: rotate 2s linear infinite;

    & .path {
      stroke: var(--primary);
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
}
</style>
