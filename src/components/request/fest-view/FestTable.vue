<template>
	<table class="table">
		<thead>
			<tr>
				<th>#</th>
				<th>Name</th>
				<th>
					<div class="th-with-icon">
						<p>Date</p>
						<button
							@click.prevent="sortFests('date', (sortByDate = !sortByDate))"
							class="btn btn--icon"
							:class="{ rotate: rotateDateIcon }"
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
				<th>Place</th>
				<th>
					<div class="th-with-icon">
						<p>Genre</p>
						<button
							@click.prevent="sortFests('genre', (sortByGenre = !sortByGenre))"
							class="btn btn--icon"
							:class="{ rotate: rotateGenreIcon }"
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
				<th>Headliners</th>
				<th>Full page</th>
				<th>My fests</th>
			</tr>
		</thead>
		<tbody v-for="(f, idx) in fests" :key="f.id">
			<tr>
				<td data-header="#">{{ idx + 1 }}</td>
				<td data-header="Name">{{ f.name }}</td>
				<td data-header="Date">{{ f.date.start + "-" + f.date.end }}</td>
				<td data-header="Place">
					{{ f.place.name + ", " + f.place.countryName }}
				</td>
				<td data-header="Genre">{{ f.genre }}</td>
				<td data-header="Headliners">{{ f.headliners.join(", ") }}</td>
				<td data-header="Full description">
					<router-link
						v-slot="{ navigate }"
						custom
						:to="{
							name: 'FestById',
							params: { id: f.id },
						}"
					>
						<button class="btn btn-table btn-table--left" @click="navigate">
							<span class="btn__text">Open</span>
						</button>
					</router-link>
				</td>
				<td data-header="Add">
					<button
						class="btn btn-table btn-table--right"
						@click="changeMyFests(f)"
						:class="f.added ? 'btn__delete' : 'btn__add'"
					>
						<span class="btn__text">{{ f.added ? "Delete" : "Add" }}</span>
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
		const rotateDateIcon = ref(false);
		const rotateGenreIcon = ref(false);

		const changeMyFests = (fest) => store.commit("changeMyFests", fest);

		const sortFests = (sortType, isSorted) => {
			store.commit("sortFests", {
				sortType,
				isSorted,
			});

			/* eslint-disable prettier/prettier */
			switch (sortType) {
			case "date":
				rotateDateIcon.value = true;
				setTimeout(() => {
					rotateDateIcon.value = false
				}, 300)
				break;
			case "genre":
				rotateGenreIcon.value = true;
				setTimeout(() => {
					rotateGenreIcon.value = false
				}, 300)
				break;
			}
		};

		return {
			changeMyFests,
			sortFests,
			sortByDate,
			sortByGenre,
			rotateDateIcon,
			rotateGenreIcon,
		};
	},
	components: {
		InlineSvg,
	},
};
</script>

<style lang="scss" scoped>
.rotate {
	animation: rotate 0.2s ease-in;
}

.btn__delete {
	border-color: $color-1;

	.btn__text {
		color: $color-1;
	}

	&:before {
		background-color: $color-1;
	}
}

@keyframes rotate {
	from {
		transform: rotate(0turn);
	}
	to {
		transform: rotate(0.5turn);
	}
}

.th-with-icon {
	display: flex;
	justify-content: center;
	align-items: center;

	.btn--icon {
		margin-left: 5px;
	}
}

table {
	border-collapse: collapse;
	width: 100%;
}

.table {
	width: 100%;
	border-collapse: collapse;
}

.table th {
	padding: 0.5rem 1rem;
	text-align: center;
}

.table td {
	padding: 0.5rem 1rem;
}

.table tbody td {
	text-align: center;
}

tbody,
thead,
tr {
	display: block;
}

thead {
	position: absolute;
	left: -9999rem;
}

th {
	text-align: center;
}

th,
td {
	display: block;
	padding: 1ex 1ch;
}
td:before {
	content: attr(data-header) ": ";
}

tr {
	border-bottom: solid 1px teal;
}
tbody tr:first-of-type {
	border-top: solid 1px teal;
}

tbody tr:nth-of-type(even) {
	background: aliceblue;
}

td {
	position: relative;
	text-align: right !important;

	&::before {
		position: absolute;
		left: 0;
	}
}

@media (min-width: 900px) {
	table,
	thead,
	tbody,
	tr,
	td,
	th {
		display: revert;
		position: revert;
	}

	td {
		text-align: center !important;
	}

	td:before {
		content: "";
	}
}
</style>
