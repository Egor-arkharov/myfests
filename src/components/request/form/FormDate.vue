<template>
	<h4 class="form__title">Choose date</h4>
	<form @submit.prevent="submitDate">
		<Datepicker
			v-model="festDate"
			range
			auto-range="2"
			:enable-time-picker="false"
			model-type="dd.MM.yyyy"
			@update:modelValue="handleDate"
			:min-date="new Date()"
			required
			placeholder="Select a Date"
			:partial-range="false"
		></Datepicker>
		<button
			class="form__button btn btn--form"
			:class="{ added: isChange }"
			type="submit"
			:disabled="!festDate"
		>
			{{ getButtonText() }}
		</button>
	</form>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

export default {
	emits: ["submit"],
	setup(_, { emit }) {
		const festDate = ref(null);
		const isChange = ref(false);
		const isAdded = ref(false);

		const handleDate = (modelData) => {
			if (modelData) {
				festDate.value = modelData;
			}
		};

		watch(festDate, () => {
			isChange.value = false;
		});

		const submitDate = () => {
			emit("submit", festDate.value);
			isChange.value = true;
			isAdded.value = true;
		};

		const getButtonText = () => {
			let btnText = "Add Date";

			if (isAdded.value) {
				btnText = "Date Added";
			}

			if (isAdded.value && !isChange.value) {
				btnText = "Update Date";
			}

			return btnText;
		};

		return {
			festDate,
			isChange,
			getButtonText,
			handleDate,
			submitDate,
		};
	},
	components: { Datepicker },
};
</script>
