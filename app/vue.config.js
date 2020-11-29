module.exports = {
  lintOnSave: false,
  transpileDependencies: [
    'vuetify',
  ],
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Food Giver',
    },
  },
  pwa: {
    name: 'Food Giver',
    themeColor: '#33691e',
    msTileColor: '#EEEEEE',
    appleMobileWebAppCapable: 'yes',
  },
};
