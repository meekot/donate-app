const path = require('path')
const {EnvironmentPlugin, DefinePlugin} = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin') 
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
require('dotenv').config()

const srcDirName = 'vue' // src files dir default: src
const distDirName = 'public' // location index.html file
const assetsDirName = 'dist' // location js, css, fonts etc directories 



const devServerPort = process.env.FRONT_DEV_PORT || 8080

module.exports = (env, argv) => ({
  entry: {
    main: path.resolve(__dirname, srcDirName, 'main.js')
  },
  output: {
    filename:  path.join(assetsDirName, 'js', '[name].[contenthash:8].js'),
    path: path.resolve(__dirname, distDirName),
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
      API_HOST: '://' + (argv.mode === 'development'? process.env.SERVER_DEV_HOST + ':' + process.env.SERVER_PORT : process.env.FRONT_PROD_HOST )  + '/' + process.env.SERVER_BASE_API
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: path.join(assetsDirName, 'css', '[name].[contenthash:8].css')
    }),
    new HtmlWebpackPlugin({
      title: 'Your app name',
      template: path.resolve(__dirname, srcDirName, 'index.html'),
    })
  ],
  resolve: {
    alias: {
      'vue$': path.join('vue', 'dist',  argv.mode === 'development'?  'vue.esm-bundler.js' : 'vue.runtime.esm-bundler.js')
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
          filename: path.join(assetsDirName, 'fonts', '[name].[contenthash:8][ext]')
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
      directory: path.join(__dirname, distDirName),
    },
    port: devServerPort,
    historyApiFallback: true,
  },
})