<template>
	<div id="app">
        <background-blob v-if='!state.isIe' :finished="state.showResults"></background-blob>
        <div class="outer-container">
        <div class="heading-container">
            <a href='https://cancerqld.org.au' target='_blank'>
                <div class="cancer-council-logo">
                    <img src="https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/cancer_council.png" />
                </div>                
            </a>
            <header-blob></header-blob>
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
                    <br>Your total score is: </h1>

                    <div class='score-container'>

                        <div class='line'></div>

                        <transition name='score'>
                            <div v-if='showScore' class="score-number-container">
                                <span class="score-number">{{ results.total }}</span> 
                            </div>
                        </transition>

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
                            :show-percent="false">

                        </vue-circle>

                        <div class='line'></div>

                    </div>

                    <h3>This score is out of 100 and calculates how much you are reducing your cancer risk through healthy lifestyle behaviours. The higher your score, the more ways you are currently reducing your cancer risk. <br><br><strong>Aim for 100 to improve your health!</strong></h3>

                </div>

                <div class='cta'>
                    <h3>Receive your Cancer Risk Scorecard with your detailed results, recommendations and tips to reduce your cancer risk.</h3>

                    <div class='cta-items'>
                        <div>Identify your areas for improvement</div>
                        <div class='blue-dot'>.</div>
                        <div>Access helpful resources</div>
                        <div class='blue-dot'>.</div>
                        <div>Keep track of your progress</div>
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

                    <h3>You'll get access to your personalised scorecard that breaks down your results and provides you with tips and resources to help you reduce your cancer risk.</h3><br>
                    <h3>We'll follow up in a few months so you can retake your Cancer Risk Calculator and compare your results.</h3> <br><br>

                    <form v-if='!state.submitted'>
                        <vmd-text-field class='narrow' label='First Name' v-model="$v.form.firstName.$model" :invalid='$v.form.firstName.$error'></vmd-text-field>
                        <vmd-text-field class='wide' label='Email Address' type='email' v-model="$v.form.emailAddress.$model" :invalid='$v.form.emailAddress.$error'></vmd-text-field>

                        <p>By submitting this form, you are agreeing to our <a href='https://cancerqld.org.au/about-us/our-privacy-policy/read-our-privacy-position-statement/' target='_blank'>Privacy Collection Statement</a>.</p>

                        <div class='submit-container'>
                            <vmd-button class='scorecard' :disabled="state.loading || $v.$anyError || formDisabled" :loading="state.loading" text='Get Scorecard' @click="sendResults()"></vmd-button>
                        </div>
                    </form>

                    <div v-else class='confirmation-msg'>
                        <i class='fa fa-check-circle'></i>
                        <h3>Thank you!</h3>
                        <p>Your details have been submitted. <br>You will receive your personalised Cancer Risk Scorecard shortly.</p>
                    </div>

                </div>

            </div>

            <div class='conversation-container-wrapper' :class="{ mask: !state.isMozilla}" ref="mobileConversationEl">

                <div class="conversation-container" ref="conversationEl" v-if="!state.showResults">

                    <template class="step-container" v-for="(step, index) in steps">

                        <transition name="fade" :key="index">

                            <div v-if="display(step) && index <= currentStep" class='ai-comment'>

                                <question v-if="step.question && !step.userInput" 
                                        :question=step 
                                        v-on:addstep="addStep()"
                                        v-on:loading='scrollToBottom'
                                        v-on:ready='scrollToBottom'></question>

                                <weight v-else-if='["bmi", "waist"].includes(step.id)' 
                                        :question=step 
                                        :gender="steps.find(s => s.id === 'gender').score" 
                                        v-on:addstep="addStep()"
                                        v-on:scrolltobottom='scrollToBottom'></weight>

                                <postcode v-else-if="step.userInput && step.id === 'postcode'" 
                                        :question=step 
                                        v-on:addstep="addStep()"
                                        v-on:scrolltobottom='scrollToBottom'></postcode>

                                <comment v-else v-on:scrolltobottom='scrollToBottom' :text='step.text'></comment>

                            </div>

                        </transition>

                        <transition name="fade" :key="index">
                            <div v-if="step.score || step.score === 0" class='user-comment'>

                                <comment v-if="!step.options" v-on:scrolltobottom='scrollToBottom' :text='step.userResponse'></comment>
                                <comment v-if="step.options" v-on:scrolltobottom='scrollToBottom' :text="step.options.find((o) => o.score === step.score ).userResponse"></comment>

                            </div>
                        </transition>

                    </template>

                </div>
            </div>
        </div>
	</div>
