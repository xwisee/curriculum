# Polygon Scanner and Backtester

This example demonstrates how to connect to the Polygon.io stock WebSocket and a simple moving average cross backtest.

## Requirements

* Node.js 16+
* Install dependencies with `npm install` (requires `ws` module)
* Set the environment variable `POLYGON_API_KEY` with your API key.

## Usage

```
# Run the live scanner subscribing to all trades
npm run scanner

# Run the backtest on the sample dataset
npm run backtest
```

`scanner.js` will log trades with volume greater than 10,000.
`backtester.js` runs a basic moving average crossover strategy on data in `data/sample.json`.
