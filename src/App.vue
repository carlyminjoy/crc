<template>
	<div id="app">

        <div class="outer-container">

            <h1 class='heading'>Cancer Risk Quiz</h1>

            <ul class="progress-bar">
                <li v-for="(route, index) in routes" :key="index"
                    :class="{ 'active' : currentStep && index <= routes.indexOf(state.activeCategory) }">

                    <span>{{route}}</span>
                </li>
            </ul>

            <div class="results-container" v-if="state.showResults">
                <h3>Your total score for reducing your cancer risk is:</h3>

                <vue-circle
                    :progress="results.total"
                    :size="150"
                    :reverse="false"
                    line-cap="butt"
                    :fill='{ gradient: ["#43A047", "#FCD208"], gradientDirection:[30,140,140,60] }'
                    empty-fill="#eee"
                    :animation-start-value="0.0"
                    :start-angle="-(Math.PI / 2)"
                    insert-mode="append"
                    :thickness="10"
                    :show-percent="true">

                </vue-circle>

                <template v-if='categoryResults.green.length > 0'>

                    <h3>You're doing great in the following areas:</h3>

                    <ul>
                        <template v-for="category in scoredCategories">
                            <li @click='rotate($event)' :key="category.name" v-if="results[category.name] >= 66">

                                <i :class="category.icon"></i>
                                <h4>{{ category.name }}</h4>

                                <p>{{category.desc}}</p>

                            </li>
                        </template>
                    </ul>

                </template>

                <template v-if='categoryResults.amber.length > 0 || categoryResults.red.length > 0'>

                    <h3>The areas you could improve in are:</h3>

                    <ul>
                        <template v-for="category in scoredCategories">
                            <li :key="category.name" v-if="results[category.name] < 66">

                                <i :class="category.icon"></i>
                                <h4>{{ category.name }}</h4>

                            </li>
                        </template>
                    </ul>
                </template>

                <h3>To receive your Cancer Risk Scorecard and tips to reduce your cancer risk, please enter your information below:</h3>

                <form>
                    <vmd-text-field class='half-width' label='First Name' v-model="form.firstName"></vmd-text-field>
                    <vmd-text-field class='half-width' label='Last Name' v-model="form.lastName"></vmd-text-field>
                    <vmd-text-field label='Email Address' v-model="form.emailAddress"></vmd-text-field>

                    <p>By submitting this form, you are agreeing to our <a href='https://cancerqld.org.au/about-us/our-privacy-policy/read-our-privacy-position-statement/' target='_blank'>Privacy Collection Statement</a>.</p>

                    <vmd-button v-if='!state.submitted' :disabled="submitBtnDisabled" :loading="state.loading" text='Get My Cancer Risk Scorecard' @click="sendResults()"></vmd-button>
                    <p v-else class="confirmation-msg">Thank you! Your form has been submitted.<br>You will receive an email shortly with your recommendations.</p>
                </form>

            </div>

            <div class="conversation-container mask" ref="conversationEl" v-if="!state.showResults">

                <template class="step-container" v-for="(step, index) in steps">

                    <transition name="fade" :key="index">

                        <div v-if="display(step) && index <= currentStep" class='ai-comment'>

                            <question v-if="step.question && !step.userInput" 
                                    :question=step 
                                    v-on:addstep="addStep()"></question>

                            <weight v-else-if="step.userInput && step.category === 'weight'" 
                                    :question=step 
                                    :gender="steps[3].score" 
                                    v-on:addstep="addStep()"></weight>

                            <postcode v-else-if="step.userInput && step.id === 'postcode'" 
                                    :question=step 
                                    v-on:addstep="addStep()"></postcode>

                            <p v-else v-html='step.text'></p>

                        </div>

                    </transition>

                    <transition name="fade" :key="index">
                        <div v-if="step.score || step.score === 0" class='user-comment'>

                            <p v-if="!step.options"> {{ step.userResponse }} </p>

                            <p v-if="step.options" v-html="step.options.find((o) => o.score === step.score ).userResponse"></p>

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
import { default as Weight } from './Weight.vue'
import { default as Postcode } from './Postcode.vue'
import { setTimeout } from 'timers';
import { vmdButton, vmdTextField } from '@ccq/ccq-vue-components'
import VueCircle from 'vue2-circle-progress'
import axios from 'axios'


const timers = {
    shortest: 500,
    short: 1000,
    med: 2000,
    long: 3000
}

