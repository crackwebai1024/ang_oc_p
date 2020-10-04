const path = require('path');

module.exports = {
  devServer: {
    // Support for HTML5 deep linking via URL rewrite
    historyApiFallback: {
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
    }
  },
  devtool: "source-map",
  output: {
    filename: '[name].bundle.js'
  }
};
