<template>
	<div id="app">
        <!-- <header>
            <div class='container'>
                <img src="https://cancerqld.blob.core.windows.net/content/code/global/img/ccq-logo-249x123.png" />
                <h3>Cancer Risk Score Card</h3>
            </div>
        </header> -->

        <div class="outer-container">

            <template v-if='!latestScorecard'>
                <div>
                    <square-spinner color='#FCD208' ></square-spinner>
                </div>
            </template>

            <div class="results-container" v-else>
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
                        <h2>Excellent!</h2><br>
                        <h3>You are making great choices to help reduce your cancer risk.</h3>
                    </template> 
                    <template v-if='latestScorecard.scores.total >= 75'>
                        <h2>You're doing well</h2>
                        <h3>You are making good choices to help reduce your cancer risk, but there are still further steps you can take.</h3>
                    </template> 
                    <template v-else-if='latestScorecard.scores.total >= 50'>
                        <h2>On the right track</h2>
                        <h3>You are making some good choices to help reduce your cancer risk, but there are many more steps you can take.</h3>
                    </template> 
                    <template v-else>
                        <h2>Room for improvement</h2>
                        <h3>Good news - there are plenty of ways to reduce your cancer risk.</h3>
                    </template> 
                    <br>
                </div>

                <div class="category" v-for="(category, index) in scorecards" :key="index">
                    <div class='category-heading'>
                        <h2>
                            <span>
                            <span class='img-container'><img :src='icons[category.name]' /></span>
                            &nbsp; {{ category.name.toUpperCase() }}</span>
                            <!-- <div class='expand'>&nbsp; <i class='fa fa-chevron-down'></i></div> -->

                            <span class='category-icons'>
                                <i class='fa fa-check'></i>{{ category.good.length }}&nbsp;
                                <i class='fa fa-exclamation'></i>{{ category.bad.length }}
                            </span>
                        </h2>

                        <span class='expand-tag' 
                            @click='expandedCategory = expandedCategory === category.name ? null : category.name'>
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
                                    <span v-if='section.bmi'><strong><br>Your BMI is: {{ section.bmi }}.<br>
                                    The recommended range is between 18.5 and 25.</strong>
                                    </span>
                                </p>
                                
                                <!-- <p>{{ section.recommendation }}</p> -->
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
                                        <span v-if='section.bmi'>Your BMI is: {{ section.bmi }}.<br></span>
                                        <span v-if='section.bmi'>The range for a healthy weight is between 18.5 and 25.<br></span>
                                        <span v-html='section.recommendation'>
                                    </strong>
                                </p>
                            </li>
                        </ul>

                            <!-- <p><strong>You told us: </strong>{{ section.answer }}</p>
                            <p v-if='section.bmi'><strong>Your BMI is: </strong>{{ section.bmi }}</p>
                            <p><strong>We recommend: </strong>

                            <span v-if='section.bmi'>The range for a healthy weight is between 18.5 and 25.</span>
                            <span v-html='section.recommendation'></span>

                            </p>
                        </div> -->


                        <template v-if="tips[category.name]">
                            <h2 class="m0">Tips:</h2>
                            <ul class="tips">
                                <li v-for="(tip,index) in category.tips" :key="index" v-html='tip'></li>
                            </ul>
                        </template>

                    </div>

                    <div class='resources-container' :class="{'contracted' : expandedCategory !== category.name}" v-if="resources[category.name]">
                        <h2>Resources and links:</h2>
                        <ul class="resources">
                            <li v-for="(resource, index) in resources[category.name]" :key='index'>
                                <a class='img-link' :class="{ 'download' : resource.download, 'fullwidth' : resource.fullwidth }" :href='resource.url' target='_blank' v-bind:style="{ backgroundImage: 'url(' + resource.img + ')' }"></a>
                                <div>
                                    <p>{{ resource.text }}</p>
                                    <a :href='resource.url' target='_blank'>{{ resource.cta }}</a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- <span v-show='expandedCategory !== category.name' class='expand-tag' @click='expandedCategory = expandedCategory === category.name ? null : category.name'><i class='fa fa-chevron-down'></i></span> -->
                </div>

            </div>

        </div>
	</div>
