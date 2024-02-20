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
      const top10EconomyBowlerOutPut =
        "/home/asjad/ubuntu/vs code files/IPL_drill/public/output_using_methods/top10_Economy_bowler.json";
      fs.mkdirSync(directoryPath, { recursive: true });
      writeDataToJsonFile(
        top10EconomyBowlerOutPut,
        JSON.stringify(top10EconomyBowler(deliveries))
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



function top10EconomyBowler(deliveries) {
  let bowlerStats = deliveries.reduce((acc, curr) => {
    if (curr.match_id >= 518 && curr.match_id <= 576) {
      if (!acc[curr.bowler]) {
        acc[curr.bowler] = { balls: 0, runs: 0 };
      }
      if (acc[curr.bowler]) {
        acc[curr.bowler]["runs"] += +curr.total_runs;
        if (curr.ball <= 6) {
          acc[curr.bowler]["balls"] += 1;
        }
      }
    }
    return acc;
  }, {});

  let result = Object.keys(bowlerStats).reduce((acc, curr) => {
    let obj = {
      name: curr,
      avg: bowlerStats[curr]["runs"] / bowlerStats[curr]["balls"]
    };
    acc.push(obj);
    return acc;
  }, []);

  result.sort((bowler1, bowler2) => {
    return bowler1.avg - bowler2.avg;
  });

  let top10 = result.slice(0, 10);
  let top10BowlerName=[];
  for(let key in top10){
    top10BowlerName.push(top10[key].name)
  }
  return top10BowlerName;
}



