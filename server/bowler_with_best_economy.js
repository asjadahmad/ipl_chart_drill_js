const csvParser = require("csv-parser");
const fs = require("fs");

const matchesCsvFilePath =
  "/home/asjad/ubuntu/vs code files/IPL_drill/data/deliveries.csv";

let deliveries = [];

fs.createReadStream(matchesCsvFilePath)
  .pipe(csvParser())
  .on("data", (match) => {
    return deliveries.push(match);
  })
  .on("end", () => {
    try {
      const directoryPath =
        "/home/asjad/ubuntu/vs code files/IPL_drill/public/output_using_methods";
      const bestEconomyBowlerResultFilePath =
        "/home/asjad/ubuntu/vs code files/IPL_drill/public/output_using_methods/best_economy_bowler.json";
      fs.mkdirSync(directoryPath, { recursive: true });
      writeDataToJsonFile(
        bestEconomyBowlerResultFilePath,
        JSON.stringify(bestEconomy(deliveries))
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


function bestEconomy(deliveriesData) {
    let bowlersSuperOverObj = deliveriesData.reduce((acc, cv) => {
      let totalRuns =
        Number(cv.wide_runs) + Number(cv.noball_runs) + Number(cv.batsman_runs);
      if (cv.is_super_over == "1") {
        // console.log(cv.is_super_over);
        if (acc.hasOwnProperty(cv.bowler)) {
          // console.log(cv.bowler);
          let prevAdded = totalRuns + Number(acc[cv.bowler].runs);
          let totalBalls = acc[cv.bowler].balls + 1;
          acc[cv.bowler] = { runs: prevAdded, balls: totalBalls };
        } else {
          // console.log(acc)
          acc[cv.bowler] = { runs: totalRuns, balls: 1 };
        }
      }
  
      return acc;
    }, {});
  
    let bestEconomyBowler = 1000,
      bowlerName = "";
  
    for (let key in bowlersSuperOverObj) {
      if (
        bowlersSuperOverObj[key].runs / (bowlersSuperOverObj[key].balls / 6) <
        bestEconomyBowler
      ) {
        bestEconomyBowler =
          bowlersSuperOverObj[key].runs / (bowlersSuperOverObj[key].balls / 6);
        bowlerName = key;
      }
    }
    return bowlerName;
  }