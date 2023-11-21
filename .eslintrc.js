module.exports = {
	root: true,

	env: {
		node: true,
	},

	parserOptions: {
		parser: "@typescript-eslint/parser",
	},

	rules: {
		// indent: ["error", "tab"],
		"prettier/prettier": ["error", { useTabs: true, endOfLine: "auto" }],
	},

	extends: [
		"plugin:vue/vue3-essential",
		"eslint:recommended",
		"plugin:prettier/recommended",
		"@vue/typescript",
	],
};
