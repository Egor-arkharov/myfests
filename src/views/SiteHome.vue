<template>
	<app-page title="All fests">
		<template #button>
			<button class="btn primary" @click="modal = true">Создать</button>
		</template>

		<request-table :fests="fests"></request-table>

		<teleport to="body">
			<app-modal
				v-if="modal"
				title="Create own festival"
				@close="modal = false"
			>
				<request-modal @created="modal = false"></request-modal>
			</app-modal>
		</teleport>
	</app-page>
</template>

<script>
import AppPage from "../components/ui/AppPage.vue";
import RequestTable from "../components/request/RequestTable.vue";
import RequestModal from "../components/request/RequestModal.vue";
import AppModal from "../components/ui/AppModal.vue";
import { onMounted, ref } from "@vue/runtime-core";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";

export default {
	setup() {
		const store = useStore();
		const modal = ref();

		if (!store.getters["getFests"].length) {
			onMounted(async () => {
				await store.dispatch("loadCities");
			});
		}

		const fests = computed(() => store.getters["getFests"]);

		return {
			fests,
			modal,
		};
	},
	components: {
		AppPage,
		RequestTable,
		RequestModal,
		AppModal,
	},
};
</script>
