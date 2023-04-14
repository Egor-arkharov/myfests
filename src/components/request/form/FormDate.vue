<template>
	<h4 class="form__title">Choose date</h4>
	<form @submit.prevent="submitDate">
		<Datepicker
			v-model="festDate"
			range
			auto-range="2"
			:enable-time-picker="false"
			:format="format"
			:preview-format="format"
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
		const options = { day: "2-digit", month: "2-digit", year: "numeric" };
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
			emit("submit", getDates(festDate.value));
			isChange.value = true;
			isAdded.value = true;
		};

		const getDates = (dates) => {
			const startDateString = getDateString(dates[0]);
			const endDateString = getDateString(dates[1]);
			const fullDateStart = dates[0];

			return [startDateString, endDateString, fullDateStart];
		};

		const format = (festDate) => {
			const startDateString = getDateString(festDate[0]);
			const endDateString = getDateString(festDate[1]);

			return startDateString + " - " + endDateString;
		};

		const getDateString = (date) => date.toLocaleDateString("ru-RU", options);

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
			format,
		};
	},
	components: { Datepicker },
};
</script>
