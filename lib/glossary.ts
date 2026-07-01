// Plain-English definitions for financial terms used across the dashboard.
// Wrap any label with <Term k="vix">VIX</Term> to attach a hover explainer.

export const glossary: Record<string, { term: string; definition: string }> = {
  vix: {
    term: "VIX",
    definition:
      "The CBOE Volatility Index — the market's expected 30-day swing in the S&P 500, derived from options prices. Nicknamed the \"fear gauge\": it tends to rise when stocks fall and investors rush to buy protection, and stays low in calm, steadily rising markets.",
  },
  vixTermStructure: {
    term: "VIX Term Structure",
    definition:
      "Compares near-term VIX to longer-dated VIX futures. Normally (\"contango\") near-term VIX is lower, reflecting calm. When it flips (\"backwardation\"), it signals acute near-term stress — the market is pricing more fear right now than months out.",
  },
  marketBreadth: {
    term: "Market Breadth",
    definition:
      "The share of stocks (here, S&P 500 members) trading above their own 200-day moving average. Wide breadth means a rally is broad-based; narrow breadth means gains are concentrated in a few big names while most stocks are weak — a classic warning sign.",
  },
  creditSpreads: {
    term: "Credit Spreads",
    definition:
      "The extra yield investors demand to hold riskier corporate bonds over safe Treasuries. Widening spreads mean bond investors are pricing in more economic/default risk — often shows up before stock prices react.",
  },
  putCallSentiment: {
    term: "Put/Call Sentiment",
    definition:
      "A read on options positioning: how much protective (put) buying is happening versus bullish (call) buying. Rising put demand signals fear; falling put demand signals complacency or optimism.",
  },
  factorCrowding: {
    term: "Factor Crowding",
    definition:
      "How correlated two investing styles (e.g. momentum vs. value) have become. A sharp shift can mean too much money has piled into the same trade, raising the risk of a fast, painful unwind if everyone exits at once.",
  },
  zScore: {
    term: "Z-score",
    definition:
      "A statistical measure of how far a value sits from its historical average, in standard deviations. 0 is \"normal\"; roughly +2 or -2 is unusually far from the norm.",
  },
  deploymentScore: {
    term: "Deployment Score",
    definition:
      "A single 0–100 number blending several market signals, used to decide how aggressively to put new capital to work right now versus holding back.",
  },
  spot: {
    term: "Spot Price",
    definition: "The current market price of the underlying stock.",
  },
  atm: {
    term: "ATM (At-the-Money)",
    definition: "An option whose strike price is at, or very close to, the current stock price.",
  },
  iv: {
    term: "Implied Volatility (IV)",
    definition:
      "The market's forward-looking estimate of how much a stock could move, backed out from the option's price. Higher IV means the market expects bigger swings, so options cost more.",
  },
  realizedVol: {
    term: "Realized Volatility (RV)",
    definition:
      "How much the stock has actually moved recently, looking backward — as opposed to IV, which is the market's forward guess. Comparing the two shows whether options look \"rich\" or \"cheap\" relative to how the stock has actually been trading.",
  },
  ivRank: {
    term: "IV Rank",
    definition:
      "Where today's implied volatility sits versus its own 1-year range, from 0 (near the lowest IV has been) to 100 (near the highest). High IV rank can favor selling options premium; low IV rank can favor buying it.",
  },
  skew: {
    term: "25-Delta Skew",
    definition:
      "The gap in implied volatility between downside puts and upside calls at similar deltas. A larger negative skew usually means the market is paying up more for downside protection than upside bets — a sign of hedging demand or fear.",
  },
  delta: {
    term: "Delta",
    definition:
      "How much an option's price is expected to move for a $1 move in the stock, loosely read as its rough \"probability of expiring in the money.\" A delta of 0.40 behaves roughly like a 40% chance of finishing in-the-money.",
  },
  dte: {
    term: "DTE (Days to Expiry)",
    definition:
      "How many calendar days remain until an option contract expires. Fewer days means faster time decay, but also much higher sensitivity to price moves (gamma risk).",
  },
  strike: {
    term: "Strike Price",
    definition: "The price at which an option lets you buy (call) or sell (put) the underlying stock.",
  },
  oi: {
    term: "Open Interest (OI)",
    definition:
      "The total number of outstanding contracts at a given strike that haven't been closed or exercised — a rough gauge of how much interest and liquidity exists there.",
  },
  unrealizedPnl: {
    term: "Unrealized P/L",
    definition:
      "The paper profit or loss on a position you still hold, based on the current price versus what you paid. It isn't \"real\" until you sell — the price (and the P/L) can still move.",
  },
  dayChange: {
    term: "Day Change",
    definition: "How much a position's or account's value has moved since the previous market close.",
  },
  costBasis: {
    term: "Cost Basis",
    definition: "What you originally paid for a position, used to measure gain or loss and for tax purposes.",
  },
};

export type GlossaryKey = keyof typeof glossary;
