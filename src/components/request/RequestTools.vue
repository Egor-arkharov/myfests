<template>
	<div class="tools">
		<div class="tools__search">
			<input
				class="input"
				type="text"
				placeholder="Search for band (min 2 symbols)"
				v-model="bandName"
			/>
			<p v-if="searchedBands.length" class="tools__find">
				You mean "{{ searchedBands.join(" / ") }}"?
			</p>
		</div>
		<ul class="tools__button-list">
			<li class="tools__button-item">
				<button
					class="btn btn--with-icon btn--view-table"
					@click="$emit('changeView', 'table')"
				>
					<inline-svg
						:src="require(`@/assets/icons/view-table.svg`)"
						width="30"
						height="30"
					></inline-svg>
					<span>Table view</span>
				</button>
			</li>
			<li class="tools__button-item">
				<button
					class="btn btn--with-icon btn--view-list"
					@click="$emit('changeView', 'list')"
				>
					<inline-svg
						:src="require(`@/assets/icons/view-list.svg`)"
						width="30"
						height="30"
					></inline-svg>
					<span>List view</span>
				</button>
			</li>
			<li class="tools__button-item">
				<button class="btn btn--with-icon btn--refresh" @click="refresh">
					<inline-svg
						:src="require(`@/assets/icons/loading.svg`)"
						width="30"
						height="30"
					></inline-svg>
					<span>Refresh</span>
				</button>
			</li>
			<li class="tools__button-item">
				<button class="btn btn--with-icon btn--create" @click="modal = true">
					<inline-svg
						:src="require(`@/assets/icons/create.svg`)"
						width="30"
						height="30"
					></inline-svg>
					<span>Create</span>
				</button>
			</li>
		</ul>
	</div>

	<teleport to="body">
		<app-modal v-if="modal" title="Create own festival" @close="modal = false">
			<request-modal @created="modal = false"></request-modal>
		</app-modal>
	</teleport>
</template>

<script>
import InlineSvg from "vue-inline-svg";
import RequestModal from "@/components/request/RequestModal.vue";
import AppModal from "@/components/ui/AppModal.vue";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { useStore } from "vuex";

export default {
	emits: ["update:modelValue", "changeView"],
	props: ["modelValue"],
	setup(_, { emit }) {
		const store = useStore();
		const bandName = ref();
		const searchedBands = ref([]);
		const modal = ref();

		watch(bandName, () => {
			if (bandName.value.length >= 2) {
				const bands = store.state.bands;
				searchedBands.value = [];

				for (let arr in bands) {
					bands[arr].filter((band) =>
						band.toLowerCase().includes(bandName.value.toLowerCase()) &&
						!searchedBands.value.includes(band)
							? searchedBands.value.push(band)
							: ""
					);
				}

				if (searchedBands.value.length > 3) {
					searchedBands.value = searchedBands.value.slice(0, 3);
					searchedBands.value[3] = "...";
				}
			} else {
				searchedBands.value = [];
			}

			emit("update:modelValue", bandName.value);
		});

		const refresh = () => {
			localStorage.clear();

			store.state.bands = [];
			store.state.fests = [];

			store.state.load.cities = [];
			store.state.load.img = [];
			store.state.load.name = [];
			store.state.load.genre = [];
			store.state.load.freeImg = [];

			store.state.myfests = [];

			(async () => await store.dispatch("load/loadData"))();
		};

		return {
			bandName,
			searchedBands,
			modal,
			refresh,
		};
	},
	components: {
		RequestModal,
		AppModal,
		InlineSvg,
	},
};
</script>

<style lang="scss" scoped>
.tools {
	display: flex;
	margin: 20px 0;
	height: 45px;

	&__search {
		display: flex;
		width: 20%;
		position: relative;

		input {
			width: 100%;
		}
	}

	&__find {
		position: absolute;
		top: 50%;
		left: 105%;
		transform: translateY(-50%);

		white-space: nowrap;
	}

	&__button-list {
		display: flex;
		margin-left: auto;
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
</style>
