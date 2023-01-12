<template>
	<h4 v-if="fests.length === 0" class="text-center">Фестов пока нет</h4>
	<table v-else class="table">
		<thead>
			<tr>
				<th>#</th>
				<th>Название</th>
				<th>Дата</th>
				<th>Место</th>
				<th>Жанр</th>
				<th>Хедлайнеры</th>
				<th>Полное описание</th>
				<th>Добавить</th>
			</tr>
		</thead>
		<tbody v-for="(f, idx) in fests" :key="f.id">
			<tr>
				<td>{{ idx + 1 }}</td>
				<td>{{ f.name }}</td>
				<td>{{ f.date }}</td>
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
export default {
	props: ["fests"],
	setup() {
		const store = useStore();

		const addToMyFests = (fest) => {
			fest.added = !fest.added;
			store.dispatch("addMyFests", fest);
		};

		return {
			addToMyFests,
		};
	},
};
</script>
