<template>
	<app-page :title="'404'">
		<p class="no-fests">
			This page doesn't exist or&nbsp;has been removed :(
			<span><router-link to="/" class="link">Home page</router-link></span>
		</p>
	</app-page>
</template>

<script>
import AppPage from "../components/ui/App/AppPage.vue";

export default {
	components: {
		AppPage,
	},
};
</script>
