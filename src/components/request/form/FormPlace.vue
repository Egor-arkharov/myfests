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
				ref="countryInput"
			/>
			<datalist id="countryList">
				<option
					v-for="item in countriesWithCities"
					:value="item.name"
					:key="item.isoCode"
				></option>
			</datalist>
			<button
				v-if="festCountry"
				class="btn btn--icon btn--icon-place"
				@click.prevent="clearCountries"
			>
				<inline-svg
					:src="require(`@/assets/icons/cross.svg`)"
					width="22"
					height="22"
				></inline-svg>
			</button>
		</div>

		<div class="form__block" v-if="citiesByCode">
			<input
				class="form__input"
				list="cityList"
				placeholder="Select a City"
				data-role="picker"
				@input="selectCity"
				ref="cityInput"
			/>
			<datalist id="cityList">
				<option
					v-for="item in citiesByCode"
					:value="item.name"
					:key="item.isoCode"
				></option>
			</datalist>
			<button
				v-if="festPlace"
				class="btn btn--icon btn--icon-place"
				@click.prevent="clearCities"
			>
				<inline-svg
					:src="require(`@/assets/icons/cross.svg`)"
					width="22"
					height="22"
				></inline-svg>
			</button>
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
import InlineSvg from "vue-inline-svg";

export default {
	emits: ["submit"],
	setup(_, { emit }) {
		const isChange = ref(false);
		const isAdded = ref(false);

		const countryInput = ref(null);
		const cityInput = ref(null);

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
				countryInput.value.blur();
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
				cityInput.value.blur();
			} else {
				festPlace.value = "";
			}
		};

		const clearCountries = () => {
			festCountry.value = "";
			countryInput.value.value = "";
			festPlace.value = "";
			cityInput.value.value = "";
			countryInput.value.focus();
			countryInput.value.click();
		};

		const clearCities = () => {
			festPlace.value = "";
			cityInput.value.value = "";
			cityInput.value.focus();
			cityInput.value.click();
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
			festCountry,
			festPlace,
			isChange,
			countryInput,
			cityInput,
			clearCountries,
			clearCities,
			getButtonText,
			selectCountry,
			selectCity,
			submitPlace,
		};
	},
	components: {
		InlineSvg,
	},
};
</script>

<style lang="scss" scoped>
$this-color: $color-4;
.form__input {
	&::-webkit-calendar-picker-indicator {
		// transform: rotate(-90deg);
		// color: $this-color;
		display: none !important;
	}
}

.form__block {
	position: relative;
}

.form__input {
	padding-right: 40px;
}

.btn--icon {
	position: absolute;
	right: 5px;
	top: 50%;
	transform: translateY(-50%);

	@include hover {
		border-color: $this-color;
	}
}
</style>
