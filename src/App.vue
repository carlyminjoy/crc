<template>
	<div id="app">
        <BackgroundBlob :finished="state.showResults"></BackgroundBlob>
        <div class="outer-container">
        <div class="heading-container">
            <a href='https://cancerqld.org.au' target='_blank'>
                <div class="cancer-council-logo">
                    <img src="https://www.cancer.org.au/images/cancer_council.png" />
                </div>
            </a>
            <HeaderBlob></HeaderBlob>
            <h1 class='heading'>Cancer Risk Calculator<span class="yellow-fullstop">.</span></h1>
        </div>

            <ul class="progress-bar">
                <li v-for="(route, index) in routes" :key="index"
                    :class="{ 'active' : currentStep && index <= routes.indexOf(state.activeCategory) }">

                    <span>{{ route == 'uv' ? 'UV' : route }}</span>

                </li>
            </ul>

            <div class="results-container" :class="{ ie: state.isIe }" v-if="state.showResults">

                <div class='overview'>
                
                    <h1 class='total-score'><strong>
                        
                        <span v-if='parseInt(results.total) === 100'>Well done. </span>

                        <span v-else-if='parseInt(results.total) >= 75'>
                        Well done, you're doing well. </span>
                        
                        <span v-else-if='parseInt(results.total) >= 50'>
                        Well done, you're on the right track.</span>

                        <span v-else>Room for improvement. </span></strong>
                    <br>Your total prevention score is: </h1>

                    <div class='score-container'>

                        <div class='line'></div>

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

                        <div class='line'></div>

                    </div>

                    <h3>This score is out of 100 and calculates how much you are reducing your cancer risk through healthy lifestyle behaviours. The higher your score, the more ways you are currently reducing your cancer risk.<br><br><strong>Aim for 100 and improve your health!</strong></h3>

                </div>

                <div class='cta'>
                    <h3>Receive your Cancer Risk Scorecard with detailed results and tips to reduce your cancer risk.</h3>

                    <div class='cta-items'>
                        <div>Access to helpful resources</div>
                        <div class='blue-dot'>.</div>
                        <div>Keep track of your progress</div>
                        <div class='blue-dot'>.</div>
                        <div>A breakdown of your score</div>
                    </div>

                    <vmd-button class='scorecard' text='Get your free Scorecard' @click="scrollToScorecard()"></vmd-button>

                </div>

                <div class='category-wrapper' v-if='categoryResults.green.length > 0'>

                    <h2>You're doing great in the following areas:</h2>

                    <ul class='good'>
                        <template v-for="category in scoredCategories">
                            <li @click='category.rotated = !category.rotated' 
                                :class="{'rotate': category.rotated }" 
                                :key="category.name" 
                                v-if='categoryResults.green.includes(category.name)'>

                                <div class='front'>
                                    <img class='category-icon' :src="category.goodIcon" />
                                    <h4 :class="{'uv' : category.name === 'uv'}">{{ category.name }}</h4>
                                </div>

                                <div class='back'>
                                    <p>{{category.desc}}</p>
                                </div>

                            </li>
                        </template>
                    </ul>

                </div>

                <div class='category-wrapper' v-if='categoryResults.red.length > 0'>

                    <h2>The areas you could improve in are:</h2>

                    <ul class='bad'>
                        <template v-for="category in scoredCategories">

                            <li @click='category.rotated = !category.rotated' 
                                :class="{ 'rotate' : category.rotated }" 
                                :key="category.name" 
                                v-if='categoryResults.red.includes(category.name)'>

                                <div class='front'>
                                    <img class='category-icon' :src="category.badIcon" />
                                    <h4 :class="{'uv' : category.name === 'uv'}">{{ category.name }}</h4>
                                </div>
                            
                                <div class='back'>
                                    <p>{{category.desc}}</p>
                                </div>

                            </li>

                        </template>
                    </ul>
                </div>

                <div class='form-container' ref="scorecardForm">
                    <h1>Get your Cancer Risk Scorecard</h1><br>

                    <h3>You'll get access to your scorecard that breaks down each category and provides you with the resources to help further decrease your caner risk.</h3><br>
                    <h3>We'll follow up in a few months where you can compare your progress over time.</h3> <br><br>

                    <form>
                        <vmd-text-field class='narrow' label='First Name' v-model="$v.form.firstName.$model" :invalid='$v.form.firstName.$error'></vmd-text-field>
                        <vmd-text-field class='wide' label='Email Address' type='email' v-model="$v.form.emailAddress.$model" :invalid='$v.form.emailAddress.$error'></vmd-text-field>

                        <p>By submitting this form, you are agreeing to our <a href='https://cancerqld.org.au/about-us/our-privacy-policy/read-our-privacy-position-statement/' target='_blank'>Privacy Collection Statement</a>.</p>

                        <vmd-button class='scorecard' v-if='!state.submitted' :disabled="state.loading || $v.$anyError || formDisabled" :loading="state.loading" text='Get Scorecard' @click="sendResults()"></vmd-button>
                        <p v-else class="confirmation-msg">Thank you! Your details have been submitted. <br>You will receive your personalised Cancer Risk Scorecard shortly.</p>
                    </form>

                </div>

            </div>

            <div class="conversation-container mask" ref="conversationEl" :class="{ scroll : state.isIe }" v-if="!state.showResults">

                <template class="step-container" v-for="(step, index) in steps">

                    <transition name="fade" :key="index">

                        <div v-if="display(step) && index <= currentStep" class='ai-comment'>

                            <question v-if="step.question && !step.userInput" 
                                    :question=step 
                                    v-on:addstep="addStep()"
                                    v-on:scrolltobottom='scrollToBottom()'></question>

                            <weight v-else-if='["bmi", "waist"].includes(step.id)' 
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
import { default as HeaderBlob } from './Blob/HeaderBlob.vue'
import { default as BackgroundBlob } from './Blob/BackgroundBlob.vue'
import { vmdButton, vmdTextField } from '@ccq/ccq-vue-components'