export default {
    name: 'app',
    components: {
        Question,
        Weight,
        Postcode,
        vmdButton,
        vmdTextField,
        VueCircle
    },
	data () {
		return {
            isIe: false,
            state: {
                showResults: false,
                loading: false,
                submitted: false,
                errors: false,
                activeCategory: 'personal'
            },
            form: {
                firstName: '',
                lastName: '',
                emailAddress: ''
            },
            routes: [
                'personal',
                'uv', 
                'smoking',
                'alcohol',
                'nutrition',
                'weight',
                'physical activity',
                'screening',
                'results'
            ],
            categoryResults: {
                red: [],
                green: [],
                amber: []
            },
            scoredCategories: [
                {
                    name: 'uv',
                    icon: 'fas fa-sun',
                    desc: 'Description.'
                },
                {
                    name: 'smoking',
                    icon: 'fas fa-smoking',
                    desc: 'Description.'
                },
                {
                    name: 'alcohol',
                    icon: 'fas fa-wine-bottle',
                    desc: 'Description.'
                },
                {
                    name: 'nutrition',
                    icon: 'fas fa-utensils',
                    desc: 'Description.'
                },
                {
                    name: 'weight',
                    icon: 'fas fa-weight',
                    desc: 'Description.'
                },
                {
                    name: 'physical activity',
                    icon: 'fas fa-running',
                    desc: 'Description.'
                },
                {
                    name: 'screening',
                    icon: 'fas fa-clinic-medical',
                    desc: 'Description.'
                }
            ],
            currentStep : null,
            results: '',
            steps: conversation.steps
		}
    },
    watch: {
        currentStep (next, prev) {
            let vm = this;

            vm.scrollToBottom();

            if (vm.steps[next].final) {
                vm.state.activeCategory = 'results'
                vm.calculateResults()
                setTimeout(() => vm.state.showResults = true, timers.med)
                return
            }

            if (!vm.steps[next].question) {
                setTimeout(() => vm.currentStep++, timers.short)
                return
            }  else {
                vm.state.activeCategory = vm.steps[next].category
                setTimeout(() => vm.scrollToBottom(), 100)
                setTimeout(() => vm.scrollToBottom(), 1300)
            }

            if (vm.steps[next].question && !vm.display(vm.steps[next])) {
                setTimeout(() => vm.currentStep++, timers.shortest)
            }
        }
    },
    computed: {
        submitBtnDisabled() {
            let vm = this;

            return vm.form.firstName === '' 
                || vm.form.lastName === '' 
                || vm.form.emailAddress === ''
        }
    },
    methods: {
        scrollToBottom() {
            if (this.isIe) {
                var element = this.$refs.conversationEl;
                element.scrollTop = element.scrollHeight;
            }
        },
        rotate(e) {
            if (e.target.classList.length === 0) {
                e.target.classList.add('rotate');
            } else {
                (e.target.classList.remove('rotate'))
            }
        },
        getRecommendations() {
            let vm = this;

            let answeredQuestions = vm.steps.filter((step) => {
                return step.question && (step.score !== null) && step.category !== 'personal' && step.id !== 'weight'
            })

            let recommendations = answeredQuestions.map((q) => {
                let answer = q.options? q.options.find((o) => o.score === q.score) : null;

                let obj = {
                    id: q.id,
                    question: q.text,
                    category: q.category,
                    answer: answer ? answer.userResponse : q.userResponse,
                    recommendation: answer ? answer.aiResponse : q.aiResponse
                }

                if (q.id === 'bmi') { obj.bmi = q.bmi }
                if (q.id === 'waist') { obj.waist = q.waist }

                return obj;
            })

            return recommendations;
        },
        async getToken() {
            let vm = this;
            return new Promise(async (resolve, reject) => {
            let token = await grecaptcha.execute('6LdVoXkUAAAAAJSPi9AzIFrcumZGtaqoD7vc_nHH', { "action": "webform" });
                token && token !== undefined ? resolve(token) : reject(false);
            })
        },
        async getPostData() {
            let vm = this;
            let gaToken = await vm.getToken();

            let entry = {
                firstName: vm.form.firstName,
                lastName: vm.form.lastName,
                emailAddress: vm.form.emailAddress,
                postcode: vm.steps[4].score,
                scores: vm.results,
                recommendations: vm.getRecommendations()
            }

            return gaToken ? {
                'sourceIdentifier': 'cancerriskquiz-webform-c9dc3b17',
                'entry': entry,
                'debug': 'development',
                'gaToken' : gaToken
            } : null;
        },
        async sendResults() {
            let vm = this;
            vm.state.loading = true;

            let postData = await vm.getPostData()
            if (postData) {
                let response = await axios({
                    method: 'post',
                    url: 'https://ccq-form-functions.azurewebsites.net/formsubmit',
                    timeout: 30000,
                    data: postData
                })

                vm.state.loading = false;
                if (response.data.success) {
                    vm.state.submitted = true;
                    return;
                }
            }

            vm.state.loading = false;
            vm.state.errors = true;
        },
        calculateResults() {
            let vm = this;
            let results = {};
            let total = 0;
            let screenTotal = 0;

            vm.steps.forEach((step) => {
                if (step.question && step.category !== 'personal') {

                    if (step.score !== null) {
                        if (step.category === 'weight') {
                            if (step.id) { results.weight = step.score }

                        } else if (results[step.category] !== undefined) {
                            results[step.category] += Math.round(step.score);

                        } else if (results[step.category] === undefined) {
                            results[step.category] = Math.round(step.score);
                        }

                        if (step.category === 'screening') {
                            screenTotal += 70;
                        }
                    }
                }
            })

            Object.keys(results).forEach((category) => {
                let categoryScore = null;

                if (category === 'screening') {
                    if (screenTotal > 0) {
                        categoryScore = Math.round(results[category] / screenTotal * 100)
                    }
                } else {
                    categoryScore = Math.round(results[category] / 210 * 100)
                }

                results[category] = categoryScore
                vm.categoryResults[categoryScore > 66 ? 'green' : (categoryScore > 33 ? 'amber' : 'red')].push(category)
                total += categoryScore
            })

            results.total = Math.round(total / Object.keys(results).length)
            vm.results = results;
        },
        addStep() {
            let vm = this;

            vm.scrollToBottom();

            setTimeout(() => {
                vm.steps[vm.currentStep].userResponded = true
                vm.scrollToBottom();
            }, timers.short)

            setTimeout(() => {
                vm.display(vm.steps[vm.currentStep + 1]) ? vm.currentStep++ : vm.currentStep += 2
                vm.scrollToBottom();       
            }, timers.short)
        },
        display(step) {
            let displayExpression = step.display;
            return eval(displayExpression);
        }
    },
    mounted () {
        this.currentStep = 0;

        var ua = window.navigator.userAgent;
        var isIE = /MSIE|Trident/.test(ua);

        if ( isIE ) {
            this.isIe = true;
            this.$refs.conversationEl.classList.add('scroll')
        }
    }
}
</script>

