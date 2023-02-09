<template>
	<h4 class="title__form">Choose place</h4>
	<form @submit.prevent="submitPlace" class="form">
		<div class="form__block">
			<input
				class="form__input"
				list="countryList"
				placeholder="Select a Country"
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

		<button class="form__button btn btn--form" :disabled="!festPlace">
			Add place
		</button>
	</form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { Country, City } from "country-state-city";

export default {
	emits: ["submit"],
	setup(_, { emit }) {
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

		const submitPlace = () => {
			emit("submit", festPlace.value);
		};

		return {
			countriesWithCities,
			citiesByCode,
			festPlace,
			selectCountry,
			selectCity,
			submitPlace,
		};
	},
};
</script>
