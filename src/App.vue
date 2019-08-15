<template>
	<div id="app">

        <BackgroundBlob></BackgroundBlob>

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


            <spinner color='#fcd208' v-if='loading'></spinner>

            <h3 v-else-if='!loading && !latestScorecard'>
                Sorry, your Cancer Risk Scorecard could not be retrieved at this time.
                <br>
                Please check the link and try again.
            </h3>

            <div class="results-container" v-else-if='latestScorecard'>
                <div class='overview'>
                
                    <h1 class='total-score'><strong>

                        Hi {{ latestScorecard.firstName }}, 
                        
                        <span v-if='parseInt(latestScorecard.scores.total) === 100'>well done! </span>

                        <span v-else-if='parseInt(latestScorecard.scores.total) >= 75'>
                        you're doing well. </span>
                        
                        <span v-else-if='parseInt(latestScorecard.scores.total) >= 50'>
                        you're on the right track.</span>

                        <span v-else>there's room for improvement. </span></strong>

                    <br>Your total prevention score is: </h1>

                    <div class='score-container'>

                        <div class='line'></div>

                        <vue-circle
                            :progress="latestScorecard.scores.total"
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

                    <p class='score-date'>Based on your answers from {{ date }}</p>

                    <h3>This score is out of 100 and calculates how much you are reducing your cancer risk through healthy lifestyle behaviours. The higher your score, the more ways you are currently reducing your cancer risk.<br><br><strong>Aim for 100 and improve your health!</strong></h3>

                </div>

                <div class='guide-download'>
                    <div class='img-container'>
                        <img src='https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/guide-resource-cropped.png' />
                    </div>
                    <div class='content'>
                        <p>Our cut your cancer risk guide contains a broad overview on how you can reduce your cancer risk.</p>
                        <download link='https://cancerqld.blob.core.windows.net/resources/quest/Cut%20your%20cancer%20risk_DL_v09%20(002).pdf'>Download</download>
                    </div>
                </div>

                <span v-for="(category, index) in scorecards" :key="index" >
                    <category :category='category' :index='index' :gender='latestScorecard.gender'></category>

                    <div class='category-break' v-if='(index + 1) < scorecards.length && scorecards[index].bad.length === 0 && scorecards[index + 1].bad.length > 0'></div>
                </span>
            </div>
        </div>
	</div>
</template>

<script>

import { Spinner, Category, HeaderBlob, BackgroundBlob, Download } from './components'
import VueCircle from 'vue2-circle-progress'
import axios from 'axios'
const moment = require('moment');

export default {
    name: 'app',
    components: {
        VueCircle,
        Spinner,
        Category,
        HeaderBlob,
        BackgroundBlob,
        Download
    },
	data () {
		return {
            loading: true,
            results: {},
            latestScorecard: null
		}
    },
    computed: {
        date()  {
            return this.latestScorecard
                ? moment(this.latestScorecard._ts).format('MMMM Do YYYY')
                : null
        },
        scorecards() {
            let vm = this;

            if (!vm.latestScorecard) { return [] }
            let scorecards = [];

            Object.keys(vm.latestScorecard.scores).forEach((category) => {
                if (category !== 'total') {
                    scorecards.push(vm.getCategoryObj(category))
                }
            })

            return scorecards.sort((a, b) => a.bad.length - b.bad.length)
        }
    },
    methods: {
        getCategoryObj(category) {
            let vm = this;

            let categoryObj = {
                name: category
            };

            categoryObj.good = vm.latestScorecard.recommendations.filter(rec => rec.category === category && rec.score == 100)
            categoryObj.bad = vm.latestScorecard.recommendations.filter(rec => rec.category === category && rec.score != 100)

            return categoryObj;
        },
        showResults() {
            let vm = this;

            let checkExists = setInterval(function() {
                if (vm.latestScorecard) {
                    let percentText = document.querySelector('span.percent-text');
                    if (percentText && (percentText.innerHTML == (vm.latestScorecard.scores.total + '%'))) {
                        percentText.innerHTML = vm.latestScorecard.scores.total;
                        percentText.style.opacity = 1;
                        clearInterval(checkExists);
                    }
                }
            }, 50);
        },
        getScoreCard(user) {
            let vm = this;

            axios
                .post('https://prod-05.australiaeast.logic.azure.com:443/workflows/df753e6a563e451ea76a06b71d1a4a9e/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=pge8rl1wK4YG2jeyFkb3gl38yu97YZAyBzp6Dd6vAxA', {user: user})
                .then(response => {
                    this.results = response.data.scorecards.sort((a,b) => a._ts - b._ts)
                    this.results.forEach((card) => {
                        if (card.entry && !vm.latestScorecard) {
                            vm.latestScorecard = card.entry;
                            return;
                        }
                    })
                })
                .finally(() => vm.loading = false)
        }
    },
    mounted () {
        let vm = this;

        let user = vm.$route.query.user;
        vm.getScoreCard(user);
        vm.showResults()
    }
}
</script>

