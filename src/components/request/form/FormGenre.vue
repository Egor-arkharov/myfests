<template>
	<h4 class="title__form">Choose genre</h4>
	<form @submit.prevent="submitGenre" class="form">
		<select class="form__input" id="genre" v-model="festGenre">
			<option class="option--hide" value="" disabled selected>
				Select Genre
			</option>
			<option value="Pop">Pop</option>
			<option value="Electronic">Electronic</option>
			<option value="Rock">Rock</option>
			<option value="Mix">Mix</option>
		</select>

		<button class="form__button btn btn--form" :disabled="!festGenre">
			Add Genre
		</button>
	</form>
</template>

<script>
import { ref } from "@vue/reactivity";

export default {
	emits: ["submit"],
	setup(_, { emit }) {
		const festGenre = ref("");

		const submitGenre = () => {
			emit("submit", festGenre.value);
		};

		return {
			festGenre,
			submitGenre,
		};
	},
};
</script>

<style lang="scss" scoped>
.option--hide {
	display: none;
}
</style>
