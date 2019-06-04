<template>
  <div class="weight">

    <span class="dots" v-if="!ready"> 
        <i class='dot fas fa-circle'></i>
        <i class='dot fas fa-circle'></i>
        <i class='dot fas fa-circle'></i>
    </span>

        <div class="ready" v-if="ready">
            <div class='ask' v-html='question.text'></div>

            <div class="responses">

                <div v-if="question.id === 'bmi'">

                    <label for="height">Height:</label>
                    <input v-model="question.height" type="number" name="height" /> cm
                    <br><br>
                    <label for="weight">Weight:</label>
                    <input v-model="question.weight" type="number" name="weight" /> kg
                </div>

                <div v-else>
                    <input v-model="question.waist" type="number" name="waist" /> cm
                </div>

            </div>

            <button :class="{ 'selected' : selected }" v-if='!disabled' @click="addStep()">Okay</button>
        </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers';

const timer = 1200;

export default {
  name: 'Weight',
  components: {
  },
  props: [
      'question',
      'gender'
  ],
  computed: {
      disabled() {
          if (this.question.id === 'bmi') {
              return !this.question.height || !this.question.weight || this.selected;
          } else {
              return !this.question.waist || this.selected
          }
      }
  },
  methods: {
      getGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            })
        },
        addStep() {
            let vm = this;

            vm.selected = true;

            if (vm.question.id === 'bmi') {
                vm.question.userResponse = 'I am ' + vm.question.height + ' cm tall, and I weigh ' + vm.question.weight + ' kg.';
    
                let heightInMetres = (vm.question.height / 100).toFixed(2);
                let bmi = (vm.question.weight / (heightInMetres * heightInMetres)).toFixed(2);
                vm.question.bmi = bmi;
    
                if (bmi < 18.5) {
                    vm.question.score = 210;
                    vm.question.aiResponse = 'You might be underweight, consider talking to your health professional.'
                } else if (bmi < 24.9) {
                    vm.question.score = 210;
                    vm.question.aiResponse = 'Well done!'
                } else if (bmi <= 30) {
                    vm.question.score = 105;
                    vm.question.aiResponse = 'You’re almost there! Try to achieve and maintain a healthy body weight within a BMI range of 18.5 to 25 to reduce your cancer risk. ';
                } else {
                    vm.question.aiResponse = 'Try to achieve and maintain a healthy body weight within a BMI range of 18.5 to 25 to reduce your cancer risk.';
                    vm.question.score = 0;
                }
            } else {
                vm.question.userResponse = 'My waist measurement is ' + vm.question.waist + ' cm.';

                if (vm.gender === 'm') {
                    if (vm.question.waist < 94) {
                        vm.question.score = 210;
                        vm.question.aiResponse = 'Well done!';
                    } else if (vm.question.waist < 101) {
                        vm.question.aiResponse = 'You’re almost there!  Try to achieve and maintain a waist measurement of under 94cm.';
                        vm.question.score = 105;
                    } else {
                        vm.question.aiResponse = 'Try to achieve and maintain a waist measurement of under 94cm. ';                        
                        vm.question.score = 0;
                    }
                } else {
                    if (vm.question.waist < 80) {
                        vm.question.aiResponse = 'Well done!';

                        vm.question.score = 210;
                    } else if (vm.question.waist < 87) {
                        vm.question.aiResponse = 'You’re almost there!  Try to achieve and maintain a waist measurement of under 94cm.';

                        vm.question.score = 105;
                    } else {
                        vm.question.aiResponse = 'Try to achieve and maintain a waist measurement of under 94cm. ';                        

                        vm.question.score = 0;
                    }
                }
            }

            vm.$emit('addstep')
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
      setTimeout(() => this.ready = true, timer)
  }
}
</script>

<style lang='scss' scoped>

$blue: #0099DA;
$yellow: #FCD208;
$dark-blue: #2c3e50;

.weight {

    button {
        width: 100%;
        border:none;
        border-radius: 4px;
        background: #eee;
        padding: 5px;
        font-size: 16px;
        margin-top: 20px;
        cursor:pointer;
        transition: 0.3s ease;

        &:hover {
            color:white;
            background:$blue;
        }

        &.selected {
            background: $dark-blue;
            color:white;
        }
    }

    .ready {
        padding: 15px;

        .ask {
        font-weight:bold;
            margin-bottom: 20px;
        }
    }

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

        input {
            padding: 5px;
            border-radius: 4px;
            border: 1px solid #cdcdcd;
            width: 50px;
        }
    }
}

@keyframes dot {
    0% {font-size:6px;color:#555;}
    50% {font-size:8px;color:#0099DA;}
    0% {font-size:6px;color:#555;}
}

</style>
