const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  mode: 'development',
  // mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  target: 'node',
  entry: slsw.lib.entries,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@root': path.resolve(__dirname, './'),
      '@shared': path.resolve(__dirname, '../../shared'),
    },
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  devtool: 'source-map',
  externals: ['aws-sdk'],
  stats: slsw.lib.webpack.isLocal ? 'errors-only' : 'normal',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [__dirname],
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
};
