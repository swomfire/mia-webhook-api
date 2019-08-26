export const getIntentId = (name) => {
  const path = name.split('/');
  return path[path.length - 1];
};
