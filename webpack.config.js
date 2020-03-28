const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

module.exports = {
	entry: './src/main.js',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': path.resolve(__dirname, 'src'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@style': path.resolve(__dirname, 'src/style'),
			'@assets': path.resolve(__dirname, 'src/assets'),
		},
		extensions: ['*', '.js', '.vue', '.json']
	},
	module: {
		rules: [
			{ test: /\.js$/, use: 'babel-loader' },
			{ test: /\.vue$/, use: 'vue-loader' },
			{
				test: /\.s[ac]ss$/i,
				use: [
					'vue-style-loader',
					// Creates `style` nodes from JS strings
					'style-loader',
					// Translates CSS into CommonJS
					'css-loader',
					// Compiles Sass to CSS
					'sass-loader',
				],
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader',
				],
			},
			{ test: /\.css$/, use: ['vue-style-loader', 'css-loader']},
		]
	},
	devServer: {
		open: false,
		hot: true,
		host: '0.0.0.0',
		port: 8000,
		historyApiFallback: true,// for vue router mode history
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			inject: false,// for vue router mode history
		}),
		new VueLoaderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
			_: 'lodash',
			moment: 'moment',
			Vue: ['vue/dist/vue.esm.js', 'default'],
			firebase: 'firebase/app',
			mapState: ['vuex', 'mapState'],
			mapGetters: ['vuex', 'mapGetters'],
			mapMutations: ['vuex', 'mapMutations'],
			mapActions: ['vuex', 'mapActions'],
		}),
	],
};
