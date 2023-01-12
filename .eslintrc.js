module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		"plugin:vue/vue3-essential",
		"eslint:recommended",
		"plugin:prettier/recommended",
	],
	parserOptions: {
		parser: "@babel/eslint-parser",
	},
	rules: {
		indent: ["error", "tab"],
		"prettier/prettier": ["error", { useTabs: true, endOfLine: "auto" }],
	},
};
