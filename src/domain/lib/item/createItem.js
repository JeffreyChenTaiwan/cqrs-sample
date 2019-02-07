module.exports = require('cqrs-domain').defineCommand({
  name: 'createItem',
  payload: ''
}, function ({ payload, meta }, aggregate) {
  aggregate.apply('itemCreated', payload);
});