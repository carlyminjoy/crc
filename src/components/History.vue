<template>
	<div class="history-container">
		<h2>Scorehard History</h2>
		<p>Your total scores out of 100 over time.</p>

		<totals-chart
			v-if="charts.total.data && scorecards.length > 1"
			:chart-data="charts.total.data"
			:options="charts.total.options"
			:height="200"
		></totals-chart>

		<p v-else><em>Not enough data.</em></p>

		<br /><br />

		<h2>Category Scores</h2>
		<p>
			An overview of your category scores out of 100 from each Cancer Risk
			Calculator completion.<br />Use the left and right arrows below to
			view your category scores from different dates.
		</p>

		<p class="date-select" v-if="scorecards[scorecardIndex]">
			<i
				@click="prev()"
				class="fa fa-chevron-left"
				:class="{ grey: scorecardIndex + 1 == scorecards.length }"
			></i>
			{{ scorecards[scorecardIndex]._ts | displayDate }}
			<i
				@click="next()"
				class="fa fa-chevron-right"
				:class="{ grey: scorecardIndex == 0 }"
			></i>
		</p>

		<categories-chart
			v-if="charts.category.data"
			:chart-data="charts.category.data"
			:options="charts.category.options"
			:height="200"
		>
		</categories-chart>
	</div>
</template>

<script>
const moment = require('moment');
import { default as TotalsChart } from './TotalsChart';
import { default as CategoriesChart } from './CategoriesChart';

export default {
	name: 'History',
	extends: 'Bar',
	props: ['scorecards'],
	components: {
		TotalsChart,
		CategoriesChart
	},
	data() {
		return {
			charts: {
				total: {
					data: null,
					options: {}
				},
				category: {
					data: null,
					options: {
						legend: {
							display: false
						}
					}
				}
			},
			scorecardIndex: 0
		};
	},
	filters: {
		displayDate(v) {
			return moment.unix(v).format('MMMM Do, YYYY');
		}
	},
	methods: {
		prev() {
			if (this.scorecardIndex + 1 < this.scorecards.length) {
				this.scorecardIndex++;
				this.setCategoriesData();
			}
		},
		next() {
			if (this.scorecardIndex > 0) {
				this.scorecardIndex--;
				this.setCategoriesData();
			}
		},
		setCategoriesData() {
			let data = {
				labels: [
					'alcohol',
					'nutrition',
					'physical activity',
					'screening',
					'smoking',
					'uv',
					'weight'
				],
				datasets: []
			};

			data.datasets.push({
				label: moment
					.unix(this.scorecards[this.scorecardIndex]._ts)
					.format('MMM DD, YYYY'),
				backgroundColor: `#F289B7`,
				data: data.labels.map(
					cat =>
						this.scorecards[this.scorecardIndex].entry.scores[cat]
				)
			});

			this.charts.category.data = data;
		}
	},
	mounted() {
		this.setCategoriesData();

		this.charts.total.data = {
			datasets: [
				{
					label: 'Scorecard Total',
					borderColor: '#F289B7',
					data: this.scorecards.map(sc => {
						return {
							x: moment.unix(sc._ts),
							y: sc.entry.scores.total
						};
					})
				}
			]
		};

		this.charts.total.options = {
			legend: false,
			scales: {
				yAxes: [
					{
						ticks: {
							suggestedMin: 0,
							suggestedMax: 100
						}
					}
				],
				xAxes: [
					{
						type: 'time',
						time: {
							unit: 'month'
						}
					}
				]
			}
		};
	}
};
</script>

<style lang="scss" scoped>
@import './../styles/variables.scss';

#app {
	.history-container {
		padding: 30px;

		@media screen and (max-width: 767px) {
			padding: 15px;

			h1#history-title {
				font-size: 24px;
				line-height: 28px;
			}
		}

		h1#history-title {
			line-height: 32px;
			margin-bottom: 20px;
		}

		.fa-chevron-left,
		.fa-chevron-right {
			margin: 0 30px;
			cursor: pointer;
			transition: 0.5s ease;

			&.grey {
				color: #999;
			}

			&:hover {
				color: #f289b7;
			}
		}

		.date-select {
			margin: 0 auto 10px;
			width: 300px;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
}
</style>
