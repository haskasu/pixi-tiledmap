import path from 'path';
import webpack from 'webpack';
import copyPlugin from 'copy-webpack-plugin';

export default {
    entry: {
        'pixi-tiledmap': './src/index.js',
        'pixi-tiledmap.min': './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'pixi-tiledmap'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: 'babel-loader'
            }
        ]
    },
    target: 'web',
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min.js$/,
            sourceMap: true
        }),
        new copyPlugin([
            {from: 'dist/pixi-tiledmap.min.*', to: '../example/browser', flatten: true}
        ])
    ],
    devtool: 'source-map',
    node: {
        fs: 'empty'
    }
};