const csvParser = require("csv-parser");
const fs = require("fs");

const extraRunsConcededPerTeam2016 = () => {
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
            const extraRunsConcededPerTeamResultFilePath =
              "/home/asjad/ubuntu/vs code files/IPL_drill/public/output_using_methods/extra_runs_conceded.json";
            fs.mkdirSync(directoryPath, { recursive: true });
            let extraRunsPerTeam = JSON.stringify(
              extraRunsConceded(matches, deliveries)
            );
            writeDataToJsonFile(
              extraRunsConcededPerTeamResultFilePath,
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

function extraRunsConceded(matchesData, deliveriesData) {
  let maxId = 0,
    minId = Infinity;

  for (let i = 0; i < matchesData.length; i++) {
    if (matchesData[i].season == 2016) {
      maxId = Math.max(matchesData[i].id, maxId);
      minId = Math.min(matchesData[i].id, minId);
    }
  }

  console.log("minId:", minId);
  console.log("maxId:", maxId);

  return matchesData.reduce((acc, cv) => {
    if (!(cv.team1 in acc) && cv.season == 2016) {
      acc[cv.team1] = 0;
      for (let key = 0; key < deliveriesData.length; key++) {
        if (
          deliveriesData[key].bowling_team == cv.team1 &&
          deliveriesData[key].match_id >= minId &&
          deliveriesData[key].match_id <= maxId
        ) {
          acc[cv.team1] += Number(deliveriesData[key].extra_runs);
        }
      }
    }
    return acc;
  }, {});
}

extraRunsConcededPerTeam2016();
