const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');
const resolve = dir => path.resolve(__dirname, dir);

module.exports = (env = { }, argv) => {

  const prodMode = env.production;
  const analyzeMode = env.analyze;

  const isProduction = prodMode || analyzeMode;

  const config = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'nosources-source-map' : 'eval',
    entry: {
      index: './src/index'
    },
    output: {
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      chunkFilename: isProduction ? '[id].[contenthash].js' : '[id].js',
      publicPath: '/',
      path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      hot: true,
      port: 3000,
      host: "0.0.0.0",
      historyApiFallback: true,
      open: 'Chrome'
    },
    optimization: {
      splitChunks: {
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 6,
        maxInitialRequests: 4,
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|axios)[\\/]/,
            name: 'vendor',
            chunks: 'all',
          }
        },
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: isProduction ? '[name].[contenthash].css' : '[name].css',
        chunkFilename: isProduction ? '[name].[contenthash].css' : '[name].css'
      }),
      new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        title: 'online shopping'
      }),
      new ForkTsCheckerWebpackPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [
                [
                  '@babel/preset-env',
                  { targets: { browsers: 'last 2 versions' } } // or whatever your project requires
                ],
                '@babel/preset-typescript',
                '@babel/preset-react',
              ],
              plugins: [
                // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
                '@babel/plugin-syntax-dynamic-import',
                ['import', { libraryName: 'antd', style: true,  libraryDirectory: "es"}], // `style: true` 会加载 less 文件
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                'react-hot-loader/babel'
              ]
            }
          }
        },
        {
          test: /\.less$/,
          exclude: /node_modules/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !isProduction,
              },
            },
            'css-loader',
            'postcss-loader',
            'less-loader'
          ],
        },
        {
          test: /\.less$/,
          include: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'less-loader', // compiles Less to CSS
              options: {
                sourceMap: true,
                javascriptEnabled: true
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        'react-dom': '@hot-loader/react-dom'
      }
    }
  };
  if(!isProduction){
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
  };
  if(isProduction){
    delete config.devServer;
    delete config.resolve.alias;
    config.plugins.pop();
    config.module.rules[0].use.options.plugins.pop();
  };
  return config;
};
