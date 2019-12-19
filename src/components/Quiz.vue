<template>
	<div id="quiz">
		<ul class="progress-bar">
			<li
				v-for="(route, index) in routes"
				:key="index"
				:class="{ active: currentStep && index <= routes.indexOf(activeCategory) }"
			>
				<span>{{ route == 'uv' ? 'UV' : route }}</span>
			</li>
		</ul>

		<div class="conversation-container-wrapper" ref="mobileConversationEl">
			<div class="conversation-container">
				<template class="step-container" v-for="(step, index) in steps">
					<transition name="fade" :key="index">
						<div v-if="display(step) && index <= currentStep" class="ai-comment">
							<question
								v-if="step.question && !step.userInput"
								:question="step"
								v-on:addstep="addStep()"
								v-on:loading="scrollToBottom"
								v-on:ready="scrollToBottom"
							></question>

							<weight
								v-else-if="['bmi', 'waist'].includes(step.id)"
								:question="step"
								:gender="steps.find(s => s.id === 'gender').score"
								v-on:addstep="addStep()"
								v-on:scrolltobottom="scrollToBottom"
							></weight>

							<postcode
								v-else-if="step.userInput && step.id === 'postcode'"
								:question="step"
								v-on:addstep="addStep()"
								v-on:scrolltobottom="scrollToBottom"
							></postcode>

							<comment v-else v-on:scrolltobottom="scrollToBottom" :text="step.text"></comment>
						</div>
					</transition>

					<transition name="fade" :key="index">
						<div v-if="step.score || step.score === 0" class="user-comment">
							<comment
								v-if="!step.options"
								v-on:scrolltobottom="scrollToBottom"
								:text="step.userResponse"
							></comment>
							<comment
								v-if="step.options"
								v-on:scrolltobottom="scrollToBottom"
								:text="step.options.find(o => o.score === step.score).userResponse"
							></comment>
						</div>
					</transition>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import { default as conversation } from '../config/config.js';
import { Question, Weight, Postcode, Comment } from './index.js';

export default {
	name: 'Quiz',
	props: ['timers'],
	components: {
		Question,
		Weight,
		Postcode,
		Comment
	},
	data() {
		return {
			activeCategory: 'personal',
			currentStep: null,
			steps: conversation.steps
		};
	},
	watch: {
		currentStep(next, prev) {
			let vm = this;

			let nextStep = vm.steps[next];

			if (nextStep.id === 'final') {
				vm.activeCategory = 'results';
				vm.$emit('completed', vm.steps);
			} else {
				if (nextStep.question) {
					vm.activeCategory = nextStep.category;

					if (!nextStep.display(vm.steps)) {
						setTimeout(() => vm.currentStep++ && vm.scrollToBottom(), vm.timers.short);
					}
				} else {
					setTimeout(
						() => {
							vm.currentStep++;
						},
						nextStep.delay ? vm.timers.long : vm.timers.med
					);
				}
			}
		}
	},
	computed: {
		displayScreening() {
			let vm = this;

			let age = vm.steps.find(s => s.id === 'age').score;
			let gender = vm.steps.find(s => s.id === 'gender').score;

			if (!(age || gender)) {
				return false;
			}

			return ['64', '74'].includes(age) || (['39', '49'].includes(age) && gender === 'f');
		},
		routes() {
			let generatedRoutes = ['personal', 'uv', 'smoking', 'alcohol', 'nutrition', 'weight', 'physical activity'];

			if (this.displayScreening) {
				generatedRoutes.push('screening');
			}

			generatedRoutes.push('results');

			return generatedRoutes;
		},
		submitBtnDisabled() {
			let vm = this;

			return vm.form.firstName === '' || vm.form.emailAddress === '';
		}
	},
	methods: {
		scrollToBottom() {
			var element = this.$refs.mobileConversationEl;
			element.scrollTop = element.scrollHeight;
		},
		addStep() {
			let vm = this;

			vm.scrollToBottom();

			setTimeout(() => {
				vm.steps[vm.currentStep].userResponded = true;
				vm.display(vm.steps[vm.currentStep + 1]) ? vm.currentStep++ : (vm.currentStep += 2);
				vm.scrollToBottom();
			}, vm.timers.short);
		},
		display(step) {
			let vm = this;
			return step.display(vm.steps);
		}
	},
	mounted() {
		this.currentStep = 0;
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

$blue: #0099da;
$yellow: #fcd208;
$dark-blue: #2c3e50;

%boxshadow {
	-webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
	-moz-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
	-ms-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
	-o-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
}

@keyframes fade-in {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}

.progress-bar {
	display: flex;
	list-style-type: none;
	width: 660px;
	max-width: 100%;
	margin: 0 auto;
	margin-block-start: 0px;
	margin-block-end: 0px;
	padding-inline-start: 0px;
	font-family: 'Roboto';
	border-bottom: 4px solid #999;
	position: relative;

	li {
		border-bottom: 4px solid #999;
		padding: 15px 6px 15px 6px;
		font-size: 14px;
		font-family: 'Foco CC', 'Roboto', Arial, sans-serif;
		text-transform: capitalize;
		flex-grow: 1;
		margin-bottom: -4px;
		transition: all 0.3s ease;
		display: inline-block;

		&.active {
			border-bottom: 4px solid $yellow;
			color: $dark-blue;
			font-weight: bold;
		}
	}
}

.conversation-container-wrapper {
	position: relative;
	min-height: 500px;
	overflow-y: auto;
	margin: 50px auto 0;
	padding: 30px;
	max-width: 600px;
	max-height: 500px;
	-webkit-mask-image: -webkit-gradient(linear, left top, left 10%, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, 1)));

	.conversation-container {
		background: rgba(0, 0, 0, 0);
		text-align: left;
		font-size: 16px !important;

		display: -webkit-flex;
		display: -moz-flex;
		display: -ms-flex;
		display: flex;
		flex-direction: column;

		-webkit-justify-content: flex-end;
		-moz-justify-content: flex-end;
		-ms-justify-content: flex-end;
		justify-content: flex-end;

		p {
			font-size: 16px !important;
			margin: 8px 0;
		}

		.ai-comment {
			background: #fff;
			padding: 5px 15px;
			border-radius: 8px 8px 8px 0;
			max-width: 400px;
			margin: 6px auto 6px 0;
			height: auto;
			@extend %boxshadow;

			img {
				height: 20px;
				margin: 0 10px -3px;
			}

			a {
				text-decoration: none;
				font-weight: bold;
				color: $blue;
				transition: 0.3s ease;
				&:hover {
					color: $dark-blue;
				}
			}
		}

		.user-comment {
			background: $blue;
			color: #fff;
			padding: 5px 15px;
			border-radius: 8px 8px 0 8px;
			max-width: 400px;
			margin: 6px 0 6px auto;
			height: auto;
			@extend %boxshadow;
		}
	}
}

@media screen and (max-width: 800px) {
	.conversation-container-wrapper {
		height: calc(100vh - 180px);
		min-height: calc(100vh - 180px);
		margin: 0 auto;
		-webkit-mask-image: -webkit-gradient(linear, left top, left 10%, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, 1)));

		.conversation-container {
			margin: 10px auto 0;

			.ai-comment,
			.user-comment {
				max-width: 80%;
			}
		}
	}
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
