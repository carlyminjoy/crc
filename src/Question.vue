<template>
  <div class="question">

    <span class="dots" v-if="!ready"> 
        <i class='dot fas fa-circle'></i>
        <i class='dot fas fa-circle'></i>
        <i class='dot fas fa-circle'></i>
    </span>

        <template v-if="ready">
            <h4>{{ question.text }}</h4>

            <div class="responses">

            <div v-for="option in question.options" :class="{'selected' : option.score === question.score }" :key="option.label">

                <label :for="id + '-' + option.label">{{ option.label }} </label>
                <input @input="addStep()" v-model="question.score" type="radio" :id="id + '-' + option.label" :name="id" :value="option.score" />

            </div>
            </div>
        </template>

  </div>
</template>

<script>
import { setTimeout } from 'timers';

export default {
  name: 'Question',
  props: [
      'question'
  ],
  methods: {
      getGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            })
        },
        addStep() {
            this.$emit('addstep')
        }
  },
  data() {
      return {
          id: this.getGuid(),
          ready: false
      }
  },
  mounted() {
      setTimeout(() => this.ready = true, 1500)
  }
}
</script>

<style lang='scss' scoped>

$blue: #0099DA;

.question {

    .dots {
        height: 30px;
        width:30px;
        font-size:6px;
        color:#555;

        .dot {
            animation-name:dot;
            animation-duration:0.6s;
            animation-iteration-count: infinite;

            &:nth-child(2) {
                animation-delay:0.2s;
            }

            &:nth-child(3) {
                animation-delay:0.2s;
            }
        }
    }

    .responses {
        display:flex;
        flex-wrap: wrap;

        & > div {
            margin: 0 10px 10px 0;
            // flex-basis: 80px;
            flex-grow: 1;
            border-radius: 4px;
            background:#fff;
            padding: 5px;
            text-align:center;
            transition: 0.3s;
            &:hover {
                background: green;
                color:#fff;
            }

            label {
                display:flex;
                height: 100%;
                width: 100%;
                justify-content:center;
                align-items:center;
                cursor:pointer;
            }


            input {
                display:none;
            }

            &.selected {
                background:green;
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

</style>
