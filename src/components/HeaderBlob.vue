<template>
  <div class="header-blob">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 94.604 85.803"
    >
      <defs>
        <filter id="blob-path" filterUnits="userSpaceOnUse">
          <feOffset dy="3" input="SourceAlpha"></feOffset>
          <feGaussianBlur stdDeviation="3" result="blur"></feGaussianBlur>
          <feFlood flood-opacity="0.161"></feFlood>
          <feComposite operator="in" in2="blur"></feComposite>
          <feComposite in="SourceGraphic"></feComposite>
        </filter>
      </defs>
      <g class="cls-2" transform="matrix(1, 0, 0, 1, 0, 0)">
        <path
          id="Path_23-2"
          data-name="Path 23"
          class="cls-1"
          transform="translate(3.31 19.3)"
          d="M37.655-10C78.7-23.271,85.3,6.775,81.283,22.253S56.828,54.505,37.655,54.505,14.645,38.459,9.829,26.069-3.393,3.275,37.655-10Z"
        ></path>
      </g>
    </svg>

    <transition name="icontransition">
      <img class="blob-icon" :class="iconIndex" :key="iconIndex" :src="icons[iconIndex]">
    </transition>
  </div>
</template>

<script>
export default {
  name: "HeaderBlob",
  data: function() {
    return {
      icons: [
        "https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/uv-white.png",
        "https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/smoking-white.png",
        "https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/alcohol-white.png",
        "https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/nutrition-white.png",
        "https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/weight-white.png",
        "https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/physical-activity-white.png",
        "https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/screening-white.png"
      ],
      iconIndex: 0,
      delay: 4000
    };
  },

  mounted: function() {
    setInterval(() => {
      this.iconIndex === 6 ? (this.iconIndex = 0) : this.iconIndex++;
    }, this.delay);
  }
};
</script>

<style lang='scss' scoped>
@keyframes load-blob {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.icontransition-enter-active,
.icontransition-leave-active {
  transition: all 0.3s;
}

.icontransition-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(0) rotate(45deg);
}

.icontransition-leave-to {
  opacity: 0;
  transform: scale(0) rotate(-45deg);
}

.header-blob {
  width: 94px;
  height: 86px;
  padding-top: 10px;
  position: relative;
  overflow: hidden;

  svg {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;

    path {
        transform-origin: center;
    }

    .cls-1 {
      fill: #009bdc;
    }

    .cls-2 {
      filter: url(#blob-path);
    }
  }

  .blob-icon {
    position: absolute;
    top: 26px;
    left: 2px;
    right: 0;
    margin: 0 auto;
    height: 36px;
    image-rendering: -moz-crisp-edges; /* Firefox */
    image-rendering: -o-crisp-edges; /* Opera */
    image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
  }

  .blob-icon[src="https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/screening-white.png"],
  .blob-icon[src="https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/weight-white.png"] {
    height: 30px;
    top: 28px;
  }
}

@media screen and (max-width: 400px) {
  .blob-icon {
    height: 25px!important;
    top: 30px!important;
  }
}
</style>