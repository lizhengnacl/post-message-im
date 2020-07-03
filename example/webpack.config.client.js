const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/client.js',
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './views/client.html',
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    // compress: true,
    // useLocalIp: true,
    // host: '0.0.0.0',
    port: 9002,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
            extends: path.join(__dirname + '/.babelrc'),
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader', // 将 JS 字符串生成为 style 节点
          'css-loader', // 将 CSS 转化成 CommonJS 模块
          'sass-loader', // 将 Sass 编译成 CSS，默认使用 Node Sass
        ],
      },
    ],
  },
};
