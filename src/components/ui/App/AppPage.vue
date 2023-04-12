<template>
	<main class="main">
		<div class="main__wrapper center" :class="{ userFests: userFests }">
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
		userFests: {
			type: Boolean,
			required: false,
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
	}
}

@media (max-width: #{map-get($breakpoints, 'sm')}) {
	.main {
		&__wrapper {
			padding: 1rem;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'xs')}) {
	.userFests {
		padding: 1rem 0 0;
	}
}
</style>
