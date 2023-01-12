<template>
	<form @submit.prevent="submitName">
		<div class="form-control">
			<label for="name">Name</label>
			<input type="text" id="name" v-model="festName" />
		</div>

		<button class="btn primary" :disabled="!festName.length">
			Добавить имя
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
			emit("submit", festName.value);
		};

		return {
			festName,
			submitName,
		};
	},
};
</script>
