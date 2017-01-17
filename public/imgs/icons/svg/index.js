const iconRequireObject = require.context('./svg', true, /.*\.svg$/);
const exports = module.exports = {};
const iconList = [];

iconRequireObject.keys().forEach(path => {
  const iconName = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
  exports[iconName] = iconRequireObject(path);
  iconList.push(iconName)
});

exports.iconList = iconList
