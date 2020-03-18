function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu("❖ マクロ")
    .addItem("JSON 形式で取得する", "makeJson")
    .addToUi()
  ;
}

function makeJson() {
  const ssApp    = SpreadsheetApp.openById("1dujbtz_nZwW-DI2jhQvfUv_ljJkcVD8a4tFZB5LYczc");
  // const sheet    = SpreadsheetApp.getActiveSheet();
  const sheet    = ssApp.getSheetByName("beyooooonds");
  const range    = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn());
  const values   = range.getValues();
  const keyList  = values[0];
  const rows     = values.splice(2, values.length);
  const data     = rows.map((row, index) => {
    const regex = /^(key|__)/;
    let retData = {};

    row.map((v, i) => {
      const keyName = keyList[i];
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