<style lang='scss'>

$blue: #0099DA;
$yellow: #FCD208;
$dark-blue: #2c3e50;

%boxshadow {
    -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
    -moz-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
    -ms-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
    -o-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
}

html {
    margin-top:unset!important;
}
body {
    margin: 0;
    padding: 0;
    // overflow-y:hidden;
}
#app {
	font-family: 'Foco CC', 'Roboto', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: $dark-blue;
	// padding: 30px;
    height:100vh;
    background: #eee;

    h1, h2, h3, h4, h5, h6 {
        color:unset;
    }

    // header {
    //     height:80px;
    //     background: #fff;
    //     // border-bottom: 3px solid #FCD208;

    //     .container {
    //         height:100%;
    //         max-width: 660px;
    //         margin: 0 auto;
    //         img {
    //             float:left;
    //             height: 50px;
    //             margin-top: 15px;
    //         }
    //         h1 {
    //             color: $dark-blue;
    //             font-family:'Foco CC', 'Roboto', Arial, sans-serif;
    //             margin: 0 104px 0 0;
    //             letter-spacing: 0;
    //             line-height: 90px;
    //         }
    //     }

    // }

}

.progress-bar {
    display:flex;
    list-style-type:none;
    width:660px;
    max-width: 100%;
    margin:0 auto;
    margin-block-start:0px;
    margin-block-end: 0px;
    padding-inline-start:0px;
    font-family: 'Roboto';
    border-bottom: 4px solid #999;


    li {
        border-bottom: 4px solid #999;
        padding: 15px 6px 15px 6px;
        font-size: 10px;
        text-transform:uppercase;
        // flex-basis: 12.5%;
        flex-grow:1;
        margin-bottom: -4px;
        transition: all 0.3s ease;
        display:inline-block;
        // text-align:right;

        &.active {
            border-bottom: 4px solid $yellow;
            color:$dark-blue;
            font-weight:bold;
        }
    }
}


