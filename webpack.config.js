const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
	entry: {
		app: "./src/app.ts",
	},

	output: {
		filename: "[name].js",
		path: __dirname + "/dist"
	},

	resolve: {
		extensions: [".ts", ".js", ".tsx", ".json"],
		modules: [
			path.resolve(__dirname, "src"),
		]
	},

	module: {
		rules: [
			{ test: /\.(png|jpg|gif)$/, use: [{ loader: "file-loader", options: {} }], },
			{ test: /\.tsx?$/, loader: "ts-loader" },
		]
	},

	plugins: [
		new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
		new CopyPlugin({
			patterns: [
				{ from: "./src/favicon.ico", to: ".", flatten: false },
				{ from: "./src/**/*.html", to: ".", flatten: true },
			]
		}),
	],

	externals: {
	},

	watchOptions: {
		poll: 5000,
	}
};