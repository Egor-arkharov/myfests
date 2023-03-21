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

		<button
			class="form__button btn btn--form"
			:class="{ added: isChange }"
			type="submit"
			:disabled="!festGenre"
		>
			{{ getButtonText() }}
		</button>

		<p v-if="isAdded && !isChange" class="note">
			Note: if&nbsp;you update genre, it&nbsp;will update all bands in&nbsp;the
			next step!
		</p>
	</form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

export default {
	emits: ["submit"],
	setup(_, { emit }) {
		const festGenre = ref("");
		const isChange = ref(false);
		const isAdded = ref(false);

		watch(festGenre, () => {
			isChange.value = false;
		});

		const submitGenre = () => {
			emit("submit", festGenre.value);
			isChange.value = true;
			isAdded.value = true;
		};

		const getButtonText = () => {
			let btnText = "Add Genre";

			if (isAdded.value) {
				btnText = "Genre Added";
			}

			if (isAdded.value && !isChange.value) {
				btnText = "Update Genre";
			}

			return btnText;
		};

		return {
			festGenre,
			isChange,
			isAdded,
			getButtonText,
			submitGenre,
		};
	},
};
</script>

<style lang="scss" scoped>
.option--hide {
	display: none;
}

.note {
	margin-top: 5px;
}
</style>
