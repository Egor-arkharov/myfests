<template>
	<div
		class="tools"
		:style="!isFests ? 'opacity: 0.6;' : ''"
		:class="{ find: searchedBands.length }"
	>
		<div class="tools__search">
			<input
				class="tools__input"
				type="text"
				placeholder="Search for band (min 2 symbols)"
				v-model="bandName"
				ref="input"
				@keyup="validateInput"
			/>
			<p v-if="searchedBands.length" class="tools__find">
				You mean "{{ searchedBands.join(" / ") }}"?
			</p>
		</div>
		<ul class="tools__button-list">
			<li class="tools__button-item" v-if="desktopView">
				<button
					class="btn btn--with-icon btn--view-table"
					@click="$emit('changeView', 'table')"
					:class="{ active: view === 'table' }"
				>
					<inline-svg
						:src="require(`@/assets/icons/tools/table.svg`)"
						width="30"
						height="30"
					></inline-svg>
					<span>Table view</span>
				</button>
			</li>
			<li class="tools__button-item" v-if="desktopView">
				<button
					class="btn btn--with-icon btn--view-list"
					@click="$emit('changeView', 'list')"
					:class="{ active: view === 'list' }"
				>
					<inline-svg
						:src="require(`@/assets/icons/tools/list.svg`)"
						width="30"
						height="30"
					></inline-svg>
					<span>List view</span>
				</button>
			</li>
			<li
				class="tools__button-item"
				v-if="!desktopView"
				@click.prevent="sortFests('date', (sortByDate = !sortByDate))"
			>
				<button class="btn btn--with-icon">
					<inline-svg
						:class="{ rotate: rotateDateIcon }"
						:src="require(`@/assets/icons/sort.svg`)"
						width="30"
						height="30"
					></inline-svg>
					<span>Sort by&nbsp;Date</span>
				</button>
			</li>
			<li class="tools__button-item" v-if="!desktopView">
				<button
					class="btn btn--with-icon"
					@click.prevent="sortFests('genre', (sortByGenre = !sortByGenre))"
				>
					<inline-svg
						:class="{ rotate: rotateGenreIcon }"
						:src="require(`@/assets/icons/sort.svg`)"
						width="30"
						height="30"
					></inline-svg>
					<span>Sort by&nbsp;Genre</span>
				</button>
			</li>
			<li class="tools__button-item">
				<button class="btn btn--with-icon btn--refresh" @click="refresh">
					<inline-svg
						:src="require(`@/assets/icons/tools/loading.svg`)"
						width="30"
						height="30"
					></inline-svg>
					<span>Refresh</span>
				</button>
			</li>
			<li class="tools__button-item">
				<button class="btn btn--with-icon btn--create" @click="openModalCreate">
					<inline-svg
						:src="require(`@/assets/icons/tools/create.svg`)"
						width="30"
						height="30"
					></inline-svg>
					<span>Create</span>
				</button>
			</li>
		</ul>
	</div>

	<teleport to="body">
		<app-modal
			v-if="modal"
			@close="modal = false"
			:modalClass="modalClass"
			:title="modalTitle"
		>
			<component :is="modalView + 'Modal'" @close="modal = false" />
		</app-modal>
	</teleport>
</template>

<script>
import InlineSvg from "vue-inline-svg";
import AppModal from "@/components/ui/App/AppModal.vue";
import { debounce } from "vue-debounce";
import { ref } from "@vue/reactivity";
import { computed, onUpdated } from "@vue/runtime-core";
import { useStore } from "vuex";

import createModal from "./modal/createModal.vue";
import warnModal from "./modal/warnModal.vue";

