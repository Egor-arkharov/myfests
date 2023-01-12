import { createRouter, createWebHistory } from "vue-router";
import SiteHome from "../views/SiteHome.vue";
import FAQ from "../views/FAQ.vue";
import MyContacts from "../views/MyContacts.vue";
import UserFests from "../views/UserFests.vue";
import FestById from "../views/FestById.vue";

const routes = [
	{
		path: "/",
		name: "home",
		component: SiteHome,
	},
	{
		path: "/fest/:id",
		name: "FestById",
		component: FestById,
	},
	{
		path: "/my-fests",
		component: UserFests,
	},
	{
		path: "/faq",
		component: FAQ,
	},
	{
		path: "/contacts",
		component: MyContacts,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
	linkActiveClass: "active",
	linkExactActiveClass: "active",
});

export default router;
