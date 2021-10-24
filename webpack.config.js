const path = require('path')
const {EnvironmentPlugin, DefinePlugin} = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin') 
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
require('dotenv').config()

module.exports = (env, argv) => ({
  entry: {
    main: './vue/main.js'
  },
  output: {
    filename: './dist/js/[name].[contenthash:8].js',
    path: path.resolve(__dirname, 'public'),
    chunkFilename: '[name].[contenthash:8].js',
  },
  plugins: [
    require('unplugin-element-plus/webpack').default({
      // options
    }),
    new DefinePlugin({
      __VUE_OPTIONS_API__: JSON.stringify(false),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
    }),
    new EnvironmentPlugin({
      NODE_ENV: argv.mode,
      API_HOST: '://' + (argv.mode === 'development'? process.env.SERVER_DEV_HOST + ':' + process.env.SERVER_PORT : process.env.SERVER_HOST )  + '/' + process.env.SERVER_BASE_API
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './dist/css/[name].[contenthash:8].css'
    }),
    new HtmlWebpackPlugin({
      title: 'Donate App',
      template: path.resolve(__dirname, 'vue', 'index.html'),
    })
  ],
  resolve: {
    alias: {
      'vue$': argv.mode === 'development'? 'vue/dist/vue.esm-bundler.js' : 'vue/dist/vue.runtime.esm-bundler.js' // 'vue/dist/vue.common.js' для webpack 1
    }
  },
  module: {  
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: 'usage',
                  corejs: 3,
                },
              ],
            ],
          }
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.s?css$/,
        use: [
          'vue-style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false
            }
          },
          {
            loader: 'css-loader',
            options: {
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'autoprefixer'
                ],
            
              },
            }
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'dist/fonts/[name].[contenthash:8][ext]'
        }
      }
    ]
  },
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "multiple",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: -10,
          reuseExistingChunk: true,
          chunks: "all",
        },
      },
      chunks: 'all'    
    },
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: process.env.FRONT_DEV_PORT || 8080,
    historyApiFallback: true,
  },
})