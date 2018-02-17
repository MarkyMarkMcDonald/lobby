const uuid = require('uuid/v1');
const gameLobbies = {};

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.view('root');
    }
  },
  {
    method: 'POST',
    path: '/lobbies',
    handler: (request, response) => {
      const gameId = uuid();
      const lobby = {
        id: gameId,
        players: [request.context.user]
      };
      gameLobbies[gameId] = lobby;
      return response.view('lobby', {lobby})
    }
  }
];