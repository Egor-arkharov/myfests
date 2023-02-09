<template>
	<div class="modal-backdrop" @click="$emit('close')"></div>
	<div class="modal">
		<h3 v-if="title">{{ title }}</h3>

		<slot />
	</div>
</template>

<script>
export default {
	emits: ["close"],
	props: {
		title: {
			type: String,
		},
	},
};
</script>

<style lang="scss" scoped>
.modal {
	position: fixed;
	top: 60px;
	width: 90%;
	padding: 1rem;
	background: #fff;
	z-index: 1000;
	left: 50%;
	border-radius: 10px;
	transform: translateX(-50%);
	box-shadow: 2px 3px 10px rgba(0, 0, 0, 0.2);
	color: black;
	height: 90%;
	overflow: scroll;
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
	font-weight: 900;
	margin-bottom: 50px;
}
</style>
