<template>
	<div id="app">


        <div class="outer-container">

            <spinner color='#fcd208' v-if='loading'></spinner>

            <h3 v-else-if='!loading && !latestScorecard'>Sorry, your Cancer Risk Scorecard could not be retrieved at this time. <br>Please check the link and try again.</h3>

            <div class="results-container" v-else-if='latestScorecard'>
                <h1>{{latestScorecard.firstName }}, your total score is: </h1>

                <vue-circle
                    :progress="latestScorecard.scores.total"
                    :size="150"
                    :reverse="false"
                    line-cap="butt"
                    :fill='{ gradient: ["#0099DA", "#FCD208"], gradientDirection:[30,140,140,60] }'
                    empty-fill="#eee"
                    :animation-start-value="0.0"
                    :start-angle="-(Math.PI / 2)"
                    insert-mode="append"
                    :thickness="10"
                    :show-percent="true">

                </vue-circle>

                <div>
                    <template v-if='latestScorecard.scores.total === 100'>
                        <h2>Well done!</h2>
                    </template> 
                    <template v-else-if='latestScorecard.scores.total >= 75'>
                        <h2>You're doing well</h2>
                        <h3>Well done, a few small changes can further reduce your cancer risk.</h3>
                    </template> 
                    <template v-else-if='latestScorecard.scores.total >= 50'>
                        <h2>On the right track</h2>
                        <h3>Well done, there are plenty of ways you can reduce your cancer risk.</h3>
                    </template> 
                    <template v-else>
                        <h2>Room for improvement</h2>
                        <h3>Good news - there are plenty of ways you can reduce your cancer risk.</h3>
                    </template> 
                    <br>
                </div>

                <span v-for="(category, index) in scorecards" :key="index" >
                    <div class="category" >

                        <div class='category-heading'
                            @click='expandedCategory = expandedCategory === category.name ? null : category.name'>
                            
                            <h2>
                                <span>
                                <span class='img-container'><img :src='icons[category.name]' /></span>
                                {{ category.name.toUpperCase() }}</span>

                                <span class='category-icons'>
                                    <span v-if='category.bad.length === 0'><i class='fa fa-check-circle'></i></span>

                                    <template v-if='category.bad.length > 0'>
                                        <!-- <span v-if='category.bad.length > 0' class='yellow-text'> -->
                                            <span class='numbered-exclamation'>{{category.bad.length}} &nbsp;</span>
                                        <!-- </span> -->
                                        <i class='fa fa-exclamation-circle'></i>
                                    </template>
                                </span>
                            </h2>

                            <span class='expand-tag'>
                                <i v-if='expandedCategory !== category.name' class='fa fa-chevron-down'></i>
                                <i v-else class='fa fa-chevron-up'></i>
                            </span>

                        </div>

                        <div class="blue" :class="{'contracted' : expandedCategory !== category.name}" v-if="category.good.length > 0">

                            <h2>You're doing great in the following areas:</h2>

                            <ul>
                                <li v-for="(section, i) in category.good" :key="i">
                                    <i class='fa fa-check'></i>
                                    <p>{{ section.answer }}
                                        <span v-if='section.bmi'><strong><br><br>Your BMI is: {{ section.bmi }}.<br><br>
                                        The recommended range is between 18.5 and 25.</strong>
                                        </span>
                                    </p>
                                </li>
                            </ul>

                        </div>

                        <div class="grey" :class="{'contracted' : expandedCategory !== category.name}" v-if="category.bad.length > 0">
                            <h2>Areas for improvement:</h2>

                            <ul class='improvements'>
                                <li v-for="(section, i) in category.bad" :key="i">
                                    <i class='fa fa-exclamation-circle'></i> &nbsp;
                                    <p> {{ section.answer }} <br>
                                        <strong>
                                            <span v-if='section.bmi'><br>Your BMI is: {{ section.bmi }}.<br><br></span>
                                            <span v-html='section.recommendation'>
                                        </strong>
                                    </p>
                                </li>
                            </ul>

                            <template v-if="category.tips">
                                <h2 class="m0">Tips:</h2>
                                <ul class="tips">
                                    <li v-for="(tip,index) in category.tips" :key="index" v-html='tip'></li>
                                </ul>
                            </template>

                        </div>

                        <div v-if='filteredResources(category).length > 0' class='resources-container' :class="{'contracted' : expandedCategory !== category.name}">

                            <h2>Resources and links:</h2>
                            <ul class="resources">

                                <li v-for="(resource, index) in filteredResources(category)" :key='index'>
                                    
                                    <a class='img-link' :class="{ 'download' : resource.download, 'fullwidth' : resource.fullwidth }" :href='resource.url' target='_blank' v-bind:style="{ backgroundImage: 'url(' + resource.img + ')' }"></a>
                                    <div>
                                        <p>{{ resource.text }}</p>
                                        <a :href='resource.url' target='_blank'>{{ resource.cta }}</a>
                                    </div>
                                </li>

                            </ul>

                        </div>
                    </div>

                    <div class='category-break' v-if='(index + 1) < scorecards.length && scorecards[index].bad.length === 0 && scorecards[index + 1].bad.length > 0'></div>
                </span>
            </div>
        </div>
	</div>
