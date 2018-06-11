Const = {
  spreadSheetId: "XXXXXXXXXXXXXXXXXXX", //【Splathon】 SWITCH フレンドコードとか
  sheetName: "switch",
  slackIdColumnIndex: 1,
  friendCodeIdColumnIndex: 3,
  RES_TYPE_CHANNEL:"in_channel",
  RES_TYPE_EPHEMERAL:"ephemeral"
}

function doPost(e) {
  var request = parseRequest(e);
  var msg;
  var resType = Const.RES_TYPE_EPHEMERAL

  if (request.text == "" || request.text == null) {
    //Show yourself friend code
    msg = getFriendCode(request.user_name)
    resType = Const.RES_TYPE_CHANNEL
  } else if(request.text == "help") {
    msg = "*【コマンド説明】*\n`/fc help -> ヘルプ表示`\n`/fc -> 自分のフレンドコードを表示`\n`/fc @User -> 対象ユーザーのフレンドコードを表示`"
    resType = Const.RES_TYPE_EPHEMERAL
  } else {
    //Show target user friend code
    var name = request.text
    if (/^@/.test(name)) {
      //@をとる
      name = name.slice(1)
    }
    msg = getFriendCode(name)
    resType = Const.RES_TYPE_EPHEMERAL
  }

  return encode2Json(resType, msg);
}

function parseRequest(e) {
  var request = {};
  request.text = e.parameters["text"][0];
  request.user_name = e.parameters["user_name"][0]
  return request;
}

function encode2Json(responseType, msg) {
  var res = {
    "response_type" : responseType,
    "text": msg
  }
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}

function getFriendCode(name) {
  var friendCode = "はかせー、 `"+ name +"` ちゃんのフレンドコードが見つからないよー。えっ？これを伝えればいいの？えーっと...\n「イカのスプレッドシートの *B列* と *D列* をとっとと埋めるのです」だって！\nhttps://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXX/edit#gid=0"
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  for(var i = 0; i < data.length; i++) {
    if ( data[i][Const.slackIdColumnIndex] == name) {
      friendCode = name + " ちゃんのフレンドコードは\n" + " SW-" + data[i][Const.friendCodeIdColumnIndex] + "\nだよ！すっごーい！";
      break;
    }
  }
  return friendCode;
}

/* シートを取得する */
function getSheet() {
  if (getSheet.instance) { return getSheet.instance; }
  var sheet = SpreadsheetApp.openById(Const.spreadSheetId).getSheetByName(Const.sheetName);
  return sheet;
}
