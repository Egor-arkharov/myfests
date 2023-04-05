<template>
	<div class="modal-backdrop" @click="$emit('close')"></div>
	<div class="modal" :class="className">
		<h3 v-if="title">{{ title }}</h3>
		<slot />
	</div>
</template>

<script>
import { ref } from "@vue/runtime-core";
export default {
	emits: ["close"],
	props: ["title", "modalClass"],
	setup(props) {
		const className = ref(props.modalClass);

		return {
			className,
		};
	},
};
</script>

<style lang="scss" scoped>
.modal {
	position: fixed;

	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	padding: 20px 25px;

	background: $white-color;
	border-radius: 10px;
	overflow-y: auto;

	z-index: 2;

	color: $black-color;

	&--create {
		width: 85%;
		height: 90%;

		padding-bottom: 50px;
	}

	&--warn {
		width: 40%;
		text-align: center;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		justify-content: center;

		h3 {
			margin-bottom: 20px;
			font-family: $title-font;
		}
	}
}
.modal-backdrop {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.35);
	height: 100vh;
	z-index: 1;
}

h3 {
	font-size: 36px;
	text-align: center;
	margin-bottom: 50px;
	color: $black-color;
}

@media (max-width: #{map-get($breakpoints, 'lg')}) {
	.modal {
		&--create {
			width: 95%;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'md')}) {
	h3 {
		font-size: 32px;
	}
}

@media (max-width: #{map-get($breakpoints, 'sm')}) {
	h3 {
		font-size: 30px;
	}

	.modal {
		&--create {
			padding: 20px 15px;
		}

		&--warn {
			width: 85%;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'xs')}) {
	h3 {
		font-size: 28px;
		margin-bottom: 40px;
	}

	.modal {
		&--warn {
			width: 95%;
		}
	}
}
</style>
