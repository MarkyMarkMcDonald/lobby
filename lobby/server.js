'use strict';

const Hapi = require('hapi');
const Vision = require('vision');
const Ejs = require('ejs');

const lobbyRoutes = require('./lobby_routes');
const cookieConfiguration = require('./cookie_configuration');
const trackUsersViaCookie = require('./track_users_via_cookie');

const server = new Hapi.Server({host: 'localhost', port: 3000, debug: {log: ['error']}});

const provision = async () => {
  await server.register(Vision);

  server.views({
    engines: {ejs: Ejs},
    relativeTo: __dirname,
    path: 'views'
  });

  server.state('user', cookieConfiguration);

  server.ext(trackUsersViaCookie);

  lobbyRoutes.forEach((route) => {
    server.route(route)
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

provision();