.outer-container {
    padding-bottom: 60px;
    background:#eee;

    h1.heading {
        padding: 30px 0;
        font-weight: 800;
    }
}
.conversation-container {
    &.mask {
        -webkit-mask-image: -webkit-gradient(linear, left top, left 10%, from(rgba(0,0,0,0)), to(rgba(0,0,0,1)));
    }
    overflow-y:hidden;

    &.scroll {
        // overflow-y:scroll!important;
        max-height: 550px;
        display:block;
    }
    margin: 60px auto;
    background:rgba(0,0,0,0);
    padding: 30px;
    max-width: 600px;
    max-height: 500px;
    text-align:left;
    font-size:16px!important;

    display: -webkit-flex;
	display: -moz-flex;
	display: -ms-flex;
    display:flex;
    flex-direction:column;

    -webkit-justify-content: flex-end;
	-moz-justify-content: flex-end;
	-ms-justify-content: flex-end;
	justify-content: flex-end;

    p {
        font-size: 16px!important;
        margin: 8px 0;
    }
    
    .ai-comment {
        background:#fff;
        padding: 5px 15px;
        border-radius: 8px 8px 8px 0;
        max-width: 400px;
        margin: 6px auto 6px 0;
        height: auto;
        @extend %boxshadow;

        a {
            text-decoration:none;
            font-weight: bold;
            color: $blue;
            transition: 0.3s ease;
            &:hover {
                color:$dark-blue;
            }
        }
    }

    .user-comment {
        background:$blue;
        color:#fff;
        padding: 5px 15px;
        border-radius: 8px 8px 0 8px;
        max-width:400px;
        margin: 6px 0 6px auto;
        height:auto;
        @extend %boxshadow;
    }
}

.results-container {
    background:#fff;
    padding: 15px 30px;
    border-radius: 8px 8px 8px 0;
    max-width: 600px;
    margin: 50px auto;
    height: auto;
    @extend %boxshadow;

    .circle {
        margin: 30px auto;
    }

    form {
        display:flex;
        flex-wrap: wrap;
        justify-content:space-between;

        span.mdc-button__label {
            font-size:16px!important;
        }

        div.mdc-text-field {
            flex-grow: 1;
            margin: 5px;
            flex-basis: 100%;

            label.mdc-floating-label {
                font-size: 16px!important;
            }

            &.half-width {
                min-width: 200px;
                flex-basis: 250px;
            }
        }

        p {
            margin: 20px auto;
            
            &.confirmation-msg {
                padding: 20px;
                background:#eee;
                width: 100%;
            }

            a {
                text-decoration:none;
                font-weight:bold;
                color:$blue;
            }
        }

        button {
            width: 100%;
            margin-bottom: 10px;

            &:disabled {
                background:#eee;
            }
        }
    }


    ul {
        list-style-type:none;
        padding-inline-start: 0;
        margin-block-start: 0;
        display:flex;
        flex-wrap: wrap;
        justify-content:center;
        margin-bottom: 30px;

        li {
            text-transform:capitalize;
            flex-basis: 25%;
            flex-grow: 1;
            border-radius: 4px;
            margin: 1%;
            color: #fff;
            text-align:center;
            background: $blue;
            padding: 30px 15px 5px 15px;
            min-width: 100px;
            max-width: 165px;
            transition: 1s ease;
            @extend %boxshadow;
            p {
                position:absolute;
                opacity: 0;
                transition: opacity 0.5s ease;

            }

            i,
            .svg-inline--fa {
                font-size: 32px;
            }

            h4, i, svg-inline-fa {
                opacity: 1;
                transition: 0.5s ease;
                pointer-events:none;
            }

            &:hover {
                filter: brightness(0.8);
                cursor:pointer;
            }

            &.rotate {
                transform: rotateY(180deg);
                i, h4 {
                    opacity: 0;
                }
                p {
                    position:absolute;
                    opacity: 1;
                    transform: rotateY(180deg);
                    text-transform:none;
                    color:#fff;
                    right: 15px;
                    left: 15px;
                    top: 15px;
                    pointer-events:none;
                }
            }
        }
    }
}

@media screen and (max-width: 800px) {
    #app {
        // header {
        //     height: 60px;
        //     .container {
        //         display:flex;
        //         align-items:center;
        //         h1 {
        //             padding-top: 5px;
        //             font-size: 24px;
        //             margin: unset;
        //             font-weight:bold;
        //         }

        //         img {
        //             height: 40px;
        //             float:unset;
        //             margin: 0 20px 0 5px;
        //         }
                
        //     }
        // }
        .progress-bar {
            li {
                span {
                    display:none;
                }
                flex-basis: 12%;
            }
        }
        .outer-container {
            padding-top: 0;
            .results-container {
                width: unset;
            }
            .conversation-container {
                &.mask {
                    -webkit-mask-image: -webkit-gradient(linear, left top, left 10%, from(rgba(0,0,0,0)), to(rgba(0,0,0,1)));
                }

                max-height:calc(100vh - 180px);

                padding: 40px 10px;
                margin: 20px auto;

                .ai-comment,
                .user-comment {
                    max-width: 80%;
                }
            }
        }
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