<style lang='scss'>

@import './styles/main.scss';
@import './styles/variables.scss';
@import './styles/responsive.scss';

#app {
    border-top: 3px solid $yellow;
	font-family: 'Foco CC', 'Roboto', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: $dark-blue;
    height:100vh;
    background: #eee;

    .outer-container {
        background:#eee;
        padding: 10px 0;

        .heading-container {
            display: flex;
            flex-direction: row;
            width: 100%;
            max-width: 1020px;
            margin: 0 auto;
            position: relative;

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

                img {
                    height: 60px;
                    width: auto
                }
            }
        }
    }

    h1.heading {
        font-weight: 800;
        max-width: 200px;
        text-align: left;
        line-height: 1.8rem;

        .yellow-fullstop {
            font-size: 40px;
            color: $yellow;
        }
    }

    .spinner {
        margin-top:40vh!important;

        & > .cube1 {  background-color: $yellow!important; }
        & > .cube2 {  background-color: $blue!important; }
    }

    .results-container {
        background:#fff;
        padding: 30px;
        border-radius: 8px;
        max-width: 960px;
        margin: 30px auto;
        margin-top: 0px;
        height: auto;
        position: relative;
        @extend %boxshadow;

        .guide-download {
            display:flex;
            background: #E2EAEE;
            color:$dark-blue;
            margin: 30px auto 60px;
            max-width: 600px;
            position:relative;

            .img-container {
                flex-basis: 40%;
                img {
                    position:absolute;
                    left: -40px;
                    bottom: 0;
                    max-height: 200px;
                }
            }

            .content {
                flex-basis: 60%;
                padding:30px;
                text-align:left;

                p {
                    margin: 0 0 20px 0;
                    padding: 0;
                }
            }

        }

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

        .score-date {
            font-size: 12px;
            margin-top: 15px;
            padding-top: 0;
        }

        .score-container {
            display:flex;
            max-width: 500px;
            justify-content:space-between;
            align-items:center;
            margin: 30px auto 0;
            flex-wrap: wrap;


            .line {
                height: 1px;
                border-top: 2px solid $blue;
                width: 150px;
            }

            .circle {
                margin: 15px 0 0 0;
                // padding: 0 30px;
                flex-basis: 150px;
                flex-grow: 1;
                max-width: 150px;

                span.percent-text {
                    opacity: 0;
                    transition: 0.2s;
                    font-size: 48px!important;
                }
            }
        }

        div.score-msg {
            margin-bottom: 40px;
        }

        .yellow {
            font-weight:bold;
            text-decoration:$yellow;
            text-decoration-line: $yellow;
        }

        .circle {
            margin: 30px auto;
        }

        &>div>h3 {
            max-width: 600px;
            margin: 20px auto 0 auto;
            font-weight: 400;
        }

        div.category-break {
            height: 1px;
            border-top: 1px solid #eee;
            // width: 100%;
            margin: 25px 15px;
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