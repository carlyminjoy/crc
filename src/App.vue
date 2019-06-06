<template>
	<div id="app">
        <header>
            <div class='container'>
                <img src="https://cancerqld.blob.core.windows.net/content/code/global/img/ccq-logo-249x123.png" />
                <h1>Cancer Risk Score Card</h1>
            </div>
        </header>

        <div class="outer-container">

            <div class="results-container" v-if="latestScorecard">
                <h3>{{latestScorecard.firstName }}, your total score is: </h3>

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

                <div>
                    <h3>Good news, there are plenty of ways to increase your score and reduce your cancer risk.</h3>
                </div>

                <div class="category" v-for="(category, index) in scorecards" :key="index">
                    <h2>{{ category.name.toUpperCase() }}</h2>

                    <div class="blue" v-if="category.good.length > 0">
                        <h2>You're doing great in the following areas:</h2>
                        <div v-for="(section, i) in category.good" :key="i">
                            <p><strong>You told us: </strong>{{ section.answer }}</p>
                            <p><strong>{{ section.recommendation }}</strong></p>
                        </div>

                    </div>

                    <div class="grey" v-if="category.bad.length > 0">
                        <h2>You can improve in the following areas:</h2>
                        <div v-for="(section, i) in category.bad" :key="i">
                            <p><strong>You told us: </strong>{{ section.answer }}</p>
                            <p><strong>We recommend: </strong>{{ section.recommendation }}</p>
                        </div>


                        <template v-if="tips[category.name]">
                            <h2>Tips:</h2>
                            <ul class="tips">
                                <li v-for="(tip,index) in tips[category.name]" :key="index">{{ tip }}</li>
                            </ul>
                        </template>

                    </div>

                    <div class='resources-container' v-if="resources[category.name]">
                        <ul class="resources">
                            <li v-for="(resource, index) in resources[category.name]" :key='index'>
                                <a class='img-link' :href='resource.url' target='_blank' v-bind:style="{ backgroundImage: 'url(' + resource.img + ')' }"></a>
                                <div>
                                    <p>{{ resource.text }}</p>
                                    <br>
                                    <a :href='resource.url' target='_blank'>{{ resource.cta }}</a>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>

            </div>
        </div>
	</div>
</template>

<script>
import { vmdButton } from '@ccq/ccq-vue-components'
import VueCircle from 'vue2-circle-progress'
import axios from 'axios'

export default {
    name: 'app',
    components: {
        vmdButton,
        VueCircle
    },
	data () {
		return {
            results: {},
            latestScorecard: null,
            tips: {
                smoking: {
                    status: [
                        'Call Quitline on 13 QUIT (13 7858).',
                        'Set a quit date and seek support from family and friends.',
                        'Speak your GP, pharmacist or community health worker and plan your quitting strategy.',
                        'Avoid situations where you’re tempted to smoke.'
                    ]
                },
                alcohol: {
                    standardDrinks: [
                        'Use the standard drink calculator to find how much you’re drinking.',
                        'Commit to having some alcohol-free days each week.',
                        'Choose low alcohol or non-alcoholic drinks.'
                    ]
                }
            },
            resources: {
                nutrition: [
                    {
                        url: 'https://www.biggestmorningtea.com.au/ideas/recipes/',
                        img: 'https://www.biggestmorningtea.com.au/siteassets/biggest-morning-tea/ideas-and-planning/recipes/fruitskew_thumb.png',
                        text: `For healthy recipe ideas, visit Australia's Biggest Morning Tea recipes.`,
                        cta: 'Visit Website'
                    }
                ]
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

                    categoryObj.good = vm.latestScorecard.recommendations.filter((rec) => rec.category === category && rec.recommendation.includes('Well done'))
                    categoryObj.bad = vm.latestScorecard.recommendations.filter((rec) => rec.category === category && !rec.recommendation.includes('Well done'))
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
                    this.latestScorecard = response.data.scorecards[0].entry
                })
        }
    },
    mounted () {
        let vm = this;

        let user = vm.$route.query.user;
        console.log(vm.$route.query)
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

    header {
        height:80px;
        background: #fff;
        // border-bottom: 3px solid #FCD208;

        .container {
            height:100%;
            max-width: 660px;
            margin: 0 auto;
            img {
                float:left;
                height: 50px;
                margin-top: 15px;
            }
            h1 {
                color: $dark-blue;
                font-family:'Foco CC', 'Roboto', Arial, sans-serif;
                margin: 0 104px 0 0;
                letter-spacing: 0;
                line-height: 90px;
            }
        }

    }

}

.outer-container {
    background:#eee;
}

.results-container {
    background:#fff;
    padding: 15px 30px;
    border-radius: 8px;
    max-width: 600px;
    margin: 50px auto;
    height: auto;
    @extend %boxshadow;

    .circle {
        margin: 30px auto;
    }

    .category {
        background: #eee;
        background: $dark-blue;
        color: #fff;
        margin-bottom: 40px;
        @extend %boxshadow;
        border-radius: 8px;
        text-align:left;

        &>h2 {
            padding: 30px 0 20px 30px;
            margin: 0;
        }

        p {
            margin: 0 0 4px 0;
            font-size: 16px;
        }

        .blue {
            padding: 15px 30px;
            background: $blue;
            color:#fff;

            div {
                margin: 20px 0;
            }
        }

        .grey {
            padding: 15px 30px;
            background:#eee;
            color:$dark-blue;

            & > div {
                margin: 20px auto;
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

                li {
                    background:white;
                    @extend %boxshadow;
                    margin:0;
                    padding:0;
                    max-width:100%;
                    display:flex;

                    a.img-link {
                        padding:0;
                        margin:0;
                        height:100%;
                        flex-basis:50%;
                        flex-grow:1;
                        background-size:cover;
                    }
                    div {
                        padding: 30px;
                        flex-basis:50%;
                        flex-grow:1;

                        a {
                            background:$blue;
                            color:#fff;
                            text-decoration:none;
                            transition:0.3s ease;
                            width: 100%;
                            padding: 12px 20px 7px 20px;
                            border-radius: 4px;
                            margin-top: 30px;
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

@media screen and (max-width: 800px) {
    #app {
        header {
            height: 60px;
            .container {
                display:flex;
                align-items:center;
                h1 {
                    padding-top: 5px;
                    font-size: 24px;
                    margin: unset;
                    font-weight:bold;
                }

                img {
                    height: 40px;
                    float:unset;
                    margin: 0 20px 0 5px;
                }
                
            }
        }
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