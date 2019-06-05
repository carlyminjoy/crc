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
                    <h3>Great news, there are plenty of options to decrease your cancer risk.</h3>
                </div>

                <div class="category" v-for="(category, index) in scorecards" :key="index">
                    <h2>{{ category[0].category.toUpperCase() }}</h2>

                    <div class="blue" v-if="category.filter((c) => c.recommendation.includes('Well done')).length > 0">
                        <h3>You're doing great in the following areas:</h3>
                        <div v-for="(section, i) in category.filter((c) => c.recommendation.includes('Well done'))" :key="i">
                            <p>You told us: <em>{{ section.answer }}</em></p>
                            <p><strong>{{ section.recommendation }}</strong></p>
                        </div>

                    </div>

                    <div class="grey" v-if="category.filter((c) => !c.recommendation.includes('Well done')).length > 0">
                        <h3>Recommendations for improvement:</h3>
                        <div v-for="(section, i) in category.filter((c) => !c.recommendation.includes('Well done'))" :key="i">
                            <p>You told us: <em>{{ section.answer }}</em></p>
                            <p><strong>{{ section.recommendation }}</strong></p>
                        </div>
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
            latestScorecard: null
		}
    },
    computed: {
        scorecards() {
            let vm = this;

            if (!vm.latestScorecard) { return [] }

            let scorecards = [];

            Object.keys(vm.latestScorecard.scores).forEach((category) => {
                if (category !== 'total') {
                    category = vm.latestScorecard.recommendations.filter((rec) => rec.category === category)
                    scorecards.push(category)
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
        margin-bottom: 30px;
        @extend %boxshadow;
        border-radius: 8px;
        text-align:left;

        h2 {
            padding: 30px 0 20px 30px;
            margin: 0;
        }

        p {
            margin: 0;
        }

        .blue {
            padding: 15px 30px;
            background: $blue;
            color:#fff;

            div {
                margin: 10px auto;
            }
        }

        .grey {
            padding: 15px 30px;
            background:#eee;
            color:$dark-blue;

            div {
                margin: 10px auto;
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