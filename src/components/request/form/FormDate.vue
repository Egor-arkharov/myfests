<template>
	<form @submit.prevent="submitDate">
		<Datepicker
			v-model="date"
			range
			:enable-time-picker="false"
			max-range="2"
			model-type="dd.MM.yyyy"
			@update:modelValue="handleDate"
			:min-date="new Date()"
			required
			placeholder="Select a Date. Can't have more than 2 days in between"
			:partial-range="false"
		></Datepicker>
		<button type="submit" :disabled="!date">Submit form</button>
	</form>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss";
import { ref } from "@vue/reactivity";

export default {
	emits: ["submit"],
	setup(_, { emit }) {
		const date = ref(null);

		const handleDate = (modelData) => {
			if (modelData) {
				date.value = modelData;
			}
		};

		const submitDate = () => {
			emit("submit", date.value);
		};

		return {
			date,
			handleDate,
			submitDate,
		};
	},
	components: { Datepicker },
};
</script>
