'use strict';

const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const cssnext = require('postcss-cssnext');
const postcssEach = require('postcss-each');
const args = require('yargs').argv;

const __DEV__ = process.env.NODE_ENV !== 'production';

var config = {
    entry: {
        'socialshares': [
            './src/socialshares.js',
        ],
    },
    output: {
        library: ['[name]'],
        libraryTarget: 'umd',
        umdNamedDefine: true,
        path: './build',
        filename: '[name].js',
    },
    plugins: [
        new webpack.BannerPlugin(
        'socialshares v{VERSION} - https://socialshar.es'
        ),
        new HtmlPlugin({
          template: './src/index.html',
          filename: 'index.html',
          inject: false,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(__DEV__ ? 'development' : 'production'),
            },
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel',
            },
            {
                test:   /\.css$/,
                loaders: ['style/useable?insertAt=top&singleton', 'css', 'postcss'],
            },
            {
                test:   /\.svg$/,
                loader: args['exclude-icons'] ? 'null' : 'svg-inline',
            },
        ],
    },
    postcss: function () {
        return [postcssEach, cssnext];
    },
};

if (__DEV__) {
    config.plugins.push(
        new OpenBrowserPlugin({
            url: 'http://localhost:3000',
        })
    );
    config.devtool = 'source-map';
}

module.exports = config;
