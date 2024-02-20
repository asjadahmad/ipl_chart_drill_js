const csvParser = require("csv-parser");
const fs = require("fs");

const highestStrikeRateWithJson= () => {
  const matchesCsvFilePath =
    "/home/asjad/ubuntu/vs code files/IPL_drill/data/matches.csv";
  const deliveriesCsvFilePath =
    "/home/asjad/ubuntu/vs code files/IPL_drill/data/deliveries.csv";
  let matches = [];
  let deliveries = [];

  // parsing 2 csv files to array of objects.
  fs.createReadStream(matchesCsvFilePath)
    .pipe(csvParser())
    .on("data", (match) => {
      return matches.push(match);
    })
    .on("end", () => {
      fs.createReadStream(deliveriesCsvFilePath)
        .pipe(csvParser())
        .on("data", (delivery) => {
          return deliveries.push(delivery);
        })
        .on("end", () => {
          try {
            const directoryPath =
              "/home/asjad/ubuntu/vs code files/IPL_drill/public/output_using_methods";
            const highestStrikeRateResultFilePath =
              "/home/asjad/ubuntu/vs code files/IPL_drill/public/output_using_methods/highest_strike_rate.json";
            fs.mkdirSync(directoryPath, { recursive: true });
            let extraRunsPerTeam = JSON.stringify(
              highetsStrikerate(matches, deliveries)
            );
            writeDataToJsonFile(
              highestStrikeRateResultFilePath,
              extraRunsPerTeam
            );
          } catch (error) {
            console.error("Error:", error.message);
          }
        });
    });
};
const writeDataToJsonFile = (jsonWriteFilePath, resultData) => {
  fs.writeFile(jsonWriteFilePath, resultData, (error) => {
    if (error) {
      console.log("Error occur during writing data to json file", error);
    } else {
      console.log("Result written to the file successfully");
    }
  });
};




function highetsStrikerate(matchesData, DeliveriesData) {

    function strikeRateOfBatsman(deliveriesData) {
      const seasonRangeObj = seasonRangeFunc(matchesData);
      let strObj = deliveriesData.reduce((acc, cv) => {
        if (acc.hasOwnProperty(cv.batsman)) {
          const year = findYearById(cv.match_id, seasonRangeObj);
  
          if (acc[cv.batsman].hasOwnProperty(year)) {
            let tempRun = acc[cv.batsman][year].runs,
                tempBall = acc[cv.batsman][year].balls;
            acc[cv.batsman][year] = {
              runs: Number(tempRun) + Number(cv.batsman_runs),
              balls: tempBall + 1,
            };
          } else {
            acc[cv.batsman][year] = { runs: Number(cv.batsman_runs), balls: 1 };
          }
        } else {
          acc[cv.batsman] = { [cv.batsman]: {} };
        }
        return acc;
      }, {});
  
      for (let key in strObj) {
        for (let innerKey in strObj[key]) {
          strObj[key][innerKey] = (strObj[key][innerKey].runs / strObj[key][innerKey].balls) * 100;
          if (innerKey == key) {
            delete strObj[key][innerKey];
          }
        }
      }
      return strObj;
    }
  
    function seasonRangeFunc(matchesData) {
      let seasonRange = {};
  
      for (let key in matchesData) {
        if (seasonRange.hasOwnProperty(matchesData[key].season)) {
          let currentId = Number(matchesData[key].id);
  
          if (seasonRange[matchesData[key].season].max < currentId) {
            seasonRange[matchesData[key].season].max = currentId;
          }
  
          if (seasonRange[matchesData[key].season].min > currentId) {
            seasonRange[matchesData[key].season].min = currentId;
          }
        } else {
          seasonRange[matchesData[key].season] = {
            min: Number(matchesData[key].id),
            max: Number(matchesData[key].id),
          };
        }
      }
      return seasonRange;
    }
  
    function findYearById(id, seasonRange) {
      for (let year in seasonRange) {
        if (id >= seasonRange[year].min && id <= seasonRange[year].max) {
          return year;
        }
      }
      return null;
    }
  
    return strikeRateOfBatsman(DeliveriesData);
  }
  highestStrikeRateWithJson();

  

