const _ = require('lodash');
const Hand = require('pokersolver').Hand;
const defaultDeckFactory = require('./deck_factory');

class Game {
  constructor(players, configuration = {
    shuffleStrategy: _.shuffle,
    deckFactory: defaultDeckFactory
  }) {
    this.players = players;
    this.configuration = configuration;
  }

  start() {
    this.libraries = {};
    _.each(this.players, (player) => {
      this.libraries[player.id] = [];
    });

    this.deck = this.configuration.shuffleStrategy(this.configuration.deckFactory());
  }

  availableCards() {
    return _.take(this.deck, 5);
  }

  libraryFor(player) {
    return this.libraries[player.id];
  }

  isFinished() {
    return this.deck.length === 0;
  }

  clearMoves() {
    this.moves = {};
  }

  setMove(player, indexes) {
    this.moves = this.moves || {};
    this.moves[player.id] = {indexes: indexes, power: indexes.length};
  }

  powerOf(playerId) {
    return this.moves[playerId].power;
  }

  nextHand() {
    const winnersByIndex = _.map([0, 1, 2, 3, 4], this._winningPlayerForIndex.bind(this));
    winnersByIndex.forEach((winnerId) => {
      let card = this.deck[0];
      this.deck = this.deck.slice(1);
      if (winnerId) {
        this.libraries[winnerId].push(card);
      }
    });

    this.clearMoves();
  }

  _winningPlayerForIndex(index) {
    const winners = Object.keys(this.moves)
      .filter(playerId => this.moves[playerId].indexes.includes(index))
      .reduce((winningPlayers, nextContender) => {
        if (winningPlayers.length === 0) {
          return [nextContender];
        }

        if (this.powerOf(nextContender) < this.powerOf(winningPlayers[0])) {
          return [nextContender];
        }

        if (this.powerOf(nextContender) === this.powerOf(winningPlayers[0])) {
          return winningPlayers.concat(nextContender);
        }

        return winningPlayers;
      }, []);
    return winners.length === 1 ? winners[0] : null;
  };

  winners() {
    const playerHands = _.mapValues(this.libraries, Hand.solve);
    const winningHands = Hand.winners(_.values(playerHands));
    const winningPlayerHands = _.pickBy(playerHands, (hand) => {
      return winningHands.indexOf(hand) !== -1;
    });
    return Object.keys(winningPlayerHands);
  }
}

class Player {
  constructor(id) {
    this.id = id;
  }
}

module.exports = {Game, Player};