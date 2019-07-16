<template>
	<div id="app">

        <div class="outer-container">

            <h1 class='heading'>Cancer Risk Calculator</h1>

            <ul class="progress-bar">
                <li v-for="(route, index) in routes" :key="index"
                    :class="{ 'active' : currentStep && index <= routes.indexOf(state.activeCategory) }">

                    <span>{{ route == 'uv' ? 'UV' : route 
                        }}</span>
                </li>
            </ul>

            <div class="results-container" v-if="state.showResults">
                <div class='total-score'>
                    Your total score is: 
                </div>

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

                <div class='info'>
                    <i class='fa fa-question-circle'></i>
                    <div class='info-text'>This score is out of 100, the lower your score is, the more ways you can reduce your cancer risk by making simple lifestyle changes. </div>
                </div>

                <span v-if='parseInt(results.total) === 100'>
                    <h2>Well done!</h2>
                </span>

                <span v-else-if='parseInt(results.total) >= 75'>
                    <h2>You're doing well</h2>
                    <h3>Well done - a few small changes can further reduce your cancer risk.</h3>
                </span>

                <span v-else-if='parseInt(results.total) >= 50'>
                    <h2>You're on the right track</h2>
                    <h3>Well done - there are plenty of ways you can reduce your cancer risk.</h3>
                </span>

                <span v-else>
                    <h2>Room for improvement</h2>
                    <h3>Good news - there are plenty of ways you can reduce your cancer risk.</h3>
                </span>

                <br><br>

                <template v-if='categoryResults.green.length > 0'>

                    <h2>You're doing great in the following areas:</h2>

                    <ul>
                        <template v-for="category in scoredCategories">
                            <li @click='rotate($event, category)' :key="category.name" v-if='categoryResults.green.includes(category.name)'>

                                <div class='front'>
                                    <img class='category-icon' :src="category.icon" />
                                    <h4 :class="{'uv' : category.name === 'uv'}">{{ category.name }}</h4>
                                </div>

                                <div class='back'>
                                    <p>{{category.desc}}</p>
                                </div>

                            </li>
                        </template>
                    </ul>

                </template>

                <template v-if='categoryResults.red.length > 0'>

                    <h2>The areas you could improve in are:</h2>

                    <ul>
                        <template v-for="category in scoredCategories">
                            <li @click='rotate($event, category)' :key="category.name" v-if='categoryResults.red.includes(category.name)'>

                                <div class='front'>
                                    <img class='category-icon' :src="category.icon" />
                                    <h4 :class="{'uv' : category.name === 'uv'}">{{ category.name }}</h4>
                                </div>
                            
                                <div class='back'>
                                    <p>{{category.desc}}</p>
                                </div>

                            </li>
                        </template>
                    </ul>
                </template>

                <h3>To receive your Cancer Risk Scorecard with your detailed results and tips to reduce your cancer risk, please enter your details below:</h3>

                <form>
                    <vmd-text-field class='half-width' label='First Name' v-model="$v.form.firstName.$model" :invalid='$v.form.firstName.$error'></vmd-text-field>
                    <vmd-text-field class='half-width' label='Last Name' v-model="$v.form.lastName.$model" :invalid='$v.form.lastName.$error'></vmd-text-field>
                    <vmd-text-field label='Email Address' type='email' v-model="$v.form.emailAddress.$model" :invalid='$v.form.emailAddress.$error'></vmd-text-field>

                    <p>By submitting this form, you are agreeing to our <a href='https://cancerqld.org.au/about-us/our-privacy-policy/read-our-privacy-position-statement/' target='_blank'>Privacy Collection Statement</a>.</p>

                    <vmd-button v-if='!state.submitted' :disabled="state.loading || $v.$anyError || formDisabled" :loading="state.loading" text='Get My Cancer Risk Scorecard' @click="sendResults()"></vmd-button>
                    <p v-else class="confirmation-msg">Thank you! Your answers have been submitted. <br>You will receive your personalised Cancer Risk Scorecard shortly.</p>
                </form>

            </div>

            <div class="conversation-container mask" ref="conversationEl" v-if="!state.showResults">

                <template class="step-container" v-for="(step, index) in steps">

                    <transition name="fade" :key="index">

                        <div v-if="display(step) && index <= currentStep" class='ai-comment'>

                            <question v-if="step.question && !step.userInput" 
                                    :question=step 
                                    v-on:addstep="addStep()"
                                    v-on:ready='scrollToBottom()'></question>

                            <weight v-else-if="step.userInput && step.category === 'weight'" 
                                    :question=step 
                                    :gender="steps.find(s => s.id === 'gender').score" 
                                    v-on:addstep="addStep()"></weight>

                            <postcode v-else-if="step.userInput && step.id === 'postcode'" 
                                    :question=step 
                                    v-on:addstep="addStep()"
                                    v-on:scrolltobottom='scrollToBottom()'></postcode>

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
import { default as scoredCategories } from './scoredCategories.js'
import { default as Question } from './Question.vue'
import { default as Weight } from './Weight.vue'
import { default as Postcode } from './Postcode.vue'
import { setTimeout } from 'timers';
import { vmdButton, vmdTextField } from '@ccq/ccq-vue-components'
import { validationMixin } from 'vuelidate';
import { 
    required, 
    email,
    minLength,
    maxLength
} from 'vuelidate/lib/validators'; 
import VueCircle from 'vue2-circle-progress'
import axios from 'axios'
import JQuery from 'jquery'
let $ = JQuery
import Form from './utils/Form.js'

