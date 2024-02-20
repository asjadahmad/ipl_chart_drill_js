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
      const highestNoOfDismissalResultFilePath =
        "/home/asjad/ubuntu/vs code files/IPL_drill/public/output_using_methods/highest_no_of_dismissal.json";
      fs.mkdirSync(directoryPath, { recursive: true });
      writeDataToJsonFile(
        highestNoOfDismissalResultFilePath,
        JSON.stringify(hishestNoOfDismissal(deliveries))
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


function hishestNoOfDismissal(deliveriesData) {
    let dismissalObj = deliveriesData.reduce((acc, cv) => {
      if (cv.dismissal_kind != "run out" && cv.dismissal_kind != "") {
        if (acc.hasOwnProperty(cv.batsman)) {
          if (acc[cv.batsman].hasOwnProperty(cv.bowler)) {
            acc[cv.batsman][cv.bowler]++;
          } else {
            acc[cv.batsman][cv.bowler] = 1;
          }
        } else {
          acc[cv.batsman] = { [cv.batsman]: {} };
        }
      }
      return acc;
    }, {});
  
    for (let key in dismissalObj) {
      let tempMax = 0,
        tempBowler = "";
      for (let innerKey in dismissalObj[key]) {
        if (dismissalObj[key][innerKey] >= tempMax) {
          tempBowler = innerKey;
          tempMax = dismissalObj[key][innerKey];
        }
      }
      dismissalObj[key] = { [tempBowler]: tempMax };
    }
    return dismissalObj;
  }