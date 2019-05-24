<template>
	<div id="app">
		<h1>Cancer Risk Quiz</h1>
        <h2 @click="calculateResults()">Print results</h2>

        <div class="outer-container">

            <div class="conversation-container" ref="conversationEl">

                <template class="step-container" v-for="(step, index) in steps" v-if="display(step)">

                    <transition name="fade" :key="index">
                        <div v-if="index <= currentStep" class='ai-comment'>

                            <question v-if="step.question" :question=step v-on:addstep="addStep()"></question>
                            <p v-else>{{ step.text }}</p>

                        </div>
                    </transition>

                    <transition name="fade" :key="index">
                        <div v-if="step.score || step.score === 0" class='user-comment'>
                            <p> {{ step.options.find((o) => o.score === step.score ).userResponse }} </p>
                        </div>
                    </transition>

                    <transition name="fade" :key="index">
                        <div v-if="step.userResponded" class='ai-comment'>
                            <p> {{ step.options.find((o) => o.score === step.score ).aiResponse }} </p>
                        </div>
                    </transition>

                </template>

            </div>
        </div>
	</div>
</template>

<script>
import { default as conversation } from './config.js'
import JQuery from 'jquery'
let $ = JQuery
import { default as Question } from './Question.vue'
import { setTimeout } from 'timers';

export default {
    name: 'app',
    components: {
        Question
    },
	data () {
		return {
            steps: conversation.steps,
            currentStep : null,
            categories: [
                'personal',
                'uv', 
                'smoking',
                'alcohol',
                'nutrition',
                'weight',
                'physicalActivity',
                'screening',
                'results'
            ]
		}
    },
    watch: {
        currentStep (next, prev) {
            if (!this.steps[next].question) {
                setTimeout(() => this.currentStep++, 1000)
            } 
        }
    },
    computed: {
        // calculateResults() {
        //     let results = {};

        //     this.steps.forEach((step) => {
        //         if ((step.score || step.score) === 0 && step.question) {
        //             if (results[step.category] !== undefined) {
        //                 results[step.category] += step.score;
        //             } else if (results[step.category] === undefined) {
        //                 results[step.category] = step.score;
        //             }
        //         }
        //     })

        //     return results;
        // }
    },
    methods: {
        calculateResults() {
            let results = {};

            this.steps.forEach((step) => {
                if (step.question) {
                    if (results[step.category] !== undefined) {
                        results[step.category] += step.score;
                    } else if (results[step.category] === undefined) {
                        results[step.category] = step.score;
                    }
                }
            })

            console.log(results);
        },
        addStep() {

            setTimeout(() => this.steps[this.currentStep].userResponded = true, 1000)
            setTimeout(() => this.steps[this.currentStep].aiResponded = true, 2000)

            let display = this.display(this.steps[this.currentStep + 1]);

            setTimeout(() => display ? this.currentStep++ : this.currentStep += 2, 3000)
        },
        display(step) {
            let displayExpression = step.display;
            return eval(displayExpression)
        }
    },
    mounted () {
        this.currentStep = 0;
    }
}
</script>

<style lang='scss'>

$blue: #0099DA;

body {
    margin: 0;
    padding: 0;
    overflow-y:hidden;
}
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	background: #eee;
	padding: 30px;
    height:100vh;
}


.conversation-container {
    -webkit-mask-image: -webkit-gradient(linear, left top, left 20%, from(rgba(0,0,0,0)), to(rgba(0,0,0,1)));
    overflow-y:hidden;
    margin: 60px auto;
    background:#fff;
    padding: 30px;
    max-width: 600px;
    height: 500px;
    max-height: 80vh;
    text-align:left;
    display:flex;
    flex-direction:column;
    justify-content:flex-end;

    p {
        margin: 5px 0;
    }
    
    .ai-comment {
        background:#eee;
        padding: 5px 15px;
        border-radius: 8px 8px 8px 0;
        max-width: 400px;
        margin: 15px auto 15px 0;
        height: auto;
    }

    .user-comment {
        background:$blue;
        color:#fff;
        padding: 5px 15px;
        border-radius: 8px 8px 0 8px;
        max-width:400px;
        margin: 30px 0 30px auto;
        height:auto;
    }
}

.fade-enter-active, .fade-leave-active,
.delay-extra-fade-enter-active, .delay-extra-fade-leave-active,
.delay-fade-enter-active, .delay-fade-leave-active {
  transition: all 0.3s;
}

.fade-enter, .fade-leave-to,
.delay-fade-enter, .delay-fade-leave-to,
.delay-extra-fade-enter, .delay-extra-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  height:0;
  transform: translateY(30px);
}

.delay-fade-enter-active, .delay-fade-leave-active {
  transition-delay: 0.7s;
  height:60px;
}
.delay-extra-fade-enter-active, .delay-extra-fade-leave-active {
  transition-delay: 1.7s;
}

</style>
