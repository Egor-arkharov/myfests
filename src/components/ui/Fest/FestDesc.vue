<template>
	<p class="text__block text__block--name">
		<span class="text__field">Name: </span>
		<span class="text__value">{{ fest.name }}</span>
		<inline-svg
			v-if="fest.own"
			:src="require('@/assets/icons/own.svg')"
			width="30"
			height="30"
		></inline-svg>
	</p>
	<p class="text__block">
		<span class="text__field">Place: </span>
		<span class="text__value">{{
			fest.place.name + ", " + fest.place.countryName
		}}</span>
	</p>
	<p class="text__block">
		<span class="text__field">Date: </span>
		<span class="text__value">{{ fest.date.start + "-" + fest.date.end }}</span>
	</p>
	<p class="text__block">
		<span class="text__field">Genre: </span>
		<span class="text__value">{{ fest.genre }}</span>
	</p>
	<p class="text__block text__block--big">
		<span class="text__field">Headliners: </span>
		<span class="text__value">{{ fest.headliners.join(", ") }}</span>
	</p>
	<p class="text__block text__block--big other-bands">
		<span class="text__field">Other bands: </span>
		<span class="text__value">{{
			fest.bands.filter((el) => !fest.headliners.includes(el)).join(", ")
		}}</span>
	</p>
</template>

<script>
import InlineSvg from "vue-inline-svg";

export default {
	props: ["fest"],
	components: {
		InlineSvg,
	},
};
</script>

<style lang="scss" scoped>
.text {
	&__block {
		display: flex;

		@include font-xl;
		color: $black-color;
		margin-bottom: 15px;

		&:last-child {
			margin-bottom: 0;
		}

		&--name {
			align-items: center;
		}
	}

	&__field {
		font-family: $main-font-bold;
		margin-right: 5px;
		white-space: nowrap;
	}
}

@media (max-width: #{map-get($breakpoints, 'xl')}) {
	.text {
		&__block {
			font-size: 22px;
			line-height: 24px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'lg')}) {
	.text {
		&__block {
			font-size: 20px;
			line-height: 22px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'md')}) {
	.text {
		&__block {
			font-size: 18px;
			line-height: 20px;
			width: 50%;

			&--big {
				width: 100%;
			}
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'xs')}) {
	.text {
		&__block {
			width: 100%;
		}
	}
}
</style>
