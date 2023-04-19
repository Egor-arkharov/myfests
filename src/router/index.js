import { createRouter, createWebHistory } from "vue-router";
import SiteHome from "../views/SiteHome.vue";
import FAQ from "../views/FAQ.vue";
import UserFests from "../views/UserFests.vue";
import FestById from "../views/FestById.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: SiteHome,
	},
	{
		path: "/fest/:id",
		name: "FestById",
		component: FestById,
	},
	{
		path: "/my-fests",
		name: "Myfests",
		component: UserFests,
	},
	{
		path: "/faq",
		name: "F.A.Q.",
		component: FAQ,
	},
	{
		path: "/:catchAll(.*)",
		name: "Not Found",
		component: NotFound,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
	linkActiveClass: "active",
	linkExactActiveClass: "active",
});

router.beforeEach((to, from, next) => {
	next();
	if (window.innerWidth < 600) {
		setTimeout(() => {
			document.body.classList.remove("menu-open");
		}, 100);
	}
});

export default router;
