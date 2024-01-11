<template>
	<div v-if="!isHidden" class="hint">
		<p class="hint__text">{{ textToHide }}</p>
		<button class="hint__button btn btn--icon" @click="handleButtonClick">
			<inline-svg
				:src="require(`@/assets/icons/cross.svg`)"
				width="25"
				height="25"
			></inline-svg>
		</button>
	</div>
</template>

<script>
import { ref } from "@vue/runtime-core";
import InlineSvg from "vue-inline-svg";

export default {
	props: ["text", "handleClick"],
	setup(props) {
		const textToHide = ref(props.text);
		const isHidden = ref(false);

		const handleButtonClick = () => {
			isHidden.value = true;

			if (props.handleClick) {
				props.handleClick();
			}
		};

		return {
			textToHide,
			isHidden,
			handleButtonClick,
		};
	},
	components: {
		InlineSvg,
	},
};
</script>

<style lang="scss" scoped>
.hint {
	display: flex;
	align-items: center;
	gap: 10px;
	margin: 40px 0;
	background: white;
	padding: 20px 10px;
	width: fit-content;
	padding-right: 60px;
	font-size: 18px;
	font-weight: 500;

	position: relative;

	&__button {
		position: absolute;
		width: 25px;
		height: 25px;
		top: 5px;
		right: 5px;
	}
}
</style>
