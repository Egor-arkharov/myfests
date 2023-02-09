<template>
	<div class="card center">
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
