<template>
	<div class="scorecard-container">
		<div class="overview">
			<h1 id="total-score">
				<strong
					>Hi {{ latestScorecard.firstName }},

					<span v-if="parseInt(latestScorecard.scores.total) === 100">
						well done!
					</span>

					<span
						v-else-if="parseInt(latestScorecard.scores.total) >= 75"
					>
						you're doing well.
					</span>

					<span
						v-else-if="parseInt(latestScorecard.scores.total) >= 50"
					>
						you're on the right track.</span
					>

					<span v-else>there's room for improvement. </span></strong
				>

				<br />Your total score is:
			</h1>

			<div class="score-container">
				<div class="line"></div>

				<transition name="score">
					<div class="score-number-container"
						:class="{ compare: previousScorecard }"
					>
						<span class="score-number">
							{{ latestScorecard.scores.total }}
							<span
								class="compare-number"
								v-if="previousScorecard"
							>
								<i v-if='latestScorecard.scores.total > previousScorecard.scores.total' class="fa fa-caret-up"></i
								>
                                <i v-else class="fa fa-caret-down"></i
								>{{
									Math.abs(latestScorecard.scores.total -
										previousScorecard.scores.total)
								}}
							</span>
						</span>
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

			<p class="score-date">Based on your answers from {{ date }}</p>

			<div
				v-if="previousScorecard && improvedCategories.length > 0"
				class="improvements"
			>
				<h3>
					In the last <strong>{{ dateDiff }} days</strong>, your score
					has improved in:
				</h3>

				<h2>
					{{ improvedCategories.join(', ') }}
				</h2>

				<h3>Keep up the good work!</h3>
			</div>

			<h3 class="explanation" v-if="!previousScorecard">
				This score is out of 100 and calculates how much you are
				reducing your cancer risk through healthy lifestyle behaviours.
				The higher your score, the more ways you are currently reducing
				your cancer risk. <br /><br /><strong
					>Aim for 100 to improve your health!</strong
				>
			</h3>

            <button v-if='previousScorecard' class='history-btn' @click='viewHistory()'>VIEW YOUR HISTORY</button>

            <p class='info-text'>
                Look for the arrows to see if your score has increased 
                <i class='fa fa-caret-up'></i> or decreased <i class='fa fa-caret-down'></i> since your last attempt.
            </p>
		</div>

		<div v-if="!previousScorecard" class="guide-download">
			<div class="img-container">
				<img
					src="https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/guide-resource-cropped.png"
				/>
			</div>
			<div class="content">
				<p>
					Our cut your cancer risk guide contains a broad overview on
					how you can reduce your cancer risk.
				</p>
				<download
					link="https://cancerqld.blob.core.windows.net/resources/quest/Cut%20your%20cancer%20risk_DL_v09%20(002).pdf"
					>Download</download
				>
			</div>
            
		</div>

		<span v-for="(category, index) in categoryCards" :key="index">
			<category
				:category="category"
				:index="index"
				:gender="latestScorecard.gender"
				:improvement="checkImprovement(category.name)"
				:decline="checkDecline(category.name)"
			></category>

			<div
				class="category-break"
				v-if="
					index + 1 < categoryCards.length &&
						categoryCards[index].bad.length === 0 &&
						categoryCards[index + 1].bad.length > 0"
			></div>
		</span>

		<h3 class="explanation" v-if="previousScorecard">
			<br /><br />
			This score is out of 100 and calculates how much you are reducing
			your cancer risk through healthy lifestyle behaviours. The higher
			your score, the more ways you are currently reducing your cancer
			risk. <br /><br /><strong
				>Aim for 100 to improve your health!</strong
			>
			<br /><br />
		</h3>

		<div v-if="previousScorecard" class="guide-download">
			<div class="img-container">
				<img
					src="https://cancerqld.blob.core.windows.net/content/landing-pages/cancer-risk-quiz/guide-resource-cropped.png"
				/>
			</div>
			<div class="content">
				<p>
					Our cut your cancer risk guide contains a broad overview on
					how you can reduce your cancer risk.
				</p>
				<download
					link="https://cancerqld.blob.core.windows.net/resources/quest/Cut%20your%20cancer%20risk_DL_v09%20(002).pdf"
					>Download</download
				>
			</div>
		</div>
	</div>
</template>

<script>
import { default as Category } from './Category'
import { default as Download } from './Download'
import VueCircle from 'vue2-circle-progress';
const moment = require('moment');

