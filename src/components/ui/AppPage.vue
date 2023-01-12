<template>
	<div class="card center">
		<div class="card__header">
			<h1 class="card__title">
				{{ title }}
			</h1>

			<slot name="button" />
		</div>

		<slot />
	</div>
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
.card {
	border-radius: 10px;

	&__header {
		display: flex;
		justify-content: space-between;
	}

	&__title {
		color: black;
	}
}
</style>