export default {
	emits: ["update:modelValue", "changeView"],
	props: ["modelValue", "view"],
	setup(_, { emit }) {
		const store = useStore();
		const bandName = ref();
		const searchedBands = ref([]);

		const input = ref(null);

		const sortByDate = ref(false);
		const sortByGenre = ref(false);
		const rotateDateIcon = ref(false);
		const rotateGenreIcon = ref(false);

		const modal = ref();
		const modalView = ref("");
		const modalClass = ref("");
		const modalTitle = ref("");

		const validateInput = () => {
			bandName.value = input.value.value;

			if (bandName.value.length >= 2) {
				const fests = store.getters["getFests"];
				searchedBands.value = [];

				fests.forEach((fest) => {
					fest.bands.filter((band) => {
						band.toLowerCase().includes(bandName.value.toLowerCase()) &&
						!searchedBands.value.includes(band)
							? searchedBands.value.push(band)
							: "";
					});
				});

				if (searchedBands.value.length > 3) {
					searchedBands.value = searchedBands.value.slice(0, 3);
					searchedBands.value[3] = "...";
				}
			} else {
				searchedBands.value = [];
			}

			emit("update:modelValue", bandName.value);
		};

		const refresh = () => {
			if (!store.getters["getWarnModal"]) {
				modal.value = true;
				modalView.value = "warn";
				modalClass.value = "modal--warn";
				modalTitle.value = "Note";

				store.commit("removeWarnModal");
			} else {
				bandName.value = "";

				store.dispatch("clearAllData");
			}
		};

		const openModalCreate = () => {
			modal.value = true;
			modalView.value = "create";
			modalClass.value = "modal--create";
			modalTitle.value = "Create own festival";
		};

		onUpdated(() => {
			modal.value
				? document.body.classList.add("body--modal")
				: document.body.classList.remove("body--modal");
		});

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

		const isFests = computed(() => store.getters["getFests"].length);

		const breakpointLG = store.state.breakpoints.lg;
		const desktopView = ref(window.innerWidth >= breakpointLG);

		window.addEventListener(
			"resize",
			debounce(() => {
				desktopView.value = window.innerWidth >= breakpointLG;
			}, 100)
		);

		return {
			bandName,
			input,
			modalView,
			searchedBands,
			modal,
			modalClass,
			modalTitle,
			isFests,
			desktopView,
			sortByDate,
			sortByGenre,
			rotateDateIcon,
			rotateGenreIcon,
			refresh,
			openModalCreate,
			sortFests,
			validateInput,
		};
	},
	components: {
		AppModal,
		InlineSvg,
		createModal,
		warnModal,
	},
};
</script>

<style lang="scss" scoped>
$tools-colors: $color-5, $color-6, $color-8, $color-2;
.tools {
	display: flex;
	justify-content: space-between;
	margin: 20px 0;
	// height: 45px;

	&__search {
		display: flex;
		align-items: center;
	}

	&__input {
		width: 250px;
		height: 100%;
		padding: 0 5px;
		border: 1px solid $black-color;
		outline: none;
	}

	&__find {
		white-space: nowrap;
		margin-left: 10px;
	}

	&__button-list {
		display: flex;
	}

	&__input,
	&__button-item {
		height: 45px;
	}

	&__button-item {
		margin-right: 5px;

		&:last-child {
			margin-right: 0;
		}

		button {
			height: 100%;
		}
	}
}

.tools__button-list {
	@for $i from 1 through length($tools-colors) {
		.tools__button-item:nth-child(#{$i}) button {
			border-color: nth($tools-colors, $i);
			color: nth($tools-colors, $i);

			svg {
				fill: nth($tools-colors, $i);
			}

			@include hover {
				background-color: nth($tools-colors, $i);
				color: $white-color;

				svg {
					fill: $white-color;
				}
			}

			&.active {
				cursor: auto;
				background-color: nth($tools-colors, $i);
				color: $white-color;

				svg {
					fill: $white-color;
				}
			}
		}
	}
}

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

@media (max-width: #{map-get($breakpoints, 'xxl')}) {
	.tools {
		&__search {
			align-items: flex-start;
			flex-direction: column;

			width: 250px;
			max-width: 250px;
		}

		&__find {
			margin-left: 0;
			margin-top: 10px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'md')}) {
	.tools {
		flex-direction: column;

		&__search {
			width: 100%;
			max-width: unset;
		}

		&__input {
			width: 100%;
		}

		&__button-list {
			order: -1;
			margin-bottom: 20px;
			width: 100%;
			justify-content: space-between;
		}

		&__button-item {
			margin-right: 0;
			width: 20%;

			.btn {
				width: 100%;
			}
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'sm')}) {
	.tools {
		&__button-list {
			flex-wrap: wrap;
		}

		&__button-item {
			width: 45%;
			margin-bottom: 10px;

			&:nth-child(even) {
				.btn {
					margin-left: auto;
				}
			}

			.btn {
				width: 80%;
			}
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'xs')}) {
	.tools {
		&__find {
			white-space: normal;
		}

		&__button-item {
			.btn {
				width: 100%;
			}
		}
	}
}
</style>
