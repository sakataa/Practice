var webpack = require('webpack');
var pathConfig = require('../config/path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var cssRootPath = pathConfig.cssPaths.build;

function generatePlugins(environment) {
    var commonPlugins = [
        new CleanWebpackPlugin([cssRootPath], {
            root: process.cwd(),
            exclude: ['fonts', 'images', 'dev', 'pro']
        }),
        new CleanWebpackPlugin([`${cssRootPath}/dev/pages`], {
            root: process.cwd(),
            exclude: ['betlist']
        }),
        new CleanWebpackPlugin([`${cssRootPath}/pro/pages`], {
            root: process.cwd(),
            exclude: ['betlist']
        }),
        new CleanWebpackPlugin([`${cssRootPath}/dev/pages/betlist`], {
            root: process.cwd(),
            exclude: ['images']
        }),
        new CleanWebpackPlugin([`${cssRootPath}/pro/pages/betlist`], {
            root: process.cwd(),
            exclude: ['images']
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            filename: "www/js/build/" + environment + "/common.chunk.js",
            minChunks: Infinity
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            jquery: 'jquery',
            'window.$': 'jquery',
            "window.jQuery": 'jquery',
            "root.jQuery": 'jquery'
        })
    ];

    return commonPlugins;
}

module.exports = generatePlugins;