</template>


<script>

import { default as conversation } from './config/config.js'
import { default as scoredCategories } from './config/scoredCategories.js'
import { Question, Weight, Postcode, HeaderBlob, BackgroundBlob, Comment } from  './components/index.js'
import { vmdButton, vmdTextField } from '@ccq/ccq-vue-components'
import Form from './utils/Form.js'

import { setTimeout } from 'timers';
import { validationMixin } from 'vuelidate';
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'; 

import VueCircle from 'vue2-circle-progress'
import axios from 'axios'
import JQuery from 'jquery'
let $ = JQuery

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
        Comment,
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
                isMozilla: false,
                showResults: false,
                loading: false,
                submitted: false,
                errors: false,
                activeCategory: 'personal'
            },
            form: {
                firstName: '',
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
            debug: !!debug,
            showScore: false
		}
    },
    validations: {
        form: {
            firstName: {
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
                vm.showResults();
                
            } else {
                if (nextStep.question) {
                    vm.state.activeCategory = nextStep.category
                    // setTimeout(() => vm.scrollToBottom(), 1300)
    
                    if (!nextStep.display(vm.steps)) {
                        setTimeout(() => vm.currentStep++ && vm.scrollToBottom(), timers.short)

                    }
    
                }  else {
                    setTimeout(() => {
                        vm.currentStep++;
                        // setTimeout(() => vm.scrollToBottom(), 150)
                    }, (nextStep.delay ? timers.long : timers.med))
                }
            }
        }
    },
    computed: {
        formDisabled() {
            let vm = this;

            return vm.form.firstName.length <= 1 || vm.form.emailAddress.length <= 6
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
                || vm.form.emailAddress === ''
        }
    },
    methods: {
        scrollToBottom() {
            // if (this.state.isIe) {
                var element = this.$refs.mobileConversationEl;
                element.scrollTop = element.scrollHeight;
            // }
        },
        showResults() {
            let vm = this;

            setTimeout(() => (vm.state.showResults = true), timers.med)
            setTimeout(() => (vm.showScore = true), timers.long)
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
        vm.state.isMozilla = ua.includes('Firefox');
    }
}
</script>

<style lang='scss'>

@font-face {
    font-family: Foco CC;
    src:    url('https://cancerqld.blob.core.windows.net/content/landing-pages/taxappeal/fonts/FocoCC_W_Rg.e56f62bc.woff')
            format('woff');
}

@font-face {
    font-family: Foco CC Black;
    src:    url('https://cancerqld.blob.core.windows.net/content/landing-pages/taxappeal/fonts/FocoCC_W_Blk.fe3819a9.woff')
            format('woff');
}

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
    .grecaptcha-badge {
        display:none;
    }
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
    min-height: 100vh;
    background:#eee;
    padding: 10px 0;

    .heading-container {
        display: flex;
        flex-direction: row;
        width: 100%;
        max-width: 1020px;
        margin: 0 auto;
        position: relative;
        align-items:center;

        h1.heading {
            max-width: 200px;
            text-align: left;
            line-height: 1.8rem;
            font-family: 'Foco CC Black';
            line-height:32px;

            .yellow-fullstop {
                font-size: 40px;
                color: $yellow;
            }
        }

        a {
            display: contents;
            height: 60px;
            max-height: 60px;
        }

        .cancer-council-logo {
            background: white;
            border-radius: 5px; 
            box-shadow: 0px 0px 2px #00000016;
            margin-right: 10px;
            height: 100%;
            padding-left: 15px; 
            padding-right: 20px;
            image-rendering: -moz-crisp-edges; /* Firefox */
            image-rendering: -o-crisp-edges; /* Opera */
            image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
            image-rendering: crisp-edges;
            -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */

            img {
                height: 60px;
                width: auto;
            }
        }
    }
}

