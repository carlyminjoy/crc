<template>
  <div class="question" :class="{'expanded':ready}">

    <span class="dots" v-if="!ready"> 
        <i class='dot fas fa-circle'></i>
        <i class='dot fas fa-circle'></i>
        <i class='dot fas fa-circle'></i>
    </span>

        <transition name='fade'>
            <div class="ready" v-if="ready">
                <div class='ask' v-html='question.text'></div>

                <div class="responses" :class="{'hide' : selected }">

                    <div v-for="(option, index) in question.options" :class="{ 'selected' : option.score === question.score }" :key="index">

                        <label :class='id' :for="id + index">{{ option.label }} </label>
                        <input @click="addStep(option)" 
                                :id="id + index" 
                                :disabled="selected" 
                                v-model="question.score" 
                                type="radio" 
                                :name="id + option.label" 
                                :value="option.score" />

                    </div>
                </div>
            </div>
        </transition>

  </div>
</template>

<script>
import { setTimeout } from 'timers';
let url = window.location.href;
let debug = url.match(/debug/g);
const timer = debug ? 1 : 1200;

export default {
  name: 'Question',
  props: [
      'question'
  ],
  methods: {
      getGuid() {
            if (this.question.id) {
                return this.question.id
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            })
        },
        addStep(option) {
            this.selected = true;
            if (this.question.score === null) {
                this.question.score = option.score
            }
            
            this.$emit('addstep')
        }
  },
  data() {
      return {
          id: this.getGuid(),
          ready: false,
          selected: false
      }
  },
  mounted() {
      let vm = this;

      vm.$emit('scrolltobottom', 'first')
      setTimeout(() => (vm.ready = true) && vm.$emit('scrolltobottom', 'second'), timer)

  }
}
</script>

<style lang='scss'>

.question ul.examples {
        list-style:none;
        margin-block-start:0;
        padding-inline-start:0;

        li {
            display:flex;
            align-items:center;
            margin: 10px 0;

            span.img-container {
                width: 60px;
                display:flex;
                justify-content:center;
                
                img {
                    height: 25px;
                }
            }

        }
    }
</style>

<style lang='scss' scoped>

%boxshadow {
    -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
    -moz-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
    -ms-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
    -o-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
}

$blue: #0099DA;
$yellow: #FCD208;
$dark-blue: #2c3e50;

.question {

    max-height: 20px;
    max-width: 30px;
    transition: 0.3s ease;

    &.expanded {
        max-height:500px;
        max-width: 500px;
    }

    .ready {
        padding: 10px 15px 0 5px;

        .ask {
            margin-bottom: 10px;
            
        }
    }

    .dots {
        display:flex;
        height: 20px;
        width:30px;
        font-size:6px;
        justify-content:center;
        align-items:center;
        color:#555;

        .dot {
            animation-name:dot;
            animation-duration:0.9s;
            animation-iteration-count: infinite;
            margin: 1px;

            &:nth-child(2) {
                animation-delay:0.3s;
            }

            &:nth-child(3) {
                animation-delay:0.6s;
            }
        }
    }

    .responses {
        display:flex;
        flex-wrap: wrap;
        flex-direction:row;
        max-height: 500px;
        opacity: 1;
        height:auto;
        transition:  0.2s ease;

        &.hide {
            height: 0;
            opacity: 0;

            & > div {
                height:0;
                opacity:0;
            }
        }
        
        & > div {
            margin: 0 10px 10px 0;
            // flex-basis: 80px;
            flex-grow: 1;
            border-radius: 4px;
            background:#eee;
            padding: 5px 10px;
            text-align:center;
            transition: 0.3s;
            -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
            -moz-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.09), 0 2px 2px rgba(0, 0, 0, 0.12);
            -ms-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.09), 0 2px 2px rgba(0, 0, 0, 0.12);
            -o-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.09), 0 2px 2px rgba(0, 0, 0, 0.12);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.09), 0 2px 2px rgba(0, 0, 0, 0.12);
            &:hover {
                background: $blue;
                color:#fff;
            }

            label {
                padding-top: 2px;
                display:flex;
                height: 100%;
                width: 100%;
                justify-content:center;
                align-items:center;
                cursor:pointer;
                max-width: 350px;
            }


            input {
                display:none;
            }

            @media screen and (max-width: 750px) {
                label,input {
                    max-height: 30px;
                }
            }

            &.selected {
                background:$dark-blue;
                color:#fff;
            }
        }
    }
}

@keyframes dot {
    0% {font-size:6px;color:#555;}
    50% {font-size:8px;color:#0099DA;}
    0% {font-size:6px;color:#555;}
}


.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
  transition-delay: 0.2s;
}

.fade-enter, .fade-leave-to/* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
