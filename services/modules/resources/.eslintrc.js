require("@babel/register");

module.exports = {
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack.config.js',
      },
    }
  },
}