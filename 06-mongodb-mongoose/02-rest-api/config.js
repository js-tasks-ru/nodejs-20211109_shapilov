module.exports = {
  mongodb: {
    uri: (process.env.NODE_ENV === 'test') ?
      'mongodb://mongo/6-module-2-task' :
      'mongodb://mongo/any-shop',
  },
};
