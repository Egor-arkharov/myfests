<template>
	<form @submit.prevent="submitBands">
		<div class="flex">
			<fieldset class="form__block">
				<legend class="form__legend">
					<h2 class="form__title">Хедлайнеры</h2>
				</legend>
				<ul class="form__list">
					<li
						class="form__item"
						v-for="(band, idx) in bandsFromGenre"
						:key="idx"
					>
						<label class="form__label form__label-check" :for="'head-' + band">
							<input
								class="form__input-checkbox"
								type="checkbox"
								:name="'head-' + band"
								:id="'head-' + band"
								:value="band"
								v-model="festHeadliners"
								:disabled="
									festHeadliners.length >= 3 &&
									festHeadliners.indexOf(band) === -1
								"
							/>
							<span class="form-more__checkbox"></span>
							{{ band }}
						</label>
					</li>
				</ul>
			</fieldset>

			<fieldset class="form__block">
				<legend class="form__legend">
					<h2 class="form__title">Группы</h2>
				</legend>
				<ul class="form__list">
					<li
						class="form__item"
						v-for="(band, idx) in bandsFromGenre"
						:key="idx"
					>
						<label class="form__label form__label-check" :for="band">
							<input
								class="form__input-checkbox"
								type="checkbox"
								:name="band"
								:id="band"
								:value="band"
								v-model="festBands"
								:disabled="festHeadliners.includes(band)"
							/>
							<span class="form-more__checkbox"></span>
							{{ band }}
						</label>
					</li>
				</ul>
			</fieldset>
		</div>

		<p>Хеды: {{ festHeadliners }}</p>
		<p>Группы: {{ festBands }}</p>

		<button
			class="btn primary"
			:disabled="festHeadliners.length !== 3 || festBands.length < 6"
		>
			Добавить Группы
		</button>
	</form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { onUpdated } from "@vue/runtime-core";

export default {
	emits: ["submit"],
	props: ["bandsFromGenre"],
	setup(_, { emit }) {
		const festBands = ref([]);
		const festHeadliners = ref([]);

		onUpdated(() => {
			festHeadliners.value.forEach((el) => {
				if (!festBands.value.includes(el)) {
					festBands.value.push(el);
				}
			});
		});

		const submitBands = () => {
			emit("submit", {
				bands: festBands.value,
				headliners: festHeadliners.value,
			});
		};

		return {
			festBands,
			festHeadliners,
			submitBands,
		};
	},
};
</script>

<style scoped lang="scss">
.flex {
	display: flex;
}
</style>
