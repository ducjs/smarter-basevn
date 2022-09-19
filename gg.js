const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

function doPost(apiData) {
  apiData = JSON.parse(apiData.postData.contents);
  let { name, email, error, version = "", env = "" } = apiData;
  let apiName = apiData.apiName;
  if (apiData.error) {
    spreadsheet.getSheetByName("error").appendRow([new Date(), error]);
    return ContentService.createTextOutput(JSON.stringify({ code: 200, data: { message: "error got" } }));;
  };

  let data = [name, email, new Date(), version, env];
  if (email !== "duclh@gearvn.com") spreadsheet.getSheetByName("Log").appendRow(data);
  let dfCfg = spreadsheet.getSheetByName("cfg").getRange("B2").getValue();
  dfCfg = JSON.parse(dfCfg);
  return ContentService.createTextOutput(JSON.stringify({ code: 200, data: { config: dfCfg } }));
}

const getCfg = () => {
  let dfCfg = spreadsheet.getSheetByName("cfg").getRange("B2").getValue();
  console.log(JSON.parse(dfCfg).smarterLink);
}

function onOpen() {
  goBot();
}

const goBot = () => {
  var sheetname = spreadsheet.getSheets()[0].getName();
  // Logger.log("DEBUG: sheetname = "+sheetname)
  var sheet = spreadsheet.getSheetByName(sheetname);
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(lastRow, 1);
  sheet.setActiveRange(range);

}


/*
const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

function doPost(apiData) {
  apiData = JSON.parse(apiData.postData.contents);
  let {name, email, product_id, version = "", env = ""} = apiData.data;
  let apiName = apiData.apiName;
  //if(email === "duclh@gearvn.com") return;
  let data = [name, email, new Date(), version, env];
  if(email !== "duclh@gearvn.com") spreadsheet.getSheetByName("Log").appendRow(data);
  let dfCfg = spreadsheet.getSheetByName("cfg").getRange("B2").getValue();
  dfCfg = JSON.parse(dfCfg);
  return ContentService.createTextOutput(JSON.stringify({code: 200, data: {config: dfCfg} }));
}

const getCfg = () =>{
  let dfCfg = spreadsheet.getSheetByName("cfg").getRange("B2").getValue();
  console.log(JSON.parse(dfCfg).smarterLink);
}

function onOpen(){
  goBot();
}

const goBot = () => {
   var sheetname = spreadsheet.getSheets()[0].getName();
 // Logger.log("DEBUG: sheetname = "+sheetname)
 var sheet = spreadsheet.getSheetByName(sheetname);
 var lastRow = sheet.getLastRow();
 var range = sheet.getRange(lastRow,1);
 sheet.setActiveRange(range);

}
*/