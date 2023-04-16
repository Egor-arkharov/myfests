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
	<p class="text__block text__block--date">
		<span class="text__field">Date: </span>
		<span class="text__value">{{ fest.date.start + "-" + fest.date.end }}</span>
	</p>
	<p class="text__block">
		<span class="text__field">Genre: </span>
		<span class="text__value">{{ fest.genre }}</span>
	</p>
	<p
		class="text__block text__block--big"
		:class="{ text_error: !fest.headliners.length }"
	>
		<span class="text__field">Headliners: </span>
		<span class="text__value" v-if="fest.headliners.length">
			<span v-for="(h, idx) in fest.headliners" :key="idx"
				>{{ h }}<span v-if="idx !== fest.headliners.length - 1">,&nbsp;</span>
			</span>
		</span>
	</p>
	<p
		class="text__block text__block--big other-bands"
		:class="{ text_error: !fest.bands.length }"
	>
		<span class="text__field">Other bands: </span>
		<span class="text__value" v-if="fest.bands.length">
			<span
				v-for="(b, idx) in fest.bands.filter(
					(el) => !fest.headliners.includes(el)
				)"
				:key="idx"
				>{{ b }}<span v-if="idx !== fest.bands.length - 1">,&nbsp;</span>
			</span>
		</span>
	</p>
	<p class="text__block" v-if="fest.fromModal">
		<span class="text__field">Img:&nbsp; </span>
		<fest-img :fest="fest" :modal="true"></fest-img>
	</p>
</template>

<script>
import InlineSvg from "vue-inline-svg";
import FestImg from "@/components/ui/Fest/FestImg.vue";

export default {
	props: ["fest"],
	components: {
		InlineSvg,
		FestImg,
	},
};
</script>

<style lang="scss" scoped>
.text {
	&__block {
		display: flex;

		@include font-xxl;
		color: $black-color;
		margin-bottom: 15px;

		&:last-child {
			margin-bottom: 0;
		}

		&--name {
			align-items: center;
		}

		&--date {
			white-space: nowrap;
		}
	}

	&__field {
		font-family: $main-font-bold;
		margin-right: 5px;
		white-space: nowrap;
	}

	&__value > span {
		display: inline-block;
		white-space: nowrap;
	}

	&_error {
		color: $error-color;
	}
}

@media (max-width: #{map-get($breakpoints, 'xl')}) {
	.text {
		&__block {
			@include font-xl;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'lg')}) {
	.text {
		&__block {
			@include font-xxl;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'md')}) {
	.text {
		&__block {
			@include font-m;
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
