<template>
	<h4 class="title__form">Choose date</h4>
	<form @submit.prevent="submitDate">
		<Datepicker
			v-model="date"
			range
			auto-range="2"
			:enable-time-picker="false"
			model-type="dd.MM.yyyy"
			@update:modelValue="handleDate"
			:min-date="new Date()"
			required
			placeholder="Select a Date. Can't have more than 2 days in between"
			:partial-range="false"
		></Datepicker>
		<button class="form__button btn btn--form" type="submit" :disabled="!date">
			Add date
		</button>
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
