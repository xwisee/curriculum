const fs = require('fs');

function loadData(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function sma(data, period) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const sum = slice.reduce((acc, d) => acc + d.c, 0);
      result.push(sum / period);
    }
  }
  return result;
}

function backtest(data, shortPeriod = 5, longPeriod = 20) {
  const short = sma(data, shortPeriod);
  const long = sma(data, longPeriod);
  let position = null;
  let pnl = 0;

  for (let i = 1; i < data.length; i++) {
    if (short[i - 1] == null || long[i - 1] == null) continue;
    const prevDiff = short[i - 1] - long[i - 1];
    const diff = short[i] - long[i];

    if (!position && prevDiff <= 0 && diff > 0) {
      position = data[i].c;
    } else if (position && prevDiff >= 0 && diff < 0) {
      pnl += data[i].c - position;
      position = null;
    }
  }

  if (position) {
    pnl += data[data.length - 1].c - position;
  }

  return pnl;
}

const file = process.argv[2] || 'data/sample.json';
const data = loadData(file);
const pnl = backtest(data);
console.log(`Total PnL: ${pnl.toFixed(2)}`);
