const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

function doPost(apiData) {
  try {


    apiData = JSON.parse(apiData.postData.contents);
    let { route, name, email, error, version = "", env = "", config } = apiData;

    switch (route) {
      case "sendError":
        spreadsheet.getSheetByName("error").appendRow([new Date(), error]);
        return ContentService.createTextOutput(JSON.stringify({ code: 200, data: { message: "error we got" } }));;

      case "getUserConfig":
        let data = [name, email, new Date(), version, env];
        if (email !== "duclh@gearvn.com") spreadsheet.getSheetByName("Log").appendRow(data);

        let defaultConfig = spreadsheet.getSheetByName("cfg").getRange("B2").getValue();
        defaultConfig = JSON.parse(defaultConfig);
        let userConfig = getConfig(email);

        defaultConfig = {
          ...defaultConfig,
          ...userConfig
        };

        let notiSoundList = getNotiSoundList();

        return ContentService.createTextOutput(JSON.stringify({
          code: 200,
          data: {
            config: defaultConfig,
            notiSoundList
          }
        }));

      case "changeNotiSound":
        writeUserconfig(email, config)
        return ContentService.createTextOutput(JSON.stringify({ code: 200, data: { message: "channged" } }));;

      default:
        return ContentService.createTextOutput(JSON.stringify({ code: 200, data: { message: "Hello thêr" } }));
    }
  } catch (error) {
    spreadsheet.getSheetByName("error").appendRow([new Date(), error]);

  }

}

const getConfig = (email) => {
  // email = "duclh@gearvn.com"
  let userCfg = {
    noti_sound_key: ""
  }

  let userConfig = spreadsheet.getSheetByName("userCfg").getRange("A:B").getValues();
  for (let row of userConfig) {
    let userCell = row[0];
    let configCell = row[1];
    if (userCell === "" || configCell === "") break;
    if (userCell !== email) continue;

    configCell = JSON.parse(configCell);
    userCfg = {
      ...userCfg,
      ...configCell
    }
  }
  console.log("userCfg ", userCfg)
  return userCfg;
  // defaultConfig = JSON.parse(defaultConfig);

}

const writeUserconfig = (email, config) => {
  // username = "duclh";
  // config = { "noti_sound_key": "bonk" }
  // let newCfg = JSON.stringify(config);

  let userConfigs = spreadsheet.getSheetByName("userCfg").getRange("A:B").getValues();
  for (let i = 0; i < userConfigs.length; i++) {
    let row = userConfigs[i];
    let userCell = row[0];
    if (userCell === "") break;
    if (userCell === "email") continue;

    let configCell = row[1];
    if (configCell === "") configCell = "{}";
    configCell = JSON.parse(configCell);
    newCfg = {
      ...configCell,
      ...config
    }
    newCfg = JSON.stringify(newCfg);
    if (userCell === email) {
      spreadsheet.getSheetByName("userCfg").getRange("B" + (i + 1)).setValue(newCfg)
      return;
    }
  }

  spreadsheet.getSheetByName("userCfg").appendRow([email, JSON.stringify(config)]);
}

const getNotiSoundList = () => {
  let list = [];
  let soundList = spreadsheet.getSheetByName("notiSoundList").getRange("A2:C").getValues();
  for (let row of soundList) {
    let nameCell = row[0];
    let valueCell = row[1];
    let linkCell = row[2];

    if (nameCell === "") break;

    list.push([nameCell, valueCell, linkCell])
  }
  return list;
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

