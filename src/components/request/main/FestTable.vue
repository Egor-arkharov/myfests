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
		<tbody>
			<tr v-for="(f, idx) in fests" :key="f.id">
				<td data-header="#">
					{{ idx + 1 }}
				</td>
				<td data-header="Name">
					<div :class="{ table__name: f.own }">
						<span>{{ f.name }}</span>
						<inline-svg
							v-if="f.own"
							:src="require('@/assets/icons/own.svg')"
							width="30"
							height="30"
						></inline-svg>
					</div>
				</td>
				<td data-header="Date">
					<div class="date">
						<span class="date__text">{{ f.date.start + "-" }}</span>
						<span class="date__text">{{ f.date.end }}</span>
					</div>
				</td>
				<td data-header="Place">
					{{ f.place.name + ", " + f.place.countryName }}
				</td>
				<td data-header="Genre">{{ f.genre }}</td>
				<td data-header="Headliners">
					<div class="headliners">
						<span v-for="(h, idx) in f.headliners" :key="idx"
							><span v-if="idx !== 0">&nbsp;</span>{{ h
							}}<span v-if="idx !== f.headliners.length - 1">,</span>
						</span>
					</div>
				</td>
				<td data-header="Full description">
					<router-link
						v-slot="{ navigate }"
						custom
						:to="{
							name: 'FestById',
							params: { id: f.id },
						}"
					>
						<button class="btn btn--open" @click="navigate">
							<span class="btn__text">Open</span>
						</button>
					</router-link>
				</td>
				<td data-header="Add">
					<button
						class="btn btn--add"
						@click="changeMyFests(f)"
						:class="{ remove: f.added }"
					>
						<span class="btn__text">{{ f.added ? "Remove" : "Add" }}</span>
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

.table {
	width: 100%;
	border-collapse: collapse;

	td, 
	th {
		padding: 10px 16px;
		text-align: center;
		border-bottom: solid 1px $grey-color;
	}

	th {
		font-family: $main-font-bold-ex;
		@include font-m;
	}

	td {
		@include font-m;
	}

	&__name {
		display: flex;
		justify-content: center;
		align-items: center;

		svg {
			margin-left: 3px;
			transform: translateY(-2px);
		}
	}
}

.date {
	width: fit-content;
	text-align: left;
	margin: 0 auto;

	&__text {
		display: block;
	}
}

.headliners {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;

	span {
		white-space: nowrap;
		line-height: 1.3;
	}
}


@media (max-width: #{map-get($breakpoints, 'lg')}) {
	.table {
		thead {
			display: none;
		}

		th,
		td {
			display: block;
		}

		tr {
			border-bottom: solid 1px $main-color;

			&:first-child {
				border-top: 1px solid $main-color;
			}
		}

		td {
			position: relative;
			text-align: right;
			border: none;

			&::before {
				content: attr(data-header) ": ";
				position: absolute;
				left: 0;

				font-family: $main-font-bold;
			}

			&:first-child {
				display: none;
			}
		}

		&__name {
			justify-content: flex-end;
		}
	}

	.date {
		width: auto;
		text-align: right;

		&__text {
			display: inline;
		}
	}

	.headliners {
		display: block;
	}
}

@media (max-width: #{map-get($breakpoints, 'xs')}) {
	.headliners {
		display: flex;
		width: 60%;
		margin-left: auto;
		justify-content: flex-end;
	}
}
</style>
