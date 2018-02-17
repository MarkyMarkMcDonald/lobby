const uuid = require('uuid/v1');

module.exports = {
  type: 'onPreHandler',
  method: function (request, h) {
    let user = request.state.user;
    if (!user) {
      user = {id: uuid()};
      h.state('user', user);
    }

    request.context = {user};

    return h.continue;
  }
};