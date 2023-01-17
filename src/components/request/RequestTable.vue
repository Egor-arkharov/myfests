<template>
	<h4 v-if="fests.length === 0" class="text-center">Фестов пока нет</h4>
	<table v-else class="table">
		<thead>
			<tr>
				<th>#</th>
				<th>Название</th>
				<th>
					<div class="flex">
						<p>Дата</p>
						<button
							@click.prevent="sortFests('date', (sortByDate = !sortByDate))"
						>
							<inline-svg
								:src="require('@/assets/icons/sort.svg')"
								width="25"
								height="25"
								aria-label="Sort by date"
							></inline-svg>
						</button>
					</div>
				</th>
				<th>Место</th>
				<th>
					<div class="flex">
						<p>Жанр</p>
						<button
							@click.prevent="sortFests('genre', (sortByGenre = !sortByGenre))"
						>
							<inline-svg
								:src="require('@/assets/icons/sort.svg')"
								width="25"
								height="25"
								aria-label="Sort by date"
							></inline-svg>
						</button>
					</div>
				</th>
				<th>Хедлайнеры</th>
				<th>Полное описание</th>
				<th>Добавить</th>
			</tr>
		</thead>
		<tbody v-for="(f, idx) in fests" :key="f.id">
			<tr>
				<td>{{ idx + 1 }}</td>
				<td>{{ f.name }}</td>
				<td>{{ f.date.start + "-" + f.date.end }}</td>
				<td>{{ f.place.name + ", " + f.place.countryName }}</td>
				<td>{{ f.genre }}</td>
				<td>{{ f.headliners.join(", ") }}</td>
				<td>
					<router-link
						v-slot="{ navigate }"
						custom
						:to="{
							name: 'FestById',
							params: { id: f.id },
						}"
					>
						<button class="btn" @click="navigate">Открыть</button>
					</router-link>
				</td>
				<td>
					<button
						class="btn"
						@click="addToMyFests(f)"
						:class="f.added ? 'btn__delete' : 'btn__add'"
					>
						{{ f.added ? "Убрать" : "Добавить" }}
					</button>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import { useStore } from "vuex";
import InlineSvg from "vue-inline-svg";
import { ref } from "@vue/reactivity";

export default {
	props: ["fests"],
	setup() {
		const store = useStore();
		const sortByDate = ref(false);
		const sortByGenre = ref(false);

		const addToMyFests = (fest) => {
			fest.added = !fest.added;
			store.commit("addMyFest", fest);
		};

		const sortFests = (sortType, isSorted) => {
			store.commit("sortFests", {
				sortType,
				isSorted,
			});
		};

		return {
			addToMyFests,
			sortFests,
			sortByDate,
			sortByGenre,
		};
	},
	components: {
		InlineSvg,
	},
};
</script>

<style lang="scss" scoped>
.flex {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
