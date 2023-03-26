<template>
	<h4 class="form__title">Choose place</h4>
	<form @submit.prevent="submitPlace" class="form">
		<div class="form__block">
			<input
				class="form__input"
				list="countryList"
				placeholder="Select a Country"
				data-role="picker"
				@input="selectCountry"
			/>
			<datalist id="countryList">
				<option
					v-for="item in countriesWithCities"
					:value="item.name"
					:key="item.isoCode"
				></option>
			</datalist>
		</div>

		<div class="form__block" v-if="citiesByCode">
			<input
				class="form__input"
				list="cityList"
				placeholder="Select a City"
				data-role="picker"
				@input="selectCity"
			/>
			<datalist id="cityList">
				<option
					v-for="item in citiesByCode"
					:value="item.name"
					:key="item.isoCode"
				></option>
			</datalist>
		</div>

		<button
			class="form__button btn btn--form"
			:class="{ added: isChange }"
			type="submit"
			:disabled="!festPlace"
		>
			{{ getButtonText() }}
		</button>
	</form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { Country, City } from "country-state-city";
import { watch } from "@vue/runtime-core";

export default {
	emits: ["submit"],
	setup(_, { emit }) {
		const isChange = ref(false);
		const isAdded = ref(false);

		const allCountries = Country.getAllCountries();
		const countriesWithCities = allCountries.filter(
			(country) => City.getCitiesOfCountry(country.isoCode).length
		);

		const festPlace = ref("");
		const festCountry = ref("");
		const citiesByCode = ref("");

		const selectCountry = (e) => {
			const selectedCountry = countriesWithCities.find(
				(u) => u.name === e.target.value
			);

			if (selectedCountry) {
				citiesByCode.value = City.getCitiesOfCountry(selectedCountry.isoCode);
				festCountry.value = selectedCountry;
			} else {
				citiesByCode.value = "";
			}
		};

		const selectCity = (e) => {
			const selectedCity = citiesByCode.value.find(
				(u) => u.name === e.target.value
			);

			if (selectedCity) {
				selectedCity.countryName = festCountry.value.name;
				festPlace.value = selectedCity;
			} else {
				festPlace.value = "";
			}
		};

		watch(festPlace, () => {
			isChange.value = false;
		});

		const submitPlace = () => {
			emit("submit", festPlace.value);
			isChange.value = true;
			isAdded.value = true;
		};

		const getButtonText = () => {
			let btnText = "Add Place";

			if (isAdded.value) {
				btnText = "Place Added";
			}

			if (isAdded.value && !isChange.value) {
				btnText = "Update Place";
			}

			return btnText;
		};

		return {
			countriesWithCities,
			citiesByCode,
			festPlace,
			isChange,
			getButtonText,
			selectCountry,
			selectCity,
			submitPlace,
		};
	},
};
</script>

<style lang="scss" scoped>
$this-color: $color-4;
.form__input {
	&::-webkit-calendar-picker-indicator {
		transform: rotate(-90deg);
		color: $this-color;
	}
}
</style>
