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
      const matchesWonAnadTossResultFilePath =
        "/home/asjad/ubuntu/vs code files/IPL_drill/public/output_using_methods/win_toss_and_match.json";
      fs.mkdirSync(directoryPath, { recursive: true });
      writeDataToJsonFile(
        matchesWonAnadTossResultFilePath,
        JSON.stringify(mactchesAndTossWonPerTeam(matches))
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

function mactchesAndTossWonPerTeam(matchesData) {
  return matchesData.reduce((acc, cv, ci, arr) => {
    if (acc.hasOwnProperty(cv.winner)) {
      if (cv.toss_winner == cv.winner) acc[cv.winner]++;
    } else if (cv.winner != "") {
      if (cv.toss_winner == cv.winner) acc[cv.winner] = 1;
    }

    return acc;
  }, {});
}
