<template>
  <div class="background-blob">

    <!-- TOP BLOB -->
    <svg
      width="970.854"
      height="944.41"
      viewBox="0 0 970.854 944.41"
      class="top-blob"
    >
      <g transform="matrix(1, 0, 0, 1, 0, 0)">
        <path
          d="M307.536,17.858C695.2-107.494,757.475,176.265,719.575,322.449S488.61,627.04,307.536,627.04,90.23,475.5,44.75,358.49-80.127,143.211,307.536,17.858Z"
          transform="matrix(-0.85, -0.53, 0.53, -0.85, 634.4, 924.15)"
        ></path>
      </g>
    </svg>

    <!-- ALL THE BOTTOM BLOBS -->
    <div class="bottom-blobs-container">

      <!-- LIGHTEST BLOB -->
      <svg
        width="2275.444"
        height="1195.158"
        viewBox="0 0 2275.444 1195.158"
        class="blob-lightest"
        :style="{top: `${this.scrollOffset.lightest}px`}"
      >
        <path
          d="M-12.7,902.611C399.487,1004.5,541.7,887.682,901.05,862.285s722.5,67.3,942.176,63.488,357.3,47.945,357.3,47.945V2053.031H-74.923V908.961Z"
          transform="translate(74.923 -857.873)"
        ></path>
      </svg>

      <!-- MIDDLE BLOB -->
      <svg
        width="2275.444"
        height="1157.326"
        viewBox="0 0 2275.444 1157.326"
        class="blob-middle"
        v-if="finished"
        :style="{top: `${this.scrollOffset.middle}px`}"        
      >
        <path
          d="M16.014,895.705c373.315,58.41,521.879,229.832,881.227,204.436s672.982-162.533,947.254-35.555,356.026-90.867,356.026-90.867V2053.031H-74.923V895.705Z"
          transform="translate(74.923 -895.705)"
        ></path>
      </svg>

      <!-- DARKEST BLOB -->
      <svg
        width="2275.775"
        height="1227.632"
        viewBox="0 0 2275.775 1227.632"
        class="blob-darkest"
        v-if="finished"
        v-bind:style="{top: `${this.scrollOffset.darkest}px`}"
      >
        <path
          d="M-12.7,902.611c373.315,58.41,563.781-49.52,923.129-74.916S1616,996,1919,995s281.521-21.281,281.521-21.281V2053.031H-74.923V908.961Z"
          transform="translate(74.923 -825.399)"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";

export default {
  name: "BackgroundBlob",
  props: [
      'finished'
  ],
  data: function() {
    return {
      scrollOffset: {
        lightest: 0,
        middle: 0,
        darkest: 0
      }
    };
  },

  methods: {
    handleScroll(event) {
      let scrollAmount = window.scrollY;
      this.scrollOffset.lightest = scrollAmount/15;
      this.scrollOffset.middle = scrollAmount/7;
      this.scrollOffset.darkest = scrollAmount/3;
    }
  },

  watch: {
    finished: function(ready) {
      if (ready) {
        setTimeout(() => {
          window.addEventListener('scroll', this.handleScroll);
        }, 2500);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
// @keyframes fade-in-bottom {
//   0% { opacity: 0; transform: translateY(150px) scale(1.5) skewX(90deg); }
//   100% { opacity: 1; transform: translateY(0px) scale(1) skewX(0deg); }
// }

@keyframes fade-in-bottom {
  0% { opacity: 0; transform: translateY(200px) scaleX(3); }
  100% { opacity: 1; transform: translateY(0px) scaleX(1); }
}

@keyframes fade-in-top {
  0% { opacity: 0; transform: translateY(-100px) skewY(10deg) skewX(20deg); }
  100% { opacity: 1; transform: translateY(0px) skewY(0deg) skewX(0deg); }
}

.background-blob {
  overflow: hidden;
  position: absolute;
  height: 100%; width: 100%;
  pointer-events:none;

  svg { position: absolute; }
  path { fill: #009bdc; }

  svg.top-blob {
    top: -620px;
    left: -400px;
    right: 0;
    margin: 0 auto;
    animation: 2s 1s fade-in-top forwards;
    opacity: 0;
    path { opacity: 0.07; }
  }

  div.bottom-blobs-container {
    position: fixed;
    bottom: 0;
    height: 50vh;
    width: 100%;
    overflow: hidden;

    svg {
      left: 0;
      top: 0;
          opacity: 0;
    transform-origin: bottom left;
      animation: 2s 1s fade-in-bottom forwards;
    }

    svg.blob-lightest {
      path {
        opacity: 0.05;
      }
    }

    svg.blob-middle {
      margin-top: 10vh;
      path {
        opacity: 0.35;
      }
    }

    svg.blob-darkest {
      margin-top: 22vh;
      margin-left: -100px;
    }
  }
}
</style>