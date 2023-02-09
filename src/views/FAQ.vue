<template>
	<div class="center">hiiii</div>

	<app-page title="F.A.Q.">
		<div class="boxes">
			<div class="box one"></div>
			<div class="box two"></div>
			<div class="box three"></div>
			<div class="box four"></div>
			<div class="box five"></div>
			<div class="box six"></div>
			<div class="box seven"></div>
			<div class="box eight"></div>
		</div>
	</app-page>
</template>

<script>
import AppPage from "../components/ui/AppPage.vue";

export default {
	components: {
		AppPage,
	},
};
</script>

<style lang="scss" scoped>
.boxes {
	display: flex;
	justify-content: space-between;
}

.box {
	width: 100px;
	height: 100px;
}

.one {
	background-color: $color-1;
}

.two {
	background-color: $color-2;
}

.three {
	background-color: $color-3;
}

.four {
	background-color: $color-4;
}

.five {
	background-color: $color-5;
}

.six {
	background-color: $color-6;
}

.seven {
	background-color: $color-7;
}

.eight {
	background-color: $color-8;
}
</style>
