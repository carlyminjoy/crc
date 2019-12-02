<template>
	<div id="app">
		<BackgroundBlob v-if="!state.isIe"></BackgroundBlob>

		<div class="outer-container">
			<div class="header-container">
				<a href="https://cancerqld.org.au" target="_blank">
					<div class="cancer-council-logo">
						<img
							src="https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/cancer_council.png"
						/>
					</div>
				</a>
				<HeaderBlob></HeaderBlob>
				<h1 class="heading">
					Cancer Risk Calculator<span class="yellow-fullstop">.</span>
				</h1>
			</div>

            <div class='spinner-container' v-if="loading">
                <h3>Retrieving scores ... </h3>
			    <spinner color="#fcd208"></spinner>
            </div>

			<h3 v-else-if="!loading && !latestScorecard">
				Sorry, your Cancer Risk Scorecard could not be retrieved at this
				time.
				<br />
				Please check the link and try again.
			</h3>

			<div class="results-container" v-else-if="latestScorecard">
				<div class="overview">
					<h1 class="total-score">
                        <strong>Hi {{ latestScorecard.firstName }},

                        <span
                            v-if="
                                parseInt(latestScorecard.scores.total) ===
                                    100"
                        >
                            well done!
                        </span>

                        <span
                            v-else-if="
                                parseInt(latestScorecard.scores.total) >= 75"
                        >
                            you're doing well.
                        </span>

                        <span
                            v-else-if="
                                parseInt(latestScorecard.scores.total) >= 50"
                        >
                            you're on the right track.</span
                        >

                        <span v-else
                            >there's room for improvement.
                        </span></strong>

						<br />Your total score is:
					</h1>

					<div class="score-container">
						<div class="line"></div>

						<transition name="score">
							<div
								v-if="showScore"
								class="score-number-container"
							>
								<span class="score-number">{{
									latestScorecard.scores.total
								}}</span>
							</div>
						</transition>

						<vue-circle
							:progress="latestScorecard.scores.total"
							:size="150"
							:reverse="false"
							line-cap="butt"
							:fill="{
								gradient: ['#43A047', '#FCD208'],
								gradientDirection: [30, 140, 140, 60]
							}"
							empty-fill="#eee"
							:animation-start-value="0.0"
							:start-angle="-(Math.PI / 2)"
							insert-mode="append"
							:thickness="10"
							:show-percent="false"
						>
						</vue-circle>

						<div class="line"></div>
					</div>

					<p class="score-date">
						Based on your answers from {{ date }}
					</p>

					<div v-if="previousScorecard && improvedCategories.length > 0" class='improvements'>
                        <h3>
                            In the last <strong>{{ dateDiff }} days</strong>, 
                            your score has improved in:
                        </h3>

                        <h2>
                            {{ improvedCategories.join(', ') }}
                        </h2>

                        <h3>Keep up the good work!</h3>
                    </div>

					<h3 class='explanation' v-if='!previousScorecard'>
						This score is out of 100 and calculates how much you are
						reducing your cancer risk through healthy lifestyle
						behaviours. The higher your score, the more ways you are
						currently reducing your cancer risk. <br /><br /><strong
							>Aim for 100 to improve your health!</strong
						>
					</h3>
				</div>

				<div v-if='!previousScorecard' class="guide-download">
					<div class="img-container">
						<img
							src="https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/guide-resource-cropped.png"
						/>
					</div>
					<div class="content">
						<p>
							Our cut your cancer risk guide contains a broad
							overview on how you can reduce your cancer risk.
						</p>
						<download
							link="https://cancerqld.blob.core.windows.net/resources/quest/Cut%20your%20cancer%20risk_DL_v09%20(002).pdf"
							>Download</download
						>
					</div>
				</div>

				<span v-for="(category, index) in scorecards" :key="index">
					<category
						:category="category"
						:index="index"
						:gender="latestScorecard.gender"
                        :improvement='latestScorecard.scores[category.name] > previousScorecard.scores[category.name]'
                        :decline='latestScorecard.scores[category.name] < previousScorecard.scores[category.name]'
					></category>

					<div
						class="category-break"
						v-if="index + 1 < scorecards.length &&
								scorecards[index].bad.length === 0 &&
								scorecards[index + 1].bad.length > 0"
					></div>
				</span>

                <h3 class='explanation' v-if='previousScorecard'>
                    <br><br>
                    This score is out of 100 and calculates how much you are
                    reducing your cancer risk through healthy lifestyle
                    behaviours. The higher your score, the more ways you are
                    currently reducing your cancer risk. <br /><br /><strong
                        >Aim for 100 to improve your health!</strong
                    >
                    <br><br>
                </h3>

                <div v-if='previousScorecard' class="guide-download">
					<div class="img-container">
						<img
							src="https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/guide-resource-cropped.png"
						/>
					</div>
					<div class="content">
						<p>
							Our cut your cancer risk guide contains a broad
							overview on how you can reduce your cancer risk.
						</p>
						<download
							link="https://cancerqld.blob.core.windows.net/resources/quest/Cut%20your%20cancer%20risk_DL_v09%20(002).pdf"
							>Download</download
						>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	Spinner,
	Category,
	HeaderBlob,
	BackgroundBlob,
	Download
} from './components';
import VueCircle from 'vue2-circle-progress';
import axios from 'axios';
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
	data() {
		return {
			loading: true,
			results: {},
			latestScorecard: null,
			previousScorecard: null,
            showScore: false,
			state: {
				isIe: false,
				isMozilla: false
			}
		};
	},
	computed: {
		date() {
			return this.latestScorecard
				? moment.unix(this.latestScorecard._ts).format('MMMM Do YYYY')
				: null;
        },
        dateDiff() {
            if (!this.latestScorecard || !this.previousScorecard) {
                return null;
            }
            let ls = moment.unix(this.latestScorecard._ts);
            let ps = moment.unix(this.previousScorecard._ts);
            return parseInt(moment.duration(ls.diff(ps)).as('days'))
        },
        improvedCategories() {
            let vm = this;

            let improvedCategories = [];

            Object.keys(vm.latestScorecard.scores).forEach(cat => {
                if (cat !== 'total' 
                        && vm.previousScorecard.scores[cat] != undefined
                        && vm.latestScorecard.scores[cat] > vm.previousScorecard.scores[cat]) {
                    improvedCategories.push(cat)
                }
            })

            if (improvedCategories.length > 0) {
                improvedCategories[improvedCategories.length - 1] = ' & ' + improvedCategories[improvedCategories.length - 1]
            }

            return improvedCategories
        },
		scorecards() {
			let vm = this;

			if (!vm.latestScorecard) {
				return [];
			}
			let scorecards = [];

			Object.keys(vm.latestScorecard.scores).forEach(category => {
				if (category !== 'total') {
					scorecards.push(vm.getCategoryObj(category));
				}
			});

			return scorecards.sort((a, b) => a.bad.length - b.bad.length);
		}
	},
	methods: {
		getCategoryObj(category) {
			let vm = this;

			let categoryObj = {
				name: category
			};

			categoryObj.good = vm.latestScorecard.recommendations.filter(
				rec => rec.category === category && rec.score == 100
            ).map(question => {
                let prevScore = vm.previousScorecard.recommendations.find(r => r.id == question.id).score;
                question.improvement = question.score > prevScore
                question.decline = question.score < prevScore
                return question
            })
			categoryObj.bad = vm.latestScorecard.recommendations.filter(
				rec => rec.category === category && rec.score != 100
			).map(q => {
                let prevScore = vm.previousScorecard.recommendations.find(r => r.id == q.id).score;
                q.improvement = q.score > prevScore
                q.decline = q.score < prevScore
                return q
            })

            console.log('categoryObj', categoryObj)

			return categoryObj;
		},
		getScoreCard(user) {
			let vm = this;

			axios
				.post(
					'https://prod-05.australiaeast.logic.azure.com:443/workflows/df753e6a563e451ea76a06b71d1a4a9e/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=pge8rl1wK4YG2jeyFkb3gl38yu97YZAyBzp6Dd6vAxA',
					{ user: user }
				)
				.then(response => {
					vm.results = response.data.scorecards.sort(
						(a, b) => b._ts - a._ts
                    ).map(sc => {
                        sc.entry._ts = sc._ts
                        return sc
                    });

                    vm.latestScorecard = vm.results[0].entry;
                    if (vm.results.length > 1) {
                        vm.previousScorecard = vm.results[1].entry;
                    }

                    setTimeout(() => (vm.showScore = true), 500);
				})
				.finally(() => (vm.loading = false));
		}
	},
	mounted() {
		let vm = this;

		var ua = window.navigator.userAgent;
		vm.state.isIe = /MSIE|Trident/.test(ua);
		vm.state.isMozilla = ua.includes('Firefox');

		let user = vm.$route.query.user;
		vm.getScoreCard(user);
	}
};
</script>

