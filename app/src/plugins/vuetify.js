import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.lightGreen.darken4, // #33691E
        secondary: colors.lightGreen.lighten4, // #DCEDC8
        accent: colors.indigo.base, // #3F51B5
      },
    },
  },
});
