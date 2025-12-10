export const cascadingRound = (value, decimals = 2, startDecimals = 4) => {
  // Validate inputs
  if (typeof value !== "number" || isNaN(value)) {
    throw new Error("cascadingRound: value must be a valid number");
  }

  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error("cascadingRound: decimals must be a non-negative integer");
  }

  if (!Number.isInteger(startDecimals) || startDecimals < decimals) {
    throw new Error(
      "cascadingRound: startDecimals must be an integer >= decimals"
    );
  }

  let rounded = value;

  // Cascade from startDecimals down to target decimals
  for (let i = startDecimals; i > decimals; i--) {
    rounded = parseFloat(rounded.toFixed(i));
  }

  return parseFloat(rounded.toFixed(decimals));
};