<style lang="scss">
@font-face {
	font-family: Foco CC;
	src: url('https://cancerqld.blob.core.windows.net/content/landing-pages/taxappeal/fonts/FocoCC_W_Rg.e56f62bc.woff')
		format('woff');
}

@font-face {
	font-family: Foco CC Black;
	src: url('https://cancerqld.blob.core.windows.net/content/landing-pages/taxappeal/fonts/FocoCC_W_Blk.fe3819a9.woff')
		format('woff');
}

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
	height: 100vh;
	background: #eee;

    div.improvements {
        background: #E2EAEE;
        box-sizing:border-box;
        padding: 30px;
        margin: 30px auto;
        max-width: 600px;
        h2 {
            text-transform: capitalize;
            font-family: 'Foco CC Black';
        }
    }

    h3.explanation {
        max-width: 600px;
    }

	.outer-container {
		background: #eee;
		padding: 10px 0;

		.header-container {
			display: flex;
			flex-direction: row;
			width: 100%;
			max-width: 1020px;
			margin: 0 auto;
			position: relative;

			h1.heading {
				max-width: 200px;
				text-align: left;
				line-height: 1.8rem;
				font-family: 'Foco CC Black';

				.yellow-fullstop {
					font-size: 40px;
					color: $yellow;
				}
			}

			a {
				display: block;
				height: 60px;
				max-height: 60px;
			}

			.cancer-council-logo {
				height: 60px;
				background: white;
				border-radius: 5px;
				box-shadow: 0px 0px 2px #00000016;
				margin-top: 12px;
				margin-right: 10px;
				height: 100%;
				padding-top: 3px;
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

	.spinner-container {
		margin-top: 30vh !important;

        h3 {
            margin-left: 10px;
            color: #555;
        }

        .spinner {
            margin: 50px auto;
            & > .cube1 {
                background-color: $yellow !important;
            }
            & > .cube2 {
                background-color: $blue !important;
            }
        }

	}

	.results-container {
		background: #fff;
		padding: 30px;
		border-radius: 8px;
		max-width: 960px;
		margin: 30px auto;
		margin-top: 0px;
		height: auto;
		position: relative;
		@extend %boxshadow;

		.guide-download {
			display: flex;
			background: #e2eaee;
			color: $dark-blue;
			margin: 30px auto 60px;
			max-width: 600px;
			position: relative;

			.img-container {
				flex-basis: 40%;
				img {
					position: absolute;
					left: -40px;
					bottom: 0;
					max-height: 200px;
				}
			}

			.content {
				flex-basis: 60%;
				padding: 30px;
				text-align: left;

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
			justify-content: flex-start !important;
		}

		h1.total-score {
			margin-top: 15px !important;
			font-weight: 400;

            strong {
                font-family: 'Foco CC Black';
            }
		}

		h3 {
			font-weight: 400;
			// max-width: 450px;
			margin: 0 auto;
		}

		.score-date {
			font-size: 12px;
			margin-top: 15px;
			padding-top: 0;
		}

		.score-container {
			display: flex;
			max-width: 500px;
			justify-content: space-between;
			align-items: center;
			margin: 0 auto;
			flex-wrap: wrap;
			position: relative;

			.line {
				height: 1px;
				border-top: 2px solid $blue;
				width: 150px;
			}

			.score-number-container {
				position: absolute;
				height: 48px;
				left: calc(50% - 30px);
				width: 60px;
				text-align: center;
				top: calc(50% - 28px);

				span.score-number {
					font-size: 48px;
					font-weight: 600;
				}
			}

			.circle {
				margin: 0;
				padding: 15px;
				flex-basis: 150px;
				flex-grow: 1;
				max-width: 150px;
			}
		}

		div.score-msg {
			margin-bottom: 40px;
		}

		.yellow {
			font-weight: bold;
			text-decoration: $yellow;
			text-decoration-line: $yellow;
		}

		.circle {
			margin: 30px auto;
		}

		& > div > h3 {
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

	@media screen and (max-width: 800px) {
		border-top: none;
		.outer-container {
			padding: 0;

			.results-container {
				.overview {
					padding: 0;

					h1.total-score {
						font-size: 24px;
						line-height: 26px;
						margin-bottom: 10px;
					}
				}
			}

			.header-container {
				border-bottom: 3px solid $yellow;
				display: flex;
				align-items: center;
				max-height: 100px;

				& > h1.heading {
					line-height: 18px;
					font-size: 22px;
				}

				a {
					height: 55px;
					max-height: 55px;
					padding-left: 10px;

					div.cancer-council-logo {
						margin: 0 0 0 10px;
						height: 55px;
						width: auto;
						padding: 0 15px 5px 5px;
					}
				}
			}
		}
	}
}

.score-enter-active,
.score-leave-active {
	transition: opacity 0.3s;
	//   opacity: 1;
}
.score-enter,
.score-leave-to {
	opacity: 0;
}

.fade-enter-active,
.fade-leave-active,
.delay-extra-fade-enter-active,
.delay-extra-fade-leave-active,
.delay-fade-enter-active,
.delay-fade-leave-active {
	transition: all 0.3s;
}

.fade-enter, .fade-leave-to,
.delay-fade-enter, .delay-fade-leave-to,
.delay-extra-fade-enter, .delay-extra-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
	height: 0;
	transform: translateY(30px);
}

.delay-fade-enter-active,
.delay-fade-leave-active {
	transition-delay: 0.7s;
	height: 60px;
}
.delay-extra-fade-enter-active,
.delay-extra-fade-leave-active {
	transition-delay: 1.7s;
}
</style>
