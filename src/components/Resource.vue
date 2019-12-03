<template>
	<li class="resource">
		<a
			class="img-link"
			:class="{
				download: resource.download,
				fullwidth: resource.fullwidth
			}"
			:href="resource.url"
			target="_blank"
			v-bind:style="{ backgroundImage: 'url(' + resource.img + ')' }"
		></a>

		<div>
			<p>{{ resource.text }}</p>
			<download :link="resource.url">{{ resource.cta }}</download>
			<!-- <a :href='resource.url' target='_blank'>{{ resource.cta }}</a> -->
		</div>
	</li>
</template>

<script>
import { default as Download } from './Download';

export default {
	name: 'resource',
	props: ['resource'],
	components: {
		Download
	}
};
</script>

<style lang="scss" scoped>
@import './../styles/variables.scss';

li.resource {
	@extend %boxshadow;
	background: white;
	margin: 10px;
	padding: 0;
	min-width: 320px;
	flex-basis: 320px;
	flex-grow: 1;
	display: flex;
	max-width: 385px;
	position: relative;
	overflow-y: hidden;

	a.img-link {
		padding: 0;
		margin: 0;
		height: 100%;
		flex-basis: 45%;
		flex-grow: 1;
		background-size: contain;

		&.download {
			background-repeat: no-repeat;
			background-color: $blue;
			background-position: center;
			display: block;
		}

		&.fullwidth {
			flex-basis: 100%;
			width: 100%;
		}
	}
	div {
		padding: 30px;
		flex-basis: 45%;
		flex-grow: 1;
		display: flex;
		flex-direction: column;

		a {
			margin-top: 10px;
		}
	}
	display: flex;
	align-items: center;
}

@media screen and (max-width: 600px) {
	li.resource {
		flex-wrap: wrap;
		margin: 10px 0;
		a.img-link {
			height: 150px;
		}
	}
}

@media screen and (max-width: 800px) {
	li.resource {
		min-width: unset;
		max-height: 280px;

		a.img-link.download {
			max-height: 280px;
		}
	}
}
</style>
