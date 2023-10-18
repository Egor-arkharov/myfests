<template>
	<h4 class="form__title">Choose name</h4>
	<form @submit.prevent="submitName" class="form">
		<input
			class="form__input form__input-name"
			type="text"
			id="name"
			v-model="festName"
			:maxlength="maxLength"
			placeholder="Min 3, Max 20 symbols"
			@keyup="validateInput"
			autocomplete="off"
			ref="festInput"
		/>
		<p v-if="similarName" class="form__error">
			Sorry, we&nbsp;already have festival with this name, please write another.
		</p>
		<button
			class="form__button btn btn--form"
			:class="{ added: isChange }"
			type="submit"
			:disabled="!isDisabled"
		>
			{{ getButtonText() }}
		</button>
	</form>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "@vue/reactivity";

export default {
	emits: ["submit"],
	setup(_, { emit }) {
		const store = useStore();
		const maxLength = 20;
		const festName = ref("");
		const isChange = ref(false);
		const isAdded = ref(false);
		const similarName = ref(false);
		const isDisabled = ref(false);

		const festInput = ref(null);

		const validateInput = () => {
			isChange.value = false;
			const inputValue = festInput.value.value;

			if (inputValue.length >= 20) {
				festInput.value.value = inputValue.slice(0, 20);
			}

			const isValidLength = inputValue.length >= 3 && inputValue.length <= 20;

			const similarFest = store.getters["fest/getFests"].find(
				(el) => el.name.toLowerCase() === inputValue.toLowerCase()
			);

			similarName.value = Boolean(similarFest);

			isDisabled.value = Boolean(isValidLength && !similarFest);
		};

		const submitName = () => {
			emit("submit", festName.value[0].toUpperCase() + festName.value.slice(1));
			isChange.value = true;
			isAdded.value = true;
			festInput.value.blur();
		};

		const getButtonText = () => {
			let btnText = "Add Name";

			if (isAdded.value) {
				btnText = "Name Added";
			}

			if (isAdded.value && !isChange.value) {
				btnText = "Update Name";
			}

			return btnText;
		};

		return {
			festName,
			similarName,
			submitName,
			isChange,
			getButtonText,
			validateInput,
			isDisabled,
			festInput,
			maxLength,
		};
	},
};
</script>

<style lang="scss" scoped>
.form {
	&__error {
		@include font-xs;
		margin-top: 10px;
		color: $color-1;
	}
}
</style>
