<template>
	<div class="warn">
		<p class="warn__text">
			If&nbsp;you refresh data, it&nbsp;will update all fests, includes your
			own!
		</p>
		<div class="warn__buttons">
			<button class="btn btn--warn btn--warn-refresh" @click="refresh">
				Got it, refresh!
			</button>
			<button class="btn btn--warn btn--warn-close" @click="close">
				Ok, maybe later
			</button>
		</div>
	</div>
</template>

<script>
import { useStore } from "vuex";

export default {
	setup(_, { emit }) {
		const store = useStore();

		const refresh = () => {
			store.dispatch("clearAllData");
			emit("close");
		};

		const close = () => {
			emit("close");
		};

		return {
			refresh,
			close,
		};
	},
};
</script>

<style lang="scss" scoped>
.warn {
	&__text {
		margin-bottom: 25px;
	}

	&__buttons {
		display: flex;
		justify-content: center;
	}
}

.btn--warn-refresh {
	margin-right: 20px;
	color: $white-color;
	background-color: $color-5;

	@include hover {
		background-color: darken($color-5, 10%);
		color: $white-color;
	}
}

.btn--warn-close {
	color: $grey-color;
	background-color: $white-color;
	border: 2px solid $grey-color;

	@include hover {
		background-color: $grey-color;
		color: $white-color;
	}
}
</style>
