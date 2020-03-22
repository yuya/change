const SHEET_ID = "1dujbtz_nZwW-DI2jhQvfUv_ljJkcVD8a4tFZB5LYczc";

function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu("❖ マクロ")
    .addItem("JSON 形式で取得する", "makeJson")
    .addToUi()
  ;
}

function makeJson() {
  const ssApp  = SpreadsheetApp.openById(SHEET_ID);
  const sheet  = ssApp.getSheetByName("beyooooonds");
  const range  = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn());
  const values = range.getValues();
  const keys   = values.shift();
  const rows   = values.splice(1, values.length - 2);
  const data   = rows.map((row, index) => {
    const regex = /^(key|__)/;
    let retData = {};

    row.map((v, i) => {
      const keyName = keys[i];
      if (regex.test(keyName)) { return; }
      retData[keyName] = (v === "") ? null : v;
    });

    return retData;
  });

  return { "data" : data };
}

function doGet(e) {
  const jsonData = JSON.stringify(makeJson());
  const mimeType = ContentService.MimeType.JSON;

  return ContentService.createTextOutput(jsonData).setMimeType(mimeType);
}