const timers = {
    shortest: 500,
    short: 1000,
    med: 2000,
    long: 3000
}

export default {
    name: 'app',
    mixins: [validationMixin],
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
            sourceIdentifier: 'cancerriskquiz-webform-c9dc3b17',
            state: {
                isIe: false,
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
            categoryResults: {
                red: [],
                green: []
            },
            currentStep : null,
            results: '',
            scoredCategories: scoredCategories,
            steps: conversation.steps
		}
    },
    validations: {
        form: {
            firstName: {
                required,
                minLength: minLength(3),
                maxLength: maxLength(50)
            },
            lastName: {
                required,
                minLength: minLength(3),
                maxLength: maxLength(50)
            },
            emailAddress: {
                required,
                email,
                maxLength: maxLength(80)
            },
        }
    },
    watch: {
        currentStep (next, prev) {
            let vm = this;

            if (vm.steps[next].final) {
                vm.state.activeCategory = 'results'
                vm.calculateResults()
                setTimeout(() => (vm.state.showResults = true) && vm.scrollToBottom(), timers.med)
                return
            }

            if (!vm.steps[next].question) {
                setTimeout(() => vm.currentStep++ && vm.scrollToBottom(), (vm.steps[next].delay ? timers.long : timers.med))
                return
            }  else {
                vm.state.activeCategory = vm.steps[next].category
                setTimeout(() => vm.scrollToBottom(), 1300)
            }

            if (vm.steps[next].question && !vm.display(vm.steps[next])) {
                setTimeout(() => vm.currentStep++ && vm.scrollToBottom(), timers.shortest)
            }
        }
    },
    computed: {
        formDisabled() {
            let vm = this;

            return vm.form.firstName.length <= 1 || vm.form.lastName.length <= 1 || vm.form.emailAddress.length <= 6
        },
        displayScreening() {
            return this.steps[2].score && this.steps[3].score && 
                (["64", "74"].includes(this.steps[2].score) && this.steps[3].score === "f") 
                || (["64", "74"].includes(this.steps[2].score)) 
                || (["39", "49", "64", "74"].includes(this.steps[2].score) && this.steps[3].score === "f")
        },
        routes() {
            let generatedRoutes = [
                'personal',
                'uv', 
                'smoking',
                'alcohol',
                'nutrition',
                'weight',
                'physical activity'
            ]
            
            if (this.displayScreening) {
                generatedRoutes.push('screening')
            } 

            generatedRoutes.push('results')

            return generatedRoutes
        },
        submitBtnDisabled() {
            let vm = this;

            return vm.form.firstName === '' 
                || vm.form.lastName === '' 
                || vm.form.emailAddress === ''
        }
    },
    methods: {
        scrollToBottom() {
            if (this.state.isIe) {
                var element = this.$refs.conversationEl;
                element.scrollTop = element.scrollHeight;
            }
        },
        rotate(e, cat) {
            if (e.target.classList.length === 0) {
                e.target.classList.add('rotate');
                cat.rotated = true
            } else {
                (e.target.classList.remove('rotate'))
                cat.rotated = false
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
        // async getPostData() {
        //     let vm = this;
        //     let gaToken = await vm.getToken();

        //     let formData = new Form({
        //         firstName: vm.form.firstName,
        //         lastName: vm.form.lastName,
        //         emailAddress: vm.form.emailAddress,
        //         postcode: vm.steps[4].score,
        //         scores: vm.results,
        //         recommendations: vm.getRecommendations()
        //     })

        //     return gaToken ? {
        //         'sourceIdentifier': vm.sourceIdentifier,
        //         'entry': entry,
        //         'debug': 'development',
        //         'gaToken' : gaToken
        //     } : null;
        // },
        async sendResults() {
            let vm = this;

            vm.state.loading = true;

            let form = new Form({
                firstName: vm.form.firstName,
                lastName: vm.form.lastName,
                emailAddress: vm.form.emailAddress,
                gender: vm.steps.find(s => s.id === 'gender').score,
                postcode: vm.steps.find(s => s.id === 'postcode').score,
                scores: vm.results,
                recommendations: vm.getRecommendations()
            })

            form.submit(vm.sourceIdentifier, true)
                .then(response => vm.state.submitted = true)
                .catch(error => vm.state.errors = error)
                .finally(() => vm.state.loading = false)
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
                            if (step.id !== 'weight') { results.weight = step.score }

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
                vm.categoryResults[categoryScore === 100 ? 'green' :  'red'].push(category)
                total += categoryScore
            })

            results.total = Math.round(total / Object.keys(results).length)
            vm.results = results;
            vm.storeResults()
        },
        storeResults() {
            let vm = this;

            let bmi = vm.steps.find(s => s.id === 'bmi').bmi;
            let waist = vm.steps.find(s => s.id === 'waist').waist;

            let age;
            
            switch (vm.steps[2].score) {
                case '24':
                    age = '18-24'
                case '39':
                    age = '25-39'
                case '49':
                    age = '40-49'
                case '64':
                    age = '50-64'
                case '74':
                    age = '65-74'
                case '75':
                    age = '75+'
            }
            
            let postData = {
                age: age,
                gender: vm.steps.find(s => s.id === 'gender').score,
                postcode: vm.steps.find(s => s.id === 'postcode').score,
                identify: vm.steps.find(s => s.id === 'identify').score,
                uv: vm.results.uv,
                smoking: vm.results.smoking,
                alcohol: vm.results.alcohol,
                nutrition: vm.results.nutrition,
                weight: vm.results.weight,
                bmi: bmi,
                waist: waist,
                physicalActivity: vm.results['physical activity'],
                screening: vm.results.screening,
                total: vm.results.total
            }

            let url = 'https://prod-16.australiaeast.logic.azure.com:443/workflows/472070d88d9f4f4899e2c2ad200967d0/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=caau2HrVCDbyNa256L0-a38ko8Q3r-rMJnkaPWxTOng'

            axios.post(url, postData)
                .catch((e) => console.log(e))
            
        },
        addStep() {
            let vm = this;

            vm.scrollToBottom()

            setTimeout(() => {
                vm.steps[vm.currentStep].userResponded = true
                vm.display(vm.steps[vm.currentStep + 1]) ? vm.currentStep++ : vm.currentStep += 2
                vm.scrollToBottom()
            }, timers.short)
        },
        display(step) {
            let vm = this;
            return step.display(vm.steps);
        }
    },
    mounted () {
        this.currentStep = 0;

        var ua = window.navigator.userAgent;
        var isIE = /MSIE|Trident/.test(ua);

        if ( isIE ) {
            this.state.isIe = true;
            document.querySelector('.conversation-container').classList.add('scroll')
            document.querySelector('.results-container').classLIst.add('ie')
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

    .big {
        font-size: 18px;
        font-weight:bold;
    }

    .info {
        position:relative;
        display:inline-block;

        @media screen and (max-width: 600px) {
            .info-text {
                left: -220px!important;
            }
        }

        .fa-question-circle {
            cursor:pointer;
            transition: 0.3s ease;
            color:$yellow;
            font-size: 20px;

            &:hover {
                color:$dark-blue;
            }
        }

        .info-text {
            @extend %boxshadow;
            visibility:hidden;
            position:absolute;
            z-index:1;
            width: 220px;
            text-align:center;
            background:$dark-blue;
            color:#fff;
            font-size: 14px;
            font-weight: 400;
            border-radius: 4px;
            padding: 8px 10px;
            opacity:0;
            transition: 0.3s ease;
        }

        &:hover {
            .info-text {
                visibility:visible;
                opacity:1;
            }
        }
    }
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

    h1 {
        margin: 0;
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
        font-size: 14px;
        font-family: 'Foco CC', 'Roboto', Arial, sans-serif;
        text-transform:capitalize;
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

        img {
            height:20px;
            margin: 0 10px -3px;
        }

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

    &.ie ul {
        justify-content:flex-start!important;
    }

    .total-score {
        font-size: 24px;
        font-weight:600;
        margin-top: 10px;

        i {
            font-size: 16px;
        }
    }

    h3 {
        font-weight: 400;
    }

    .circle {
        margin: 30px auto;
        padding-left: 30px;

        span.percent-text {
            margin-left:-20px;
        }
    }

    form {
        display:flex;
        flex-wrap: wrap;
        justify-content:space-between;

        span.mdc-button__label {
            font-size:14px!important;
            line-height:14px!important;
        }

        div.mdc-text-field {
            flex-grow: 1;
            margin: 5px;
            flex-basis: 100%;

            label.mdc-floating-label {
                font-size: 14px!important;
                line-height: 14px!important;
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
        padding-left: 0;
        display:flex;
        flex-wrap: wrap;
        justify-content:center;
        margin-bottom: 30px;

        li {
            flex-basis: 25%;
            flex-grow: 1;
            border-radius: 4px;
            margin: 1%;
            color: #fff;
            text-align:center;
            background: $blue;
            padding: 20px 5px 10px 5px;
            min-width: 100px;
            max-width: 165px;
            transition: 1s ease;
            @extend %boxshadow;

            &:hover {
                filter: brightness(0.8);
                cursor:pointer;
            }

            .front {
                text-transform:capitalize;

                &.uv {
                    text-transform:uppercase;
                }
                opacity: 1;
                transition: 1s ease;
                pointer-events:none;
            
                img {
                    height:50px;
                    margin-bottom: 10px;
                }
            }

            .back {
                transform: rotateY(180deg);
                opacity: 0;
                transition: 1s ease;
                pointer-events:none;
                position:absolute;
                top:0;
                padding:10px;
                height: 100%;

                p {
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    height:calc(100% - 10px);
                    max-width:150px;
                }
            }

            &.rotate {
                transform: rotateY(180deg);

                    .front {
                        opacity: 0;
                    }

                    .back {
                        opacity: 1;
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
            max-width: 90%;
            padding: 0;
            li {
                span {
                    display:none;
                }
                flex-basis: 12%;
            }
        }
        .outer-container {
            padding-top: 0;
            padding-bottom: 0;

            h1 {
                margin: 20px 0 0 0;
                padding-bottom: 0;
            }

            .results-container {
                width: unset;
                border-radius: 0;
                margin: 30px auto 0;
                padding-bottom: 30px;
            }
            .conversation-container {
                &.mask {
                    -webkit-mask-image: -webkit-gradient(linear, left top, left 10%, from(rgba(0,0,0,0)), to(rgba(0,0,0,1)));
                }

                max-height:calc(100vh - 180px);

                padding: 10px;
                margin: 20px auto 0;

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


.flipcard-enter-active {
    transition-delay:0.5s;
    height:auto;
}


.flipcard-leave-active {
  transition: all 0.1s;
}

.flipcard-enter {
    opacity: 0;
    height:0;
}

.flipcard-leave-to {
  opacity: 0;
  height:0;
}

</style>