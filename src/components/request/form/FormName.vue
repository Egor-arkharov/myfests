<template>
	<h4 class="form__title">Choose name</h4>
	<form @submit.prevent="submitName" class="form">
		<input
			class="form__input"
			type="text"
			id="name"
			v-model="festName"
			maxlength="20"
			placeholder="Min 3, Max 20 symbols"
		/>
		<p v-if="similarName" class="form__error">
			Sorry, we&nbsp;already have festival with this name, please write another.
		</p>
		<button
			class="form__button btn btn--form"
			:class="{ added: isChange }"
			type="submit"
			:disabled="festName.length < 3 || festName.length > 20 || similarName"
		>
			{{ getButtonText() }}
		</button>
	</form>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

export default {
	emits: ["submit"],
	setup(_, { emit }) {
		const store = useStore();
		const festName = ref("");
		const isChange = ref(false);
		const isAdded = ref(false);
		const similarName = ref(false);

		watch(festName, () => {
			const similarFest = store.getters["getFests"].find(
				(el) => el.name.toLowerCase() === festName.value.toLowerCase()
			);

			similarFest ? (similarName.value = true) : (similarName.value = false);

			isChange.value = false;
		});

		const submitName = () => {
			emit("submit", festName.value[0].toUpperCase() + festName.value.slice(1));
			isChange.value = true;
			isAdded.value = true;
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
