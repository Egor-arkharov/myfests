<template>
	<form @submit.prevent="submitGenre">
		<div class="form-control">
			<label for="genre">Жанр</label>
			<select id="genre" v-model="festGenre">
				<option value="Pop">Pop</option>
				<option value="Electronic">Electronic</option>
				<option value="Rock">Rock</option>
				<option value="All">All</option>
			</select>
		</div>

		<button class="btn primary" :disabled="!festGenre">Добавить жанр</button>
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