.conversation-container-wrapper {
    position:relative;
    min-height: 500px;
    overflow-y:auto;
    margin: 50px auto 0;
    padding: 30px;
    max-width: 600px;
    max-height: 500px;
    &.mask {
        -webkit-mask-image: -webkit-gradient(linear, left top, left 10%, from(rgba(0,0,0,0)), to(rgba(0,0,0,1)));
    }
}
.conversation-container {
    background:rgba(0,0,0,0);
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
        margin: 15px auto;
        flex-wrap: wrap;
        position:relative;

        .score-number-container {
            position:absolute;
            height: 48px;
            left: calc(50% - 30px);
            width: 60px;
            text-align:center;
            padding-bottom: 15px;
            top: calc(50% - 28px);
            
            span.score-number {
                font-size: 48px;
                font-weight: 600;
            }
        }

        .line {
            height: 1px;
            border-top: 2px solid $blue;
            width: 150px;
        }

        .circle {
            margin: 15px auto;
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
        margin-bottom: 30px;

        button.scorecard {
            font-size:14px!important;
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

        .cta-items {
            padding: 0;
            display:flex;
            align-items:center;

            & > div {
                padding: 0 10px;
                font-weight: 600;
                max-width: 200px;
                
                &.blue-dot {
                    color:$blue;
                    font-size: 60px;
                    margin-bottom: 30px;
                }
            }


        }
    }

    .submit-container {
        width: 100%;

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
    }


    .form-container {
        margin-top: 30px;
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
                
                a {
                    text-decoration:none;
                    font-weight:bold;
                    color:$blue;
                }
            }
        }
    }

    .confirmation-msg {
        .fa-check-circle {
            color: green;
            font-size:32px;
            margin-bottom: 10px;
        }
        margin: 0 0 20px 0;
        padding: 20px 20px 10px 20px;
        background:#fff;
        color: $dark-blue;
        border-radius: 4px;

        p {
            margin: 10px;
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
            margin-top: -15px;
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

            .heading-container {
                overflow-x:hidden;
                max-height:90px;
                text-align:center;
                display:flex;
                align-items:center;
                padding: 0;

                h1.heading {
                    margin: 0;
                    font-size: 22px;
                    line-height: 18px;
                    font-weight:900;
                    padding:0;
                }
                a {
                    padding-left: 10px;
                }
                a, a>div, a>div>img {
                    height: 55px;
                    max-height:55px;
                    width: auto;
                    margin: 0;
                    display:block;
                }
            }

            .results-container {
                width: unset;
                border-radius: 0;
                margin: 30px auto 0;
                /* padding-bottom: 30px; */
                padding:30px 0 20px;

                .narrow, .wide {
                    min-width:unset;
                }

                .line {
                    display:none!important;
                }

                .cta-items {
                    padding: 20px;
                    flex-direction: column;
                    & > div {

                        &.blue-dot {
                            margin-bottom: 20px!important;
                            line-height: 32px;
                            padding: 0!important;
                        }
                    }
                }
            }
            .conversation-container-wrapper {
                height: calc(100vh - 180px);
                min-height:calc(100vh - 180px);
                margin: 0 auto;

                &.mask {
                    -webkit-mask-image: -webkit-gradient(linear, left top, left 10%, from(rgba(0,0,0,0)), to(rgba(0,0,0,1)));
                }

                .conversation-container {
                    margin: 10px auto 0;

                    .ai-comment,
                    .user-comment {
                        max-width: 80%;
                    }
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

.score-enter-active, .score-leave-active {
  transition: opacity .3s;
}
.score-enter, .score-leave-to {
  opacity: 0;
}

</style>