<template>
	<the-header />
	<router-view />
</template>

<script>
import TheHeader from "./components/TheHeader";

export default {
	components: {
		TheHeader,
	},
};
</script>
