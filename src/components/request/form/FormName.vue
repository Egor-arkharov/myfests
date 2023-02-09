<template>
	<h4 class="title__form">Choose name</h4>
	<form @submit.prevent="submitName" class="form">
		<input
			class="form__input"
			type="text"
			id="name"
			v-model="festName"
			placeholder="Min 3 symbols"
		/>
		<button class="form__button btn btn--form" :disabled="festName.length < 3">
			Add name
		</button>
	</form>
</template>

<script>
import { ref } from "@vue/reactivity";

export default {
	emits: ["submit"],
	setup(_, { emit }) {
		const festName = ref("");

		const submitName = () => {
			emit("submit", festName.value[0].toUpperCase() + festName.value.slice(1));
		};

		return {
			festName,
			submitName,
		};
	},
};
</script>

<style lang="scss" scoped>
$comp-color: $color-1;

// .form {
// 	&__input {
// 		border-color: $comp-color;
// 	}
// }

.btn--form {
	border-color: $comp-color;
}
</style>
