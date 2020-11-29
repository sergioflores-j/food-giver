import colors from 'vuetify/lib/util/colors';

export const getRandomColor = () => {
  const colorsKeys = Object.keys(colors);
  const [firstKey] = colorsKeys.sort(() => 0.5 - Math.random());

  return colors[firstKey].base;
};
