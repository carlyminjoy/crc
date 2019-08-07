<template>
  <div class="background-blob">

    <!-- TOP BLOB -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
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
    <div class="bottom-blobs">

      <!-- LIGHTEST BLOB -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="2275.444"
        height="1195.158"
        viewBox="0 0 2275.444 1195.158"
        class="blob-lightest"
      >
        <path
          d="M-12.7,902.611C399.487,1004.5,541.7,887.682,901.05,862.285s722.5,67.3,942.176,63.488,357.3,47.945,357.3,47.945V2053.031H-74.923V908.961Z"
          transform="translate(74.923 -857.873)"
        ></path>
      </svg>

      <!-- MIDDLE BLOB -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="2275.444"
        height="1157.326"
        viewBox="0 0 2275.444 1157.326"
        class="blob-middle"
      >
        <path
          d="M16.014,895.705c373.315,58.41,521.879,229.832,881.227,204.436s672.982-162.533,947.254-35.555,356.026-90.867,356.026-90.867V2053.031H-74.923V895.705Z"
          transform="translate(74.923 -895.705)"
        ></path>
      </svg>

      <!-- DARKEST BLOB -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="2275.775"
        height="1227.632"
        viewBox="0 0 2275.775 1227.632"
        class="blob-darkest"
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
  data: function() {
    return {
      blobStates: [
        "M-12.7,902.611C399.487,1004.5,541.7,887.682,901.05,862.285s722.5,67.3,942.176,63.488,357.3,47.945,357.3,47.945V2053.031H-74.923V908.961Z",
        "M-12.7,902.611c412.191,101.889,587.7,96.5,947.043,71.107S1562.988,869.9,1782.66,866.089s417.861,107.63,417.861,107.63V2053.031H-74.923V908.961Z"
      ]
    };
  },

  mounted: function() {
    // const timeline = anime.timeline({
    //   duration: 5000,
    //   easing: "easeOutExpo",
    //   loop: true,
    //   direction: "alternate"
    // });
    // //Cycle through animations
    // // timeline.add({
    // //     targets: ".background-blob-path",
    // //     translateX: "74.923",
    // //     translateY: "-857.873",
    // //     d: [
    // //         {value: this.blobStates[0]},
    // //     ]
    // // })
    // //  timeline.add({
    // //     targets: ".background-blob-path",
    // //     translateX: "74.923",
    // //     translateY: "-865.993",
    // //     d: [
    // //         {value: this.blobStates[1]}
    // //     ]
    // // })
  }
};
</script>

<style lang='scss' scoped>
@keyframes fade-in-bottom {
  0% {
    opacity: 0;
    transform: translateY(150px) scale(1.5) skewX(90deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1) skewX(0deg);
  }
}

@keyframes fade-in-top {
  0% {
    opacity: 0;
    transform: translateY(-100px) skewY(10deg) skewX(20deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) skewY(0deg) skewX(0deg);
  }
}

.background-blob {
  overflow: hidden;
  height: 100%; width: 100%;
  position: absolute;
}

.top-blob {
  top: -65%;
  left: 270px;
  position: absolute;
  animation: 2s 1s fade-in-top forwards;
  opacity: 0;
  // z-index: -1;
  path {
    fill: #009bdc;
    opacity: 0.07;
  }
}

.bottom-blobs {
  position: absolute;
  bottom: 0;
  height: 30vh;
  width: 100%;
  overflow: hidden;
  opacity: 0;
  // transform-origin: bottom right;
  animation: 2s 1s fade-in-bottom forwards;

  .blob-lightest,
  .blob-middle,
  .blob-darkest {
    position: absolute;
    left: 0;
    top: 0;
    path {
      fill: #009bdc;
    }
  }

  .blob-lightest {
    path {
      opacity: 0.05;
    }
  }

  .blob-middle {
    margin-top: 80px;
    path {
      opacity: 0.35;
    }
  }

  .blob-darkest {
    margin-top: 300px;
    margin-left: -100px;
  }

  .blob-middle,
  .blob-darkest {
    display: none;
  }
}
</style>