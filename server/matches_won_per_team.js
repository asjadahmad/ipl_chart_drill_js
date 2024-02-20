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
      const matchesWonYear =
        "/home/asjad/ubuntu/vs code files/IPL_drill/public/output_using_methods/matches_won_per_team.json";
      fs.mkdirSync(directoryPath, { recursive: true });
      writeDataToJsonFile(
        matchesWonYear,
        JSON.stringify(mactchesWonPerTeam(matches))
      );
    } catch (error) {
      console.error("Error:", error.message);
    }
  });

function mactchesWonPerTeam(matchesData) {
    return matchesData.reduce((acc, cv, ci, arr) => {
      if (acc.hasOwnProperty(cv.winner)) {
        // console.log(acc[cv.winner])
  
        if (acc[cv.winner].hasOwnProperty(cv.season)) {
          //  console.log(acc[cv.winner][cv.season])
          acc[cv.winner][cv.season]++;
        } else {
          acc[cv.winner][cv.season] = 1;
        }
      } else {
        acc[cv.winner] = {};
      }
  
      return acc;
    }, {});
  }



const writeDataToJsonFile = (jsonWriteFilePath, resultData) => {
    fs.writeFile(jsonWriteFilePath, resultData, (error) => {
      if (error) {
        console.log("Error occur during writing data to json file", error);
      } else {
        console.log("Result written to the file successfully");
      }
    });
  };