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

            <div class='results-container' v-else-if="showScore && latestScorecard">
                <div class="tabs-container">
                    <ul class='tabs'>
                        <li :class="{active : tab == 'scorecard'}" @click="tab = 'scorecard'">
                            <i class='fa fa-star'></i>Scorecard</li>
                        <li :class="{active : tab == 'history'}" @click="tab = 'history'">
                            <i class='fa fa-history'></i>History</li>
                    </ul>
                    <div class='slider' :class="{ 'right' : tab == 'history' }"></div>
                
                <scorecard v-if='tab == "scorecard"'
                    :latest-scorecard='latestScorecard'
                    :previous-scorecard='previousScorecard'>
                </scorecard>

                <history v-if="tab == 'history'"
                    :scorecards='results'></history>

            </div>

		</div>
	</div>
</template>

<script>
import {
	Spinner,
	HeaderBlob,
	BackgroundBlob,
    Scorecard,
    History
} from './components';
import VueCircle from 'vue2-circle-progress';
import axios from 'axios';

export default {
	name: 'app',
	components: {
		VueCircle,
        Spinner,
        Scorecard,
		HeaderBlob,
        BackgroundBlob,
        History
	},
	data() {
		return {
			loading: true,
			results: {},
			latestScorecard: null,
			previousScorecard: null,
            showScore: false,
            tab: 'scorecard',
			state: {
				isIe: false,
				isMozilla: false
			}
		};
	},
	methods: {
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

                    if (vm.results.length > 1) {
                        vm.previousScorecard = vm.results[1].entry;
                    }
                    vm.latestScorecard = vm.results[0].entry;

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
			max-width: 960px;
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
		border-radius: 8px;
		max-width: 960px;
		margin: 30px auto;
		margin-top: 0px;
		height: auto;
		position: relative;
		@extend %boxshadow;

        .tabs-container {
            .slider {
                width: 50%;
                height: 2px;
                background: $blue;
                display:block;
                transition: 0.5s ease;
                position:relative;
                left: 0;

                &.right {
                    transition: 0.5s ease;
                    left: 50%;
                }
            }

            .tabs {
                display:flex;
                list-style-type:none;
                padding-inline-start:0;
                flex-direction:row;
                justify-content: space-between;
                margin: 0;
                font-size: 18px;
                cursor: pointer;

                li {
                    text-align:center;
                    text-transform:uppercase;
                    padding: 20px 0 15px 0;
                    flex-basis: 50%;
                    flex-grow: 1;
                    transition: 0.5s ease;

                    &.active {
                        transition: 0.5s ease;
                        color:$blue;
                    }

                    i {
                        margin-right: 20px;
                    }
                }
            }
        }
    }

	@media screen and (max-width: 800px) {
		border-top: none;
		.outer-container {
			padding: 0;

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

</style>
