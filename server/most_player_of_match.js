const csvParser = require("csv-parser");
const fs = require("fs");

const matchesCsvFilePath =
  "/home/asjad/ubuntu/vs code files/IPL_drill/data/matches.csv";

let matches = [];

fs.createReadStream(matchesCsvFilePath)
  .pipe(csvParser())
  .on("data", (match) => {
    return matches.push(match);
  })
  .on("end", () => {
    try {
      const directoryPath =
        "/home/asjad/ubuntu/vs code files/IPL_drill/public/output_using_methods";
      const mostPlayerOfMatchResultFilePath =
        "/home/asjad/ubuntu/vs code files/IPL_drill/public/output_using_methods/most_player_of_match.json";
      fs.mkdirSync(directoryPath, { recursive: true });
      writeDataToJsonFile(
        mostPlayerOfMatchResultFilePath,
        JSON.stringify(mostPlayerOfTheMatch(matches))
      );
    } catch (error) {
      console.error("Error:", error.message);
    }
  });

const writeDataToJsonFile = (jsonWriteFilePath, resultData) => {
  fs.writeFile(jsonWriteFilePath, resultData, (error) => {
    if (error) {
      console.log("Error occur during writing data to json file", error);
    } else {
      console.log("Result written to the file successfully");
    }
  });
};

function mostPlayerOfTheMatch(matchesData) {
  let momObj = matchesData.reduce((acc, cv, ci, arr) => {
    if (acc.hasOwnProperty(cv.season)) {
      if (acc[cv.season].hasOwnProperty(cv.player_of_match)) {
        acc[cv.season][cv.player_of_match]++;
      } else {
        acc[cv.season][cv.player_of_match] = 1;
      }
    } else {
      acc[cv.season] = {};
    }

    return acc;
  }, {});

  let maxMomObj = {};

  for (let key in momObj) {
    let playerMax = "",
      noMax = 0;
    for (let innerKey in momObj[key]) {
      if (momObj[key][innerKey] > noMax) {
        playerMax = innerKey;
        noMax = momObj[key][innerKey];
      }
    }
    maxMomObj[key] = { [playerMax]: noMax };
  }

  return maxMomObj;
}
