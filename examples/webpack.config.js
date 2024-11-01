const path = require('path');
const ScriptingWebpackPlugin = require('./dist/index.js')

module.exports = {
	mode: 'development',
	entry: {
    		entry: path.resolve(__dirname, 'test.js'),

	},
	plugins: [
  		new ScriptingWebpackPlugin({
			scripts: {
				onShouldEmit: [{
					shell: 'python',
					script: './scripts/script.py'
				}],
				onAfterEmit: [{
					shell: 'node',
					script: './scripts/script.js'	
				}]
			},
			shell: 'zsh',
			verbose: true,
		}) 
  	],
  	output: {
    		filename: '[name].pack.js',
    		publicPath: '/',
    		clean: true,
		path: path.resolve(__dirname, 'dev')
  	},
  	module: {
    		rules: [{
        		test: /\.(js)$/,
        		exclude: /node_modules/,
      		},{
        		test: /\.(png|jpg|jpeg|gif)$/i,
        		type: 'asset/resource'
      		},{
        		test: /\.json$/,
        		type: 'json'
      		},{
        		test: /\.(woff|woff2|eot|ttf|otf)$/i,
        		type: 'asset/resource'
      		}]
  	},
  	resolve: {

  	}
};