</template>

<script>

import { vmdButton } from '@ccq/ccq-vue-components'
import VueCircle from 'vue2-circle-progress'
import axios from 'axios'
import { SquareSpinner } from 'vue-spinners/src/components/SquareSpinner.vue'

export default {
    name: 'app',
    components: {
        vmdButton,
        VueCircle,
        SquareSpinner
    },
	data () {
		return {
            results: {},
            expandedCategory: null,
            latestScorecard: null,
            tips: {
                smoking: {
                    smokingStatus: [
                        'Call Quitline on 13 QUIT (13 7858).',
                        'Set a quit date and seek support from family and friends.',
                        'Speak your GP, pharmacist or community health worker and plan your quitting strategy.',
                        'Avoid situations where you’re tempted to smoke.'
                    ],
                    householdSmoke: [
                        'Encourage those who smoke to quit by speaking with their GP or calling Quitline on 13 7848.',
                        'Make your house and car smoke-free environments.',
                        'Follow the <a href="https://quithq.initiatives.qld.gov.au/quit-support/help-others-quit/dos-and-donts/" target="_blank">dos and don’ts</a> of helping others to quit.'
                    ]
                },
                alcohol: {
                    standardDrinks: [
                        `Use the <a href='https://drinkwise.org.au/standard-drinks-calculator/#' target='_blank'>standard drink calculator</a> to find out how much you’re drinking.`,
                        'Commit to having some alcohol-free days each week.',
                        'Choose low alcohol or non-alcoholic drinks.'
                    ]
                },
                nutrition: {
                    fruit: [
                        'Try adding fruit to your favourite breakfast cereal or make fruit a go-to snack when you’re on the go.'
                    ],
                    vegetables: [
                        'Try raw vegie sticks and dip as a quick snack, or reduce the meat and increase the vegetables on your pizza, curry and stir fry.'
                    ],
                    redMeat: [
                        'Choose fish, poultry or legumes instead of red meat for some meals.'
                    ],
                    processedMeat: [
                        'Swap the pepperoni in your sandwich for egg, tuna or chicken for protein boost.'
                    ],
                    wholegrain: [
                        'Choose brown rice instead of white, swap white for wholemeal pasta and bread varieties and avoid processed breakfast cereals.'
                    ]
                },
                weight: {
                    bmi: [
                        'Eat a healthy diet full of fruit, vegetables, and wholegrains.',
                        'Try to be active for at least 30 minutes every day.',
                        'Limit consumption of junk foods and sugary drinks. ',
                        'Speak with your GP or visit <a href="https://www.gethealthyqld.com.au/" target="_blank">get healthy</a> for free personal health coaching.'
                    ],
                    waist: [
                        'Eat a healthy diet full of fruit, vegetables, and wholegrains.',
                        'Try to be active for at least 30 minutes every day.',
                        'Limit consumption of junk foods and sugary drinks.',
                        'Speak with your GP or visit <a href="https://www.gethealthyqld.com.au/" target="_blank">get healthy</a> for free personal health coaching.'
                    ]
                },
                "physical activity": {
                    exercise: [
                        'Walk or cycle to work or get off public transport one stop early and walk the rest.',
                        'Do something you enjoy or can do with a friend, such as tennis, swimming or dancing.',
                        'Set yourself an exercise goal or challenge.'
                    ]
                },
                screening: {
                    breastScreening: [
                        'Speak to your health professional about breast cancer screening.', 
                        'To book a free mammogram, contact 13 20 50.',
                        `If you have moved interstate or haven’t received an invitation, <a href='http://www.cancerscreening.gov.au/internet/screening/publishing.nsf/Content/useful-links-2' target='_blank'>contact your local BreastScreen Australia provider</a>.`
                    ],
                    bowelScreening: [
                        'Speak to your health professional about bowel cancer screening.', 
                        `If you have moved interstate or haven’t received an invitation, you can <a href='http://www.cancerscreening.gov.au/internet/screening/publishing.nsf/Content/bowel-cancer-screeningkit-eligibility' target='_blank'>check your eligibility for receiving the national bowel cancer screening kit</a>.`,
                        `Contact the <a href='http://www.cancerscreening.gov.au/internet/screening/publishing.nsf/Content/Contact' target='_blank'>National Bowel Cancer Screening Program</a>.`
                    ],
                    cervicalScreening: [
                        'Speak to your health professional about the national cervical cancer screening program.', 
                        `Visit cancer Council's <a href='https://www.cancer.org.au/cervicalscreening/' target='_blank'>cervical screening website</a> for more information or;`,
                        `Contact the <a href='http://www.cancerscreening.gov.au/internet/screening/publishing.nsf/Content/cervical-screening-1' target='_blank'>National Cervical Screening Program</a>.`
                    ]
                }
            },
            resources: {
                uv: [
                    {
                        url: 'https://cancerqld.blob.core.windows.net/resources/quest/Spot%20the%20difference_FACTSHEET.pdf',
                        img: 'https://cancerqld.blob.core.windows.net/content/landing-pages/menshealthweek/img/resource-sunsafety-02.png',
                        text: `Spot the Difference Factsheet.`,
                        cta: `Download`,
                        download: true
                    },
                    {
                        url: 'https://cancerqld.blob.core.windows.net/resources/quest/skin%20cancer%20outdoor%20work.pdf',
                        img: 'https://cancerqld.blob.core.windows.net/content/landing-pages/menshealthweek/img/resource-sunsafety-01.png',
                        text: `Skin Cancer Outdoor Work`,
                        cta: `Download`,
                        download: true
                    }
                ],
                nutrition: [
                    {
                        url: 'https://cancerqld.blob.core.windows.net/resources/quest/Healthy%20BBQ_FACTSHEET.pdf',
                        img: 'https://cancerqld.blob.core.windows.net/content/landing-pages/menshealthweek/img/resource-eat-01.png',
                        text: `Healthy BBQ Factsheet`,
                        cta: 'Download',
                        download: true
                    },
                    {
                        url: 'https://cancerqld.blob.core.windows.net/content/landing-pages/menshealthweek/resources/18029%20A4%20Men%20Comparethepair_FA.PDF',
                        img: 'https://cancerqld.blob.core.windows.net/content/landing-pages/menshealthweek/img/resource-eat-02.png',
                        text: `Compare the Pair`,
                        cta: 'Download',
                        download: true
                    },
                    {
                        url: 'https://cancerqld.blob.core.windows.net/content/landing-pages/menshealthweek/resources/Red%20meat%20-%20processed%20meat%20and%20cancer%20-%20your%20questions%20answered.pdf',
                        img: 'https://cancerqld.blob.core.windows.net/content/landing-pages/menshealthweek/img/resource-eat-03.png',
                        text: `Red Meat, Processed Meat and Cancer`,
                        cta: 'Download',
                        download: true
                    },
                    
                ],
                smoking: [
                    {
                        url: 'https://cancerqld.blob.core.windows.net/resources/quest/Harms%20of%20smoking_FACTSHEET.pdf',
                        img: 'https://cancerqld.blob.core.windows.net/content/landing-pages/menshealthweek/img/resource-smoking-02.png',
                        text: `Harms of Smoking Factsheet`,
                        cta: 'Download',
                        download: true
                    },
                    {
                        url: 'https://cancerqld.blob.core.windows.net/resources/quest/Benefits%20of%20quitting%20smoking_FACTSHEET.pdf',
                        img: 'https://cancerqld.blob.core.windows.net/content/landing-pages/menshealthweek/img/resource-smoking-01.png',
                        text: `Benefits of Quitting Smoking Factsheet`,
                        cta: 'Download',
                        download: true
                    }
                ],
                alcohol: [
                    {
                        url: 'https://cancerqld.blob.core.windows.net/resources/quest/Alcohol%20and%20cancer_FACTSHEET.pdf',
                        img: 'https://cancerqld.blob.core.windows.net/content/landing-pages/menshealthweek/img/resource-alcohol-01.png',
                        text: `Alcohol and Cancer Factsheet`,
                        cta: 'Download',
                        download: true
                    },
                    {
                        url: 'https://cancerqld.blob.core.windows.net/resources/quest/Food%20swaps_FACTSHEET.pdf',
                        img: 'https://cancerqld.blob.core.windows.net/content/landing-pages/menshealthweek/img/resource-alcohol-02.png',
                        text: `Food Swaps Factsheet`,
                        cta: 'Download',
                        download: true
                    }
                ],
                'physical activity': [
                    {
                        url: 'https://cancerqld.blob.core.windows.net/resources/quest/Take%20time%20to%20be%20active_FACTSHEET.pdf',
                        img: 'https://cancerqld.blob.core.windows.net/content/landing-pages/menshealthweek/img/resource-active-01.png',
                        text: `Take Time to be Active Factsheet`,
                        cta: 'Download',
                        download: true
                    }
                ]
            },
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

                    categoryObj.good = vm.latestScorecard.recommendations.filter((rec) => rec.category === category && (rec.recommendation.includes('Well done') || rec.recommendation.includes('Great')))
                    categoryObj.bad = vm.latestScorecard.recommendations.filter((rec) => rec.category === category && !(rec.recommendation.includes('Well done') || rec.recommendation.includes('Great')))
                    
                    if (vm.tips[category]) {
                        let tips = [];
                        
                        Object.keys(vm.tips[category]).forEach((key) => {
                            if (categoryObj.bad.some((o) => o.id === key)) {
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

            return scorecards
        }
    },
    methods: {
        getScoreCard(user) {
            let vm = this;

            axios
                .post('https://prod-05.australiaeast.logic.azure.com:443/workflows/df753e6a563e451ea76a06b71d1a4a9e/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=pge8rl1wK4YG2jeyFkb3gl38yu97YZAyBzp6Dd6vAxA', {user: user})
                .then(response => {
                    this.results = response.data

                    response.data.scorecards.forEach((card) => {
                        if (card.entry && !vm.latestScorecard) {
                            vm.latestScorecard = card.entry;
                            return;
                        }
                    })
                })

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
	font-family: Roboto, Helvetica, Arial, sans-serif;
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
        margin-top:40vh!important
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

    .circle {
        margin: 30px auto 0 auto;
    }

    &>div>h3 {
        max-width: 600px;
        margin: 20px auto 0 auto;
        font-weight: 400;
    }

    .category {
        background: #eee;
        color: #fff;
        margin: 30px;
        @extend %boxshadow;
        border-radius: 8px;
        text-align:left;


        .category-heading {
            background: $dark-blue;
            transition: 0.3s ease;
            border-radius: 8px 8px 0 0;
            display:flex;
            justify-content:stretch;

            .img-container {
                width: 40px;
                text-align:center;
                display:inline-block;
                // border-radius: 50%;
                height: 40px;
                justify-content:center;
                align-items:center;
                // background:#fff;

                img {
                    margin-top: 2px;
                    height:36px;
                }
            }

            // cursor:pointer;

            
            // div.expand {
            //     display:inline-block;
            //     // color:$blue;
            //     height: 100%;
            //     width: 40px;
            //     text-align:right;
                
            // }

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
                }
                span.category-icons {
                    float:right;
                    width: 100px;
                    display:flex;
                    pointer-events:none;
                    justify-content:space-between;

                    .fa-check {
                        color: $blue;
                    }

                    .fa-exclamation {
                        color: $yellow;
                    }
                }
            }

            span.expand-tag {
                flex-basis: 40px;
                max-width: 40px;
                flex-shrink:1;
                background:$blue;
                padding: 5px 10px;
                color:#fff;
                font-size: 24px;
                border-radius: 0 8px 0 0;
                transition: 0.5s ease;
                text-align:center;
                display:flex;
                align-items:center;
                justify-content:center;

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
            max-height: 800px;

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
                    max-width: 400px;

                    a.img-link {
                        padding:0;
                        margin:0;
                        height:100%;
                        flex-basis:45%;
                        flex-grow:1;
                        background-size:cover;

                        &.download {
                            background-size: auto;
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
    #app .outer-container .results-container .category .resources-container .resources li {
        flex-wrap:wrap;
            a.img-link {
                height:150px;
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
            padding-bottom: 0;
            .results-container {
                width: unset;
                margin:0;
                border-radius:0;
                
                .category {
                    margin: 30px 0;
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