</template>

<script>

import { vmdButton } from '@ccq/ccq-vue-components'
import { default as spinner } from 'vue-spinners/src/components/CubeSpinner'
import VueCircle from 'vue2-circle-progress'
import axios from 'axios'
import { default as Tips } from './tips.js'
import { default as Resources } from './resources.js'

export default {
    name: 'app',
    components: {
        vmdButton,
        VueCircle,
        spinner
    },
	data () {
		return {
            loading: true,
            results: {},
            expandedCategory: null,
            latestScorecard: null,
            tips: Tips,
            resources: Resources,
            icons: {
                uv: 'https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/uv-white.png',
                smoking: 'https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/smoking-white.png',
                alcohol: 'https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/alcohol-white.png',
                nutrition: 'https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/nutrition-white.png',
                weight: 'https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/weight-white.png',
                'physical activity': 'https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/physical-activity-white.png',
                screening: 'https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/screening-white.png'
            }
		}
    },
    computed: {
        scorecards() {
            let vm = this;

            if (!vm.latestScorecard) { return [] }

            let scorecards = [];

            Object.keys(vm.latestScorecard.scores).forEach((category) => {
                if (category !== 'total') {
                    let categoryObj = {
                        name: category
                    };

                    categoryObj.good = vm.latestScorecard.recommendations.filter((rec) => {
                        return rec.category === category && 
                        (rec.recommendation.includes('Well done') || 
                        rec.recommendation.includes('Great'))
                    })

                    categoryObj.bad = vm.latestScorecard.recommendations.filter((rec) => {
                        return rec.category === category && 
                        !(rec.recommendation.includes('Well done') || 
                        rec.recommendation.includes('Great'))
                    })
                    
                    if (vm.tips[category]) {
                        let tips = [];
                        
                        Object.keys(vm.tips[category]).forEach((key) => {
                            let badCategoryObj = categoryObj.bad.find((o) => o.id === key)

                            if (badCategoryObj && !(badCategoryObj.bmi && parseInt(badCategoryObj.bmi) < 20)) {
                                vm.tips[category][key].forEach((t) => tips.push(t))
                            }
                            
                        })

                        if (tips.length > 0) {
                            categoryObj.tips = tips;
                        } 
                    }
                    scorecards.push(categoryObj)
                }
            })

            return scorecards.sort((a, b) => a.bad.length - b.bad.length)
        }
    },
    methods: {
        filteredResources(category) {
            let vm = this;


            return vm.resources[category.name].filter(r => vm.showResource(r, category))
        },
        showResource(resource, category) {
            let vm = this;

            let matchingQuestionId = category.bad.map(q => q.id).includes(resource.questionId)
            let matchingGender = vm.latestScorecard.gender === resource.gender
            let conditionalDisplay = resource.hasOwnProperty('questionId') || resource.hasOwnProperty('gender')

            return !conditionalDisplay || matchingQuestionId || matchingGender
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
    margin-top: unset!important;
}
body {
    margin: 0;
    padding: 0;
    .m0 {
        margin: 0;
        padding: 0;
    }
}
#app {
    border-top: 3px solid $yellow;
	font-family: 'Foco CC', 'Roboto', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: $dark-blue;
    height:100vh;
    background: #eee;
}

.outer-container {
    background:#eee;
    padding: 60px 0;

    .spinner {
        margin-top:40vh!important;

        & > .cube1 {
            background-color: $yellow!important;
        }
        & > .cube2 {
            background-color: $blue!important;
        }
    }

}

.results-container {
    background:#fff;
    padding: 30px;
    border-radius: 8px;
    max-width: 960px;
    margin: 30px auto;
    height: auto;
    @extend %boxshadow;

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

    .category {
        background: #eee;
        color: #fff;
        margin: 15px;
        @extend %boxshadow;
        border-radius: 8px;
        text-align:left;
        transition: 0.3s;

        .category-heading {
            &:hover {
                background: $blue;
                cursor:pointer;
            
                & > h2 span.category-icons .fa-check-circle {
                    color:#fff;
                }
            }
            background: $dark-blue;
            transition: 0.3s ease;
            border-radius: 8px 8px 0 0;
            display:flex;
            justify-content:stretch;


            .img-container {
                width: 40px;
                text-align:center;
                display:inline-block;
                height: 40px;
                justify-content:center;
                align-items:center;
                margin-right: 15px;

                img {
                    margin-top: 2px;
                    height:36px;
                }
            }

            &>h2 {
                color:#fff;
                padding: 10px 30px;
                margin: 0;
                flex-basis: 300px;
                flex-grow: 1;
                display:flex;
                align-items:center;
                justify-content:space-between;

                &>span:not(.category-icons) {
                    display:flex;
                    align-items:center;
                    line-height: 20px;
                }
                span.category-icons {
                    float:right;
                    width: 60px;
                    display:flex;
                    pointer-events:none;
                    align-items:center;
                    justify-content:flex-end;

                    .blue-text {
                        color: $blue;
                    }

                    .yellow-text {
                        // color: $yellow;
                        color:$dark-blue;
                        background:$yellow;
                        width: 25px;
                        height:25px;
                        border-radius: 50%;
                        text-align:center;
                        line-height:25px;
                        font-size: 18px;
                        font-weight: 800;
                    }

                    .fa-check-circle {
                        // margin-right: 5px;
                        color: $blue;
                        transition: 0.3s ease;
                    }

                    .fa-exclamation-circle {
                        // margin: 0 5px 0 15px;
                        // color: $yellow;
                        // display:none;

                        // background: $yellow;
                        // color:#fff;
                        // width: 30px;
                        // height: 30px;
                        // line-height: 30px;
                        // text-align:center;
                        // border-radius: 50%;
                        // font-size: 24px;
                        color: $yellow;
                        // @extend %boxshadow;
                    }
                }
            }

            span.expand-tag {
                flex-basis: 40px;
                max-width: 40px;
                flex-shrink:1;
                // background:$blue;
                // background:inherit;
                padding: 5px 10px;
                color:#fff;
                font-size: 24px;
                border-radius: 0 8px 0 0;
                transition: 0.5s ease;
                text-align:center;
                display:flex;
                align-items:center;
                justify-content:center;

                &.yellow-expand {
                    background:$yellow;
                }

                &:hover {
                    opacity: 0.7;
                    cursor:pointer;
                }
            }
        }

        &>h2 {
            padding: 15px 30px;
            margin: 0;
            color:#fff;
        }

        p, li {
            margin: 0 0 4px 0;
            font-size: 16px!important;
        }

        .blue, .grey, .resources-container {
            transition: max-height 0.5s ease, opacity 0.5s ease;
            padding: 15px 30px;
            max-height: 3000px;

            .fa, .svg-inline--fa {
                font-size: 20px!important;
            }
        }

        .blue.contracted, .grey.contracted, .resources-container.contracted {
            transition: max-height 0.5s ease, opacity 0.5s ease;
            padding: 0;
            margin:0;
            opacity: 0;
            max-height: 0px;
            height:0;
            pointer-events:none;

            * {
                margin: 0;
                padding: 0;
                opacity: 0;
                max-height: 0;
            }

            ul, li {
                display:none!important;
            }
        }

        .blue > div,
        .grey > div {
            display:flex;
            flex-wrap:wrap;
            padding: 10px 15px 0 0;

            p {
                flex-basis: 200px;
                min-width: 200px;
                flex-grow: 1;
            }
        }

        .blue {
            background: $blue;
            color:#fff;

            h2 {
                color:#fff;
            }

            ul {
                display:flex;
                flex-wrap: wrap;
            
                li{
                    flex-basis: 380px;
                    flex-grow:1;
                    min-width: 380px;
                    margin: 5px 0;
                    display:flex;
                    .fa, .svg-inline--fa {
                        font-size: 20px;
                        color:#fff;
                        margin-right: 15px;
                    }

                    p {
                        margin: 0;
                    }
                }
            }

        }

        .grey {
            background:$yellow;
            color:$dark-blue;

            & > div {
                margin: 20px auto;
                border-top: 1px solid #dcdcdc;
            }

            ul.tips {
                margin-top: 10px;
                padding-inline-start:20px;
            }

            ul.improvements {
                list-style-type:none;
                display:flex;
                flex-wrap:wrap;

                li {
                    flex-basis: 380px;
                    flex-grow:1;
                    min-width: 380px;
                    margin: 5px 30px 5px 0;
                    display:flex;

                    .fa, .svg-inline--fa {
                        // color:$yellow;
                        margin-right: 15px;
                        font-size: 24px;
                    }
                }
            }

            a {
                text-decoration:none;
                color:$blue;
                font-weight:bold;
            }

        }
        .resources-container {
            background:#eee;
            color:$dark-blue;
            padding: 15px 30px 30px 30px;

            .resources {
                display:flex;
                list-style-type:none;
                padding-inline-start:0;
                margin-block-start:0;
                flex-wrap:wrap;

                li {
                    background:white;
                    @extend %boxshadow;
                    margin:10px;
                    padding:0;
                    min-width:320px;
                    flex-basis: 320px;
                    flex-grow:1;
                    display:flex;
                    max-width: 350px;

                    a.img-link {
                        padding:0;
                        margin:0;
                        height:100%;
                        flex-basis:45%;
                        flex-grow:1;
                        background-size:contain;

                        &.download {
                            background-repeat:no-repeat;
                            background-color: $blue;
                            background-position: center;
                        }

                        &.fullwidth {
                            flex-basis: 100%;
                            width: 100%;
                        }
                    }
                    div {
                        padding: 30px;
                        flex-basis:45%;
                        flex-grow:1;
                        display:flex;
                        flex-direction:column;

                        a {
                            text-align:center;
                            background:$blue;
                            color:#fff;
                            text-decoration:none;
                            transition:0.3s ease;
                            padding: 8px 20px;
                            border-radius: 4px;
                            margin-top: 10px;
                            @extend %boxshadow;

                            &:hover {
                                filter: brightness(0.8);
                            }
                        }
                    }
                    display:flex;
                    align-items:center;
                }
            }
        }
    }
}

@media screen and (max-width: 600px) {
    #app .outer-container .results-container {
        padding: 15px;

        div > h2 {
            margin-top: 0;
        }

        .category {
            // margin: 15px;
            &.break::after {
                width: calc(100% - 30px);
            }

            .category-heading > h2 {
                font-size: 20px;
                padding: 5px 10px;

                span.img-container > img {
                    height: 30px;
                    margin-top: 4px;
                }

                .category-icons {
                    span.yellow-text {
                        display:none;
                    }
                    i.fa-exclamation-circle {
                        display:inline-block;
                    }
                }
            }
            .resources-container .resources li {
                flex-wrap:wrap;
                    a.img-link {
                        height:150px;
                    }
            }
        }
    }
}

@media screen and (max-width: 800px) {
    #app {
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
            padding-bottom: 0;

            .results-container {
                // width: calc(100vw - 60px);
                margin:0;
                border-radius:0;
                box-shadow: none;
                border:none;

                h1 {
                    font-size: 32px;
                    margin: 15px 0 0 0;
                }
                
                .category {
                    margin: 15px 0;

                    .category-heading {
                        font-size: 16px;

                        & > h2 {
                            font-size: 16px;
                            padding: 5px 0 5px 10px;

                            span.img-container {
                                margin-right: 10px;
                            }
                        }

                        span.category-icons {
                            // display:none;
                            min-width: 30px;
                            width: 30px;
                            align-items:center;

                            .numbered-exclamation {
                                height: 16px;
                                font-size: 16px;
                            }
                        }
                    }
                    .grey, .blue, .resources-container {
                        ul {
                            padding-inline-start:0;

                            li {
                                i {
                                    display:none;
                                }
                                min-width:unset;
                            }
                        } 
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

</style>