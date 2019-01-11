const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const os = require('os')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCss = require('optimize-css-assets-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        loading: resolve('src/loading/index.js'),
        scroller: resolve('src/scroller/index.js')
    },
    output: {
        path: resolve('dist'),
        filename: '[name].umd.js',
        libraryExport: 'default',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                include: [
                    resolve('src')
                ],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }]
            },
            {
                test: /.less$/,
                use: [
                    "css-loader",
                    "less-loader"
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(['../dist'], {
            allowExternal: true
        }),
        new OptimizeCss({
            assetNameRegExp: /[\d\D]\.less$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } }
        })
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                test: /\.js$/,
                cache: true,
                parallel: os.cpus().length - 1,
                uglifyOptions: {
                    ecma: 8,
                    output: {
                      beautify: false,
                    },
                    compress: {
                        drop_console: false
                    }
                }
            })
        ]
    }
}