<template>
	<main class="main">
		<div class="main__wrapper center">
			<slot />
		</div>
	</main>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		document.title = `${props.title}`;
	},
};
</script>

<style lang="scss" scoped>
.main {
	&__wrapper {
		background-color: rgba(255, 255, 255, 0.8);
		color: $black-color;
		padding: 1rem 2rem;
		border-radius: 10px;

		// max-height: 90vh;
		// overflow-y: auto;
	}
}
</style>
