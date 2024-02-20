const data = require("../public/output/highest_no_of_dismissal.json");

// console.log(Object.entries(data))

const seriesData = Object.entries(data).reduce((acc, cv) => {
  let bowlerData = Object.entries(cv[1]);
  let stringKey = cv[0] + " by " + bowlerData[0][0];
  acc[stringKey] = bowlerData[0][1];

  return acc;
}, {});

console.log(seriesData);