import { setTimeout } from 'timers';
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

let url = window.location.href;
let debug = url.match(/debug/g);
const timers = debug 
? {
    shortest: 1,
    short: 1,
    med: 1,
    long: 1
} 
: {
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
        HeaderBlob,
        BackgroundBlob,
        vmdButton,
        vmdTextField,
        VueCircle
    },
	data () {
		return {
            sourceIdentifier: 'cancerriskquiz-webform-c9dc3b17',
            resultID: null,
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
            steps: conversation.steps,
            debug: !!debug
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

            let nextStep = vm.steps[next]
            let nextIsFinalStep = vm.steps[next].id === 'final'

            if (nextIsFinalStep) {
                vm.state.activeCategory = 'results'
                vm.calculateResults()
                setTimeout(() => (vm.state.showResults = true), timers.med)
                
            } else {
                if (nextStep.question) {
                    vm.state.activeCategory = nextStep.category
                    setTimeout(() => vm.scrollToBottom(), 1300)
    
                    if (!nextStep.display(vm.steps)) {
                        setTimeout(() => vm.currentStep++ && vm.scrollToBottom(), timers.shortest)

                    }
    
                }  else {
                    setTimeout(() => vm.currentStep++ && vm.scrollToBottom(), (nextStep.delay ? timers.long : timers.med))
                }
            }
        }
    },
    computed: {
        formDisabled() {
            let vm = this;

            return vm.form.firstName.length <= 1 || vm.form.lastName.length <= 1 || vm.form.emailAddress.length <= 6
        },
        displayScreening() {
            let vm = this;

            let age = vm.steps.find(s => s.id === 'age').score;
            let gender = vm.steps.find(s => s.id === 'gender').score;

            if (!(age || gender)) { return false }

            return  (["64", "74"].includes(age) && gender !== 'o') || 
                    (["39", "49"].includes(age) && gender === "f")
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
        scrollToScorecard() {
            var element = this.$refs.scorecardForm;
            element.scrollIntoView({behavior: "smooth"});
        },
        getRecommendations() {
            let vm = this;

            let answeredQuestions = vm.steps.filter((step) => step.scoredQuestion && step.score !== null)

            let recommendations = answeredQuestions.map((q) => {
                let answer = q.options? q.options.find((o) => o.score === q.score) : null;

                let obj = {
                    id: q.id,
                    question: q.text.replace(/(<([^>]+)>)/ig,""),
                    category: q.category,
                    answer: answer ? answer.userResponse : q.userResponse,
                    score: Math.round(q.score),
                    recommendation: answer ? answer.aiResponse : q.aiResponse
                }

                if (q.id === 'bmi') { obj.bmi = q.bmi }
                if (q.id === 'waist') { obj.waist = q.waist }

                return obj;
            })

            return recommendations;
        },
        async sendResults() {
            let vm = this;

            vm.state.loading = true;

            let form = new Form({
                firstName: vm.form.firstName,
                lastName: vm.form.lastName,
                emailAddress: vm.form.emailAddress,
                identify: vm.steps.find(s => s.id === 'identify').score,
                gender: vm.steps.find(s => s.id === 'gender').score,
                postcode: vm.steps.find(s => s.id === 'postcode').score,
                scores: vm.results,
                recommendations: vm.getRecommendations(),
                RowKey: vm.resultID
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

            let scoredSteps = vm.steps.filter(s => s.scoredQuestion && s.score !== null)
            let categories = new Set(scoredSteps.map(s => s.category))

            categories.forEach(category => {
                if (category !== 'personal') {

                    let questions = scoredSteps.filter(s => s.category == category)
                    let totalScore = questions.reduce((a, b) => ({ score: a.score + b.score })).score
                    let categoryTotal = Math.round(totalScore  / questions.length)
                    
                    results[category] = categoryTotal
                    vm.categoryResults[categoryTotal === 100 ? 'green' :  'red'].push(category)
                    total += categoryTotal
                }
            })

            results.total = Math.round(total / Object.keys(results).length)
            vm.results = results;
            vm.storeResults()
        },
        storeResults() {
            let vm = this;

            let bmi = vm.steps.find(s => s.id === 'bmi').bmi;
            let waist = vm.steps.find(s => s.id === 'waist').waist;
            let ageScore = vm.steps.find(s => s.id === 'age').score
            let age;
            
            switch (ageScore) {
                case '24':
                    age = '18-24'
                    break;
                case '39':
                    age = '25-39'
                    break;
                case '49':
                    age = '40-49'
                    break;
                case '64':
                    age = '50-64'
                    break;
                case '74':
                    age = '65-74'
                    break;
                case '75':
                    age = '75+'
                    break;
            }
            
            let postData = {
                demographics: {
                    age: age,
                    gender: vm.steps.find(s => s.id === 'gender').score,
                    postcode: vm.steps.find(s => s.id === 'postcode').score,
                    identify: vm.steps.find(s => s.id === 'identify').score
                },
                uv: {
                    clothing: Math.round(vm.steps.find(s => s.id === 'clothing').score),
                    hat: Math.round(vm.steps.find(s => s.id === 'hat').score),
                    sunscreen: Math.round(vm.steps.find(s => s.id === 'sunscreen').score),
                    shade: Math.round(vm.steps.find(s => s.id === 'shade').score),
                    checkSkin: Math.round(vm.steps.find(s => s.id === 'checkSkin').score),
                    professionalCheckSkin: Math.round(vm.steps.find(s => s.id === 'professionalCheckSkin').score),
                    sunglasses: Math.round(vm.steps.find(s => s.id === 'sunglasses').score),
                    total: vm.results.uv
                },
                smoking: {
                    smokingStatus: Math.round(vm.steps.find(s => s.id === 'smokingStatus').score),
                    householdSmoke: Math.round(vm.steps.find(s => s.id === 'householdSmoke').score),
                    total: vm.results.smoking
                },
                alcohol: {
                    standardDrinks: Math.round(vm.steps.find(s => s.id === 'standardDrinks').score),
                    total: vm.results.alcohol
                },
                nutrition: {
                    fruit: Math.round(vm.steps.find(s => s.id === 'fruit').score),
                    vegetables: Math.round(vm.steps.find(s => s.id === 'vegetables').score),
                    fibre: Math.round(vm.steps.find(s => s.id === 'fibre').score),
                    redMeat: Math.round(vm.steps.find(s => s.id === 'redMeat').score),
                    processedMeat: Math.round(vm.steps.find(s => s.id === 'processedMeat').score),
                    total: vm.results.nutrition
                },
                weight: {
                    bmi: bmi,
                    waist: waist,
                    total: vm.results.weight
                },
                physicalActivity: {
                    exercise: Math.round(vm.steps.find(s => s.id === 'exercise').score),
                    total: vm.results['physical activity']
                },
                screening: {
                    breastScreening: vm.steps.find(s => s.id === 'breastScreening').score ? Math.round(vm.steps.find(s => s.id === 'breastScreening').score) : null,
                    bowelScreening: vm.steps.find(s => s.id === 'bowelScreening').score ? Math.round(vm.steps.find(s => s.id === 'bowelScreening').score) : null,
                    cervicalScreening: vm.steps.find(s => s.id === 'cervicalScreening').score ? Math.round(vm.steps.find(s => s.id === 'cervicalScreening').score) : null,
                    total: vm.results.screening
                },
                total: vm.results.total,
                debug: vm.debug
            }

            let url = 'https://prod-16.australiaeast.logic.azure.com:443/workflows/472070d88d9f4f4899e2c2ad200967d0/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=caau2HrVCDbyNa256L0-a38ko8Q3r-rMJnkaPWxTOng'

            axios.post(url, postData)
                .then(r => vm.resultID = r.data.RowKey)
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
        let vm = this;

        vm.currentStep = 0;

        var ua = window.navigator.userAgent;
        vm.state.isIe = /MSIE|Trident/.test(ua);
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


@keyframes fade-in {
    0% { opacity: 0 }
    100% { opacity: 1 }
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
}
#app {
	font-family: 'Foco CC', 'Roboto', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: $dark-blue;
    height:100vh;
    background: #eee;

    h1, h2, h3, h4, h5, h6 {
        color:unset;
    }

    h1 {
        margin: 0;
    }
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
    position: relative;


    li {
        border-bottom: 4px solid #999;
        padding: 15px 6px 15px 6px;
        font-size: 14px;
        font-family: 'Foco CC', 'Roboto', Arial, sans-serif;
        text-transform:capitalize;
        flex-grow:1;
        margin-bottom: -4px;
        transition: all 0.3s ease;
        display:inline-block;

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

    .heading-container {
        display: flex;
        flex-direction: row;
        width: 660px;
        max-width: 100%;
        margin: 0 auto;
        position: relative;

        // * { animation: fade-in 1s forwards; }

        a {
            display: contents;
        }

        .cancer-council-logo {
            background: white;
            border-radius: 5px; 
            box-shadow: 0px 0px 2px #00000016;
            margin-top: 12px;
            margin-right: 10px;
            height: 100%;
            padding-top: 3px;
            padding-left: 15px; padding-right: 20px;
            image-rendering: -moz-crisp-edges; /* Firefox */
            image-rendering: -o-crisp-edges; /* Opera */
            image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
            image-rendering: crisp-edges;
            -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
            // display: none;

            img {
                height: 60px;
                width: auto
            }
        }

        h1.heading {
            padding: 23px 0;
            font-weight: 800;
            max-width: 200px;
            text-align: left;
            line-height: 1.8rem;

            .yellow-fullstop {
                font-size: 40px;
                color: $yellow;
            }
        }
    }
}
.conversation-container {
    &.mask {
        -webkit-mask-image: -webkit-gradient(linear, left top, left 10%, from(rgba(0,0,0,0)), to(rgba(0,0,0,1)));
    }
    overflow-y:hidden;

    &.scroll {
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
    /* padding: 15px 30px; */
    border-radius: 8px;
    max-width: 600px;
    margin: 50px auto;
    height: auto;
    position: relative;
    @extend %boxshadow;

    .overview {
        padding: 30px;
    }

    &.ie ul {
        justify-content:flex-start!important;
    }

    h1.total-score {
        margin-top: 15px!important;
        font-weight: 400;
    }

    h3 {
        font-weight: 400;

        max-width: 450px;
        margin: 0 auto;
    }

    .score-container {
        display:flex;
        max-width: 500px;
        justify-content:space-between;
        align-items:center;
        margin: 30px auto;
        flex-wrap: wrap;

        .line {
            height: 1px;
            border-top: 2px solid $blue;
            width: 150px;
        }

        .circle {
            margin: 15px 0;
            // padding: 0 30px;
            flex-basis: 150px;
            flex-grow: 1;
            max-width: 150px;
        }
    }

    div.score-msg {
        margin-bottom: 40px;
    }

    .cta {
        padding: 45px 30px 30px 30px;
        background: $dark-blue;
        color:#fff;


        .cta-items {
            padding: 0;
            display:flex;
            align-items:center;

            div {
                padding: 0 10px;
                font-weight: 600;
                
                &.blue-dot {
                    color:$blue;
                    font-size: 60px;
                    margin-bottom: 30px;
                }
            }


        }
    }

    button.scorecard {
        padding-left: 30px;
        padding-right: 30px;
        margin-bottom: 10px;
        background:$yellow!important;
        text-transform:unset;
        border-radius: 50px;
        margin: 0 auto;
        letter-spacing: 0;
        font-weight:600;
        letter-spacing: 0;
        color:$dark-blue!important;
    }

    .form-container {
        padding: 30px;
        background: $dark-blue;
        color:#fff;
        border-radius: 0 0 8px 8px;
        /* margin-bottom: 15px; */

        h1 {
            margin-top: 15px!important;
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
                background:white;
                border-radius: 4px;
                flex-grow: 1;
                margin: 5px;
                flex-basis: 100%;

                label.mdc-floating-label {
                    font-size: 14px!important;
                    line-height: 14px!important;
                }

                &.narrow {
                    min-width: 200px;
                    flex-basis: 200px;
                }

                &.wide {
                    min-width: 300px;
                    flex-basis: 300px;
                }
            }

            p {
                margin: 20px auto;
                font-size: 14px;
                
                &.confirmation-msg {
                    padding: 20px;
                    background:#eee;
                    width: 100%;
                    color: $dark-blue;
                    font-weight: bold;
                    border-radius: 4px;
                }

                a {
                    text-decoration:none;
                    font-weight:bold;
                    color:$blue;
                }
            }
        }
    }

    .category-wrapper {
        background:#eee;
        padding: 15px;
        /* border-radius: 4px; */
        /* margin-bottom: 30px; */
        margin: 10px;
        background:#eee;
    }

    ul {
        list-style-type:none;
        padding-inline-start: 0;
        margin-block-start: 0;
        padding-left: 0;
        display:flex;
        flex-wrap: wrap;
        justify-content:center;
        margin-bottom: 15px;

        &.bad > li {
            background:$yellow;
            color: $dark-blue;
        }

        li {
            flex-basis: 25%;
            flex-grow: 1;
            border-radius: 4px;
            margin: 1%;
            color: #fff;
            text-align:center;
            background: $blue;
            padding: 10px 5px;
            min-width: 130px;
            max-width: 165px;
            transition: 1s ease;
            @extend %boxshadow;

            &:hover {
                filter: brightness(0.8);
                cursor:pointer;
            }

            .front {
                opacity: 1;
                transition: 1s ease;
                pointer-events:none;
                text-transform:capitalize;
                padding: 15px;

                h4 {
                    margin: 5px 0;

                    &.uv {
                        text-transform:uppercase!important;
                    }
                }
            
                img {
                    height:50px;
                    margin: 5px;
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
                    font-size: 14px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    height:calc(100% - 20px);
                    max-width:150px;
                    margin-top: 0;
                    font-weight:bold;
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
                /* padding-bottom: 30px; */
                padding:15px;
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