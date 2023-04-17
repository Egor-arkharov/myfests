const { defineConfig } = require("vite");
const Dotenv = require("dotenv-webpack");

module.exports = defineConfig({
	transpileDependencies: true,
	css: {
		loaderOptions: {
			sass: {
				additionalData: '@import "@/assets/style/global/variables.scss";',
			},
		},
	},
	configureWebpack: {
		plugins: [
			new Dotenv({
				path: "./.env",
			}),
		],
	},
});
