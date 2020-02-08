const path = require('path');

module.exports = {
    entry: './src/core.js',
    mode: "development",
    module: {
        rules: [
            {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    },
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};