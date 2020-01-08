<template>
	<div class="category">
		<div class="category-heading" @click="expanded = !expanded">
			<div class="heading-container">
				<span>
					<span class="img-container">
						<img :src="icons[category.name]" />
					</span>

					<div class="caret-container">
						<i v-if="improvement" class="fa fa-caret-up"></i>
						<i v-if="decline" class="fa fa-caret-down"></i>
					</div>

					{{ category.name.toUpperCase() }}
				</span>

				<span class="category-icons">
					<span v-if="category.bad.length === 0"><i class="fa fa-check-circle"></i></span>

					<template v-if="category.bad.length > 0">
						<span class="numbered-exclamation">{{ category.bad.length }} &nbsp;</span>
						<i class="fa fa-exclamation-circle"></i>
					</template>
				</span>
			</div>

			<span class="expand-tag">
				<i v-if="!expanded" class="fa fa-chevron-down"></i>
				<i v-else class="fa fa-chevron-up"></i>
			</span>
		</div>

		<div class="blue" :class="{ contracted: !expanded }" v-if="category.good.length > 0">
			<h2>You're doing great in the following areas:</h2>

			<ul>
				<feedback v-for="(section, i) in category.good" :section="section" :good="true" :key="i"></feedback>
			</ul>
		</div>

		<div class="grey" :class="{ contracted: !expanded }" v-if="category.bad.length > 0">
			<h2>Areas for improvement:</h2>
			<ul class="improvements">
				<feedback v-for="(section, i) in category.bad" :section="section" :good="false" :key="i"></feedback>
			</ul>

			<template v-if="category.tips && category.tips.length > 0">
				<h2 class="m0">Tips:</h2>
				<ul class="tips">
					<li v-for="(tip, index) in category.tips" :key="index" v-html="tip"></li>
				</ul>
			</template>
		</div>

		<div v-if="filteredResources.length > 0" class="resources-container" :class="{ contracted: !expanded }">
			<h2>Resources and links:</h2>
			<ul class="resources">
				<resource v-for="(resource, index) in filteredResources" :key="index" :resource="resource"></resource>
			</ul>
		</div>
	</div>
</template>

<script>
import { default as Tips } from './../config/tips.js';
import { default as Icons } from './../config/icons.js';
import { default as Resources } from './../config/resources.js';
import { default as Resource } from './Resource.vue';
import { default as Feedback } from './Feedback.vue';

export default {
	name: 'Category',
	props: ['category', 'index', 'gender', 'improvement', 'decline'],
	components: {
		Feedback,
		Resource
	},
	data() {
		return {
			tips: Tips,
			resources: Resources,
			expanded: false,
			icons: Icons
		};
	},
	computed: {
		filteredResources() {
			let vm = this;
			return vm.resources[vm.category.name].filter(r => vm.showResource(r));
		}
	},
	methods: {
		getTips() {
			let vm = this;
			let tips = [];

			let tipQuestions = vm.tips[vm.category.name];

			if (tipQuestions) {
				Object.keys(tipQuestions).forEach(q => {
					let badCategoryObj = vm.category.bad.find(o => o.id === q);
					if (badCategoryObj && !(badCategoryObj.bmi && parseInt(badCategoryObj.bmi) < 20)) {
						tipQuestions[q].forEach(t => tips.push(t));
					}
				});
			}

			return tips.length > 0 ? tips : null;
		},
		showResource(resource) {
			let vm = this;
			let category = vm.category;

			let matchingQuestionId = category.bad.map(q => q.id).includes(resource.questionId);
			let matchingGender = vm.gender === resource.gender;
			let conditionalDisplay = resource.hasOwnProperty('questionId') || resource.hasOwnProperty('gender');

			return !conditionalDisplay || matchingQuestionId || matchingGender;
		}
	},
	mounted() {
		let vm = this;

		vm.category.tips = vm.getTips();
	}
};
</script>

<style lang="scss">
@import './../styles/variables.scss';

.category {
	background: #eee;
	color: #fff;
	margin: 15px;
	@extend %boxshadow;
	border-radius: 8px;
	text-align: left;
	transition: 0.3s;

	.category-heading {
		&:hover {
			background: $blue;
			cursor: pointer;

			& > div.heading-container span.category-icons .fa-check-circle {
				color: #fff;
			}
		}
		background: $dark-blue;
		transition: 0.3s ease;
		border-radius: 8px 8px 0 0;
		display: flex;
		justify-content: stretch;

		.caret-container {
			width: 30px;
			text-align: left;

			i.fa-caret-up {
				color: #5ebc5e;
			}

			i.fa-caret-down {
				color: $yellow;
			}
		}

		.img-container {
			width: 40px;
			text-align: center;
			display: inline-block;
			height: 40px;
			justify-content: center;
			align-items: center;
			margin-right: 15px;

			img {
				margin-top: 2px;
				height: 36px;
			}
		}

		& > div.heading-container {
			color: #fff;
			padding: 10px 30px;
			margin: 0;
			flex-basis: 300px;
			flex-grow: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 24px;
			font-family: 'Foco CC', 'Roboto', Arial, sans-serif;

			& > span:not(.category-icons) {
				display: flex;
				align-items: center;
				line-height: 20px;
			}
			span.category-icons {
				float: right;
				width: 60px;
				display: flex;
				pointer-events: none;
				align-items: center;
				justify-content: flex-end;

				span.numbered-exclamation {
					line-height: 24px;
					height: 24px;
					font-size: 24px;
				}

				.fa-check-circle {
					color: $blue;
					transition: 0.3s ease;
				}

				.fa-exclamation-circle {
					color: $yellow;
				}
			}
		}

		span.expand-tag {
			flex-basis: 40px;
			max-width: 40px;
			flex-shrink: 1;
			padding: 5px 10px;
			color: #fff;
			font-size: 24px;
			border-radius: 0 8px 0 0;
			transition: 0.5s ease;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;

			&.yellow-expand {
				background: $yellow;
			}

			&:hover {
				opacity: 0.7;
				cursor: pointer;
			}
		}
	}

	& > h2 {
		padding: 15px 30px;
		margin: 0;
		color: #fff;
	}

	p,
	li {
		margin: 0 0 4px 0;
		font-size: 16px !important;
	}

	.blue,
	.grey,
	.resources-container {
		transition: max-height 0.5s ease, opacity 0.5s ease;
		padding: 15px 30px;
		max-height: 3000px;

		.fa,
		.svg-inline--fa {
			font-size: 20px !important;
		}
	}

	.blue.contracted,
	.grey.contracted,
	.resources-container.contracted {
		transition: max-height 0.5s ease, opacity 0.5s ease;
		padding: 0;
		margin: 0;
		opacity: 0;
		max-height: 0px;
		height: 0;
		pointer-events: none;

		* {
			margin: 0;
			padding: 0;
			opacity: 0;
			max-height: 0;
		}

		ul,
		li {
			display: none !important;
		}
	}

	.blue > div,
	.grey > div {
		display: flex;
		flex-wrap: wrap;
		padding: 10px 15px 0 0;

		p {
			flex-basis: 200px;
			min-width: 200px;
			flex-grow: 1;
		}
	}

	.blue {
		background: $blue;
		color: #fff;

		h2 {
			color: #fff;
		}

		ul {
			display: flex;
			flex-wrap: wrap;

			li {
				flex-basis: 380px;
				flex-grow: 1;
				min-width: 380px;
				margin: 5px 0;
				display: flex;
				.fa,
				.svg-inline--fa {
					font-size: 20px;
					color: #fff;
					margin-right: 15px;
				}

				p {
					margin: 0;
				}
			}
		}
	}

	.grey {
		background: $yellow;
		color: $dark-blue;

		& > div {
			margin: 20px auto;
			border-top: 1px solid #dcdcdc;
		}

		ul.tips {
			margin-top: 10px;
			padding-inline-start: 20px;
		}

		ul.improvements {
			list-style-type: none;
			display: flex;
			flex-wrap: wrap;

			li {
				flex-basis: 380px;
				flex-grow: 1;
				min-width: 380px;
				margin: 5px 30px 5px 0;
				display: flex;

				.fa,
				.svg-inline--fa {
					margin-right: 15px;
					font-size: 24px;
				}
			}
		}

		a {
			text-decoration: none;
			color: $blue;
			font-weight: bold;
		}
	}
	.resources-container {
		background: #eee;
		color: $dark-blue;
		padding: 15px 30px 30px 30px;

		.resources {
			display: flex;
			list-style-type: none;
			padding-inline-start: 0;
			margin-block-start: 0;
			flex-wrap: wrap;
			justify-content: flex-start;

			.resource {
				max-height: 300px;
			}
		}
	}
}

@media screen and (max-width: 600px) {
	.category {
		&.break::after {
			width: calc(100% - 30px);
		}

		div.blue > h2,
		div.grey > h2,
		div.resources-container > h2 {
			font-size: 24px;
			line-height: 26px;
		}

		.category-heading > div.heading-container {
			font-size: 20px;
			padding: 5px 10px;

			span.img-container > img {
				height: 30px;
				margin-top: 4px;
			}

			.category-icons {
				line-height: 16px;
				font-size: 16px;
				height: 16px;

				span.yellow-text {
					display: none;
				}
				i.fa-exclamation-circle {
					display: inline-block;
				}
			}
		}
	}
}

@media screen and (max-width: 800px) {
	.category {
		margin: 15px 0;

		.category-heading {
			font-size: 16px;

			& > div.heading-container {
				font-size: 16px;
				padding: 5px 0 5px 10px;

				span.img-container {
					margin-right: 10px;
				}
			}

			span.category-icons {
				min-width: 15px;
				width: 15px;
				align-items: center;

				.numbered-exclamation {
					display: none;
				}
			}
		}

		.blue > ul > li,
		.grey > ul > li {
			min-width: unset !important;
			margin: 5px 0 !important;
		}

		.grey,
		.blue,
		.resources-container {
			ul {
				padding-inline-start: 0;
			}
		}
	}
}
</style>
