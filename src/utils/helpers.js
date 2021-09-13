import { round, random } from 'lodash';

export const randomizer = (num) => random(num);

export const calcPositive = (chance) => round((chance - 1) * 10000);

export const generateCompares = (players) => {
  let start = 0;
  let sumOfChance = 0;
  const compareScope = [];
  players.forEach((player, index) => {
    const positive = calcPositive(player.chance);
    compareScope.push([start, start + positive, index]);
    start += positive;
    sumOfChance += positive;
  });

  return [compareScope, sumOfChance];
};

export const getWinners = (compareScope, allChances, picked = []) => {
  if (compareScope.length <= 1) {
    if (compareScope[0]) {
      picked.push(compareScope[0][2]);
    }
    return picked;
  }

  const chance = randomizer(allChances);
  const winner = compareScope.find((scope) => {
    const [start, end] = scope;
    return (chance === 0 || chance > start) && chance <= end;
  });

  if (winner) {
    // winner[2] is player index
    if (!picked.includes(winner[2])) {
      picked.push(winner[2]);
      const trims = compareScope.filter((scope) => scope[2] !== winner[2]);
      return getWinners(trims, allChances, picked);
    }
  }
  return getWinners(compareScope, allChances, picked);
};