export default {
	name: 'Scorecard',
	components: {
		VueCircle,
		Category,
		Download
	},
	props: ['latestScorecard', 'previousScorecard'],
	computed: {
		date() {
			return this.latestScorecard
				? moment.unix(this.latestScorecard._ts).format('MMMM Do, YYYY')
				: null;
		},
		dateDiff() {
			if (!this.latestScorecard || !this.previousScorecard) {
				return null;
			}
			let ls = moment.unix(this.latestScorecard._ts);
			let ps = moment.unix(this.previousScorecard._ts);
			return parseInt(moment.duration(ls.diff(ps)).as('days'));
        },
        improvedCategories() {
            let vm = this;

            let improvedCategories = [];

            Object.keys(vm.latestScorecard.scores).forEach(cat => {
                if (cat !== 'total' 
                        && vm.previousScorecard.scores[cat] != undefined
                        && vm.latestScorecard.scores[cat] > vm.previousScorecard.scores[cat]) {
                    improvedCategories.push(cat == 'uv' ? 'UV' : cat)
                }
            })

            if (improvedCategories.length > 1) {
                improvedCategories[improvedCategories.length - 1] = ' & ' + improvedCategories[improvedCategories.length - 1]
            }

            return improvedCategories
        },
        categoryCards() {
			let vm = this;

			if (!vm.latestScorecard) {
				return [];
			}
			let categoryCards = [];

			Object.keys(vm.latestScorecard.scores).forEach(category => {
				if (category !== 'total') {
					categoryCards.push(vm.getCategoryObj(category));
				}
			});

			return categoryCards.sort((a, b) => a.bad.length - b.bad.length);
		}
    },
    methods: {
        viewHistory() {
            this.$emit('viewhistory')
        },  
        checkImprovement(category) {
            let vm = this;

            if (!vm.previousScorecard) { return false }

            return vm.latestScorecard.scores[category] > vm.previousScorecard.scores[category]
        },
        checkDecline(category) {
            let vm = this;

            if (!vm.previousScorecard) { return false }

            return vm.latestScorecard.scores[category] < vm.previousScorecard.scores[category]
        },
        getCategoryObj(category) {
            let vm = this;
            let tiers = ['good', 'bad'];
			let categoryObj = {
				name: category
			};
            
            tiers.forEach(tier => {
                categoryObj[tier] = vm.latestScorecard.recommendations.filter(
                    rec => rec.category === category && (tier == 'good' ? rec.score == 100 : rec.score != 100)
                )

                if (vm.previousScorecard) {
                    categoryObj[tier] = categoryObj[tier].map(q => {
                        let prevQuestion = vm.previousScorecard.recommendations.find(r => r.id == q.id);

                        if (prevQuestion) {
                            let prevScore = prevQuestion.score;
                            q.improvement = q.score > prevScore
                            q.decline = q.score < prevScore
                            return q
                        }
                    })
                }
            })

			return categoryObj;
		},
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

@import '../styles/main.scss';
@import '../styles/variables.scss';
@import '../styles/responsive.scss';

.scorecard-container {
    padding: 30px;

    i {
        &.fa-caret-up {
            color: #5ebc5e;
        }
        &.fa-caret-down {
            color: $yellow;
        }
    }
    
    @media screen and (max-width: 767px) {
        padding: 15px;

        h1#total-score {
            font-size: 24px;
            line-height: 28px;
        }
    }

	div.improvements {
		background: #e2eaee;
		box-sizing: border-box;
		padding: 30px;
		margin: 30px auto;
		max-width: 600px;

		h2 {
			text-transform: capitalize;
            font-family: 'Foco CC Black';
            margin: 15px auto!important;
            font-size: 24px;
            line-height: 28px;
		}
	}

	h3.explanation {
		max-width: 600px;
    }

    p.info-text {
        margin-top: 30px;
        display:flex;
        align-items:center;
        justify-content:center;

        i {
            font-size: 32px;
            padding: 0 10px;
        }
    }
    
    button.history-btn {
        text-align:center;
        font-size: 14px;
        text-decoration:none;
        background: $yellow;
        padding: 10px 30px;
        border:none;
        border-radius: 30px;
        color:$dark-blue;
        font-weight: 600;
        transition: 0.3s ease-in-out;
        cursor:pointer;
        @extend %boxshadow;

        &:hover {
            opacity: 0.8;
        }

        @media (max-width: 767px) {
            margin-bottom: 30px;
        }
    }

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

	h1#total-score {
		margin-top: 15px !important;
		font-weight: 400;

		strong {
			font-family: 'Foco CC Black';
		}
	}

	h3 {
		font-weight: 400;
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

			.compare-number {
				display: none;
				font-size: 16px;
				margin-top: -15px;
				font-weight: 800;

				i {
					margin-right: 6px;
                    font-size: 24px;
				}
			}

			&.compare {
				top: calc(50% - 40px) !important;

				.compare-number {
					display: block;
				}
			}

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
		margin: 25px 15px;
	}
}

.score-enter-active,
.score-leave-active {
	transition: opacity 0.3s;
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
