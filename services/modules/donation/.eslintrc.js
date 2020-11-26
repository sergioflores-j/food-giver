require("@babel/register");

module.exports = {
  parser: 'babel-eslint',
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack.config.js',
      },
    }
  },
}
