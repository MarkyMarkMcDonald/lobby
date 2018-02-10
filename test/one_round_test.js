let describe = require('mocha').describe;
let it = require('mocha').it;
let expect = require('chai').expect;
let _ = require('lodash');

const deckFactory = function () {
  return [
    '2h',
    'Jd',
    '3h',
    '4h',
    'Kd',

    '6h',
    '5h',
    '2s',
    'Qd',
    'Ad',
  ];
};

describe('Integration Tests', function () {
  it('Playing a game', function () {
    const {Player, Game} = require('../game');

    let bart = new Player('Bart');
    let homer = new Player('Homer');
    let lisa = new Player('Lisa');

    let players = [bart, homer, lisa];

    let game = new Game(players, {deckFactory: deckFactory, shuffleStrategy: _.identity});
    game.start();

    expect(game.libraryFor(bart)).to.be.empty;
    expect(game.libraryFor(homer)).to.be.empty;
    expect(game.libraryFor(lisa)).to.be.empty;

    expect(game.availableCards()).to.deep.equal([
      '2h',
      'Jd',
      '3h',
      '4h',
      'Kd',
    ]);

    game.setMove(bart, [0]);
    game.setMove(homer, [0, 1, 2, 3]);
    game.setMove(lisa, [0, 3]);

    game.nextHand();

    expect(game.libraryFor(homer)).to.deep.equal(['Jd', '3h']);
    expect(game.libraryFor(bart)).to.deep.equal(['2h']);
    expect(game.libraryFor(lisa)).to.deep.equal(['4h']);

    game.nextHand();

    expect(game.libraryFor(homer)).to.deep.equal(['Jd', '3h']);
    expect(game.libraryFor(bart)).to.deep.equal(['2h']);
    expect(game.libraryFor(lisa)).to.deep.equal(['4h']);

    expect(game.winners()).to.deep.equal(['Homer'])
  });
});
