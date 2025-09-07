const path = require('node:path');

module.exports = {
  entry: './index.tsx',
  mode: process.env.NODE_ENV || 'production',
  output: {
    // Bundle is now emitted directly to ./dist at the project root so that
    // index.html can reference it via "./dist/bundle.js" (relative path).
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '',
    // Clean the output directory before each build
    clean: true
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  performance: {
    hints: false
  },
  optimization: {
    minimize: true
  },
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  },
  infrastructureLogging: {
    level: 'error'
  },
  cache: true
};
