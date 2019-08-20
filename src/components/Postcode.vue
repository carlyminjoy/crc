<template>
  <div class="postcode" :class="{'expanded' : ready}">

    <span class="dots" v-if="!ready"> 
        <i class='dot fas fa-circle'></i>
        <i class='dot fas fa-circle'></i>
        <i class='dot fas fa-circle'></i>
    </span>

        <div class="ready" v-if="ready">
            <div class='ask' v-html='question.text'></div>

            <div class="responses" :class="{'hide' : selected}">
                <vmd-text-field id='postcode' @input='scrollToBottom()' v-model.trim="postcode" label="Postcode"> </vmd-text-field>
                <vmd-button id='postcode-btn' varient="raised" :disabled='disabled' :text='postcode' v-if='this.postcode !== ""' @click="addStep()"></vmd-button>
            </div>

        </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers';
import {vmdTextField, vmdButton} from '@ccq/ccq-vue-components'

const timer = 1200;

export default {
  name: 'Postcode',
  components: {
      vmdTextField,
      vmdButton
  },
  props: [
      'question'
  ],
  computed: {
      disabled() {
          return this.selected || this.postcode === '' || this.postcode.length !== 4 || parseInt(this.postcode).toString() !== this.postcode
      }
  },
  methods: {
      scrollToBottom() {
          this.$emit('scrolltobottom')
      },
      getGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            })
        },
        addStep() {
            let vm = this;

            if (!vm.selected) {
                vm.question.score = vm.postcode;
                vm.question.userResponse = 'My postcode is ' + vm.question.score + '.';
                vm.selected = true;
                vm.$emit('addstep')
            }
        }
  },
  data() {
      return {
          id: this.getGuid(),
          ready: false,
          selected: false,
          postcode: ''
      }
  },
  mounted() {
      let vm = this;
      
      vm.$emit('scrolltobottom'), 100

      setTimeout(() => {
          this.ready = true;
          setTimeout(() => vm.$emit('scrolltobottom'), 100)
      }, timer)
  }
}
</script>

<style lang='scss' scoped>

$blue: #0099DA;
$yellow: #FCD208;
$dark-blue: #2c3e50;

.postcode {
    max-height: 20px;
    max-width: 30px;
    transition: 0.3s ease;
    
    label.mdc-floating-label {
        font-size:16px important;
    }

    &.expanded {
        max-height:500px;
        max-width: 500px;
    }

    .responses {
        transition: 0.3s ease;
        opacity: 1;
        margin-top: 20px;

        &.hide {
            max-height: 1px;
            opacity: 0;
            display:none;
        }
    }

    .mdc-field {
        width: 100%;
    }

    button {
        width:100%;
        border:none;
        border-radius: 4px;
        padding: 5px;
        font-size: 16px;
        margin-top: 20px;
        cursor:pointer;
        transition: 0.3s ease;

        label {
            color:#fff;
        }
    }

    .ready {
        padding: 10px;
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
    }
}

@keyframes dot {
    0% {font-size:6px;color:#555;}
    50% {font-size:8px;color:#0099DA;}
    0% {font-size:6px;color:#555;}
}

</style>

<style lang='scss'>

.postcode .ready .responses .mdc-field label.mdc-floating-label {
    font-size:16px !important;
}

</style>