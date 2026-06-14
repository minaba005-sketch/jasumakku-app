/**
 * じゃちゅ支払 & アベニール 管理アプリ用 Web API
 *
 * 使い方:
 * 1. このコードをスプレッドシートの「拡張機能 > Apps Script」に貼り付けて保存
 * 2. 関数選択で setupInitialData を選び、一度実行(初回のみ。既存データを書き込みます)
 *    -> 実行時に権限承認が求められるので許可する
 * 3. 「デプロイ > 新しいデプロイ」→ 種類「ウェブアプリ」
 *    - 実行ユーザー: 自分
 *    - アクセスできるユーザー: 全員
 *    でデプロイし、表示されたウェブアプリのURLをコピーする
 * 4. そのURLをスマホアプリ(index.html)の API_URL に設定する
 */

const SHEET_JACHU = 'AppData_じゃちゅ支払';
const SHEET_AVENIR = 'AppData_アベニール';

const JACHU_HEADERS = ['月', 'ラベル', '金額', 'メモ'];
const AVENIR_HEADERS = ['該当月', '支払月', '済', '金額', '振込手数料'];

// ============ 初期データ(既存スプレッドシートの内容) ============

const INITIAL_JACHU = [
  // 月, ラベル, 金額, メモ
  ['5月', 'じゃすぱ借り①', 12460, 'デイトラ6'],
  ['5月', 'じゃすぱ借り②', 14000, '掃除機3/11+大王ラーメン+どらちゃん写真'],
  ['5月', 'じゃすぱ借り③', 45724, '誕生日9/12/ipet保険代金/410トリミング/416フード定期/狂犬病'],
  ['5月', 'じゃすぱ借り④', 3161, 'ローン1/24'],
  ['5月', 'dカード', 92158, '4/16~5/15'],

  ['6月', 'じゃすぱ借り①', 13560, 'レンティオ13ヶ月目/デイトラ7'],
  ['6月', 'じゃすぱ借り②', 5000, '掃除機4/11+防災'],
  ['6月', 'じゃすぱ借り③', 62036, '誕生日10/12/ipet保険代金/初回補償額/中華'],
  ['6月', 'じゃすぱ借り④', 11411, 'ローン2/24/デニーズ/韓国ランチ/マッサージ/スリコ/つけそば/パンツ'],
  ['6月', 'dカード', 31044, '5/16~6/15'],

  ['7月', 'じゃすぱ借り①', 13560, 'レンティオ14ヶ月目/デイトラ8'],
  ['7月', 'じゃすぱ借り②', 5490, '掃除機5/11'],
  ['7月', 'じゃすぱ借り③', 43845, '誕生日11/12/ipet保険代金'],
  ['7月', 'じゃすぱ借り④', 6311, 'ローン3/24/初回保証料/コンビニ/代々木タクシー1'],
  ['7月', 'dカード', 30000, '6/16~7/15'],

  ['8月', 'じゃすぱ借り①', 13560, 'レンティオ15ヶ月目//デイトラ9'],
  ['8月', 'じゃすぱ借り②', 2000, '掃除機6/11'],
  ['8月', 'じゃすぱ借り③', 43845, '誕生日12/12/ミニドラ/ipet保険代金'],
  ['8月', 'じゃすぱ借り④', 3161, 'ローン4/24'],

  ['9月', 'じゃすぱ借り①', 13560, 'レンティオ16ヶ月目//デイトラ10'],
  ['9月', 'じゃすぱ借り②', 2000, '掃除機7/11'],
  ['9月', 'じゃすぱ借り③', 10445, 'ミニドラ/ipet保険代金'],
  ['9月', 'じゃすぱ借り④', 3161, 'ローン5/24'],

  ['10月', 'じゃすぱ借り①', 13560, 'レンティオ17ヶ月目//デイトラ11'],
  ['10月', 'じゃすぱ借り②', 2000, '掃除機8/11'],
  ['10月', 'じゃすぱ借り③', 10445, 'ミニドラ/ipet保険代金'],
  ['10月', 'じゃすぱ借り④', 3161, 'ローン6/24'],

  ['11月', 'じゃすぱ借り①', 13560, 'レンティオ18ヶ月目//デイトラ12'],
  ['11月', 'じゃすぱ借り②', 2000, '掃除機9/11'],
  ['11月', 'じゃすぱ借り③', 10445, 'ミニドラ/ipet保険代金'],
  ['11月', 'じゃすぱ借り④', 3161, 'ローン7/24'],

  ['12月', 'じゃすぱ借り①', 1100, 'レンティオ19ヶ月目'],
  ['12月', 'じゃすぱ借り②', 2000, '掃除機10/11'],
  ['12月', 'じゃすぱ借り③', 10445, 'ミニドラ/ipet保険代金'],
  ['12月', 'じゃすぱ借り④', 3161, 'ローン8/24'],

  ['1月', 'じゃすぱ借り①', 1100, 'レンティオ20ヶ月目'],
  ['1月', 'じゃすぱ借り②', 2085, '掃除機11/11'],
  ['1月', 'じゃすぱ借り③', 10445, 'ミニドラ/ipet保険代金'],
  ['1月', 'じゃすぱ借り④', 3161, 'ローン9/24'],

  ['2月', 'じゃすぱ借り①', 1100, 'レンティオ21ヶ月目'],
  ['2月', 'じゃすぱ借り③', 10445, 'ミニドラ/ipet保険代金'],
  ['2月', 'じゃすぱ借り④', 3161, 'ローン10/24'],
];

// 該当月, 支払月, 済, 金額, 振込手数料
const INITIAL_AVENIR = [
  ['6月分', '1月', false, 239306, 0],
  ['7月分', '2月', false, 259742, 0],
  ['8月分', '3月', false, 265417, 0],
  ['9月分', '4月', false, 228777, 0],
  ['10月分', '5月', false, 195377, 0],
  ['11月分', '6月', false, 195377, 0],
  ['12月分', '7月', false, 195377, 0],
  ['1月分', '8月', false, 182917, 0],
];

// ============ 初期化(1回だけ実行) ============

function setupInitialData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let jachuSheet = ss.getSheetByName(SHEET_JACHU);
  if (!jachuSheet) jachuSheet = ss.insertSheet(SHEET_JACHU);
  jachuSheet.clear();
  jachuSheet.appendRow(JACHU_HEADERS);
  if (INITIAL_JACHU.length > 0) {
    jachuSheet.getRange(2, 1, INITIAL_JACHU.length, JACHU_HEADERS.length).setValues(INITIAL_JACHU);
  }

  let avenirSheet = ss.getSheetByName(SHEET_AVENIR);
  if (!avenirSheet) avenirSheet = ss.insertSheet(SHEET_AVENIR);
  avenirSheet.clear();
  avenirSheet.appendRow(AVENIR_HEADERS);
  if (INITIAL_AVENIR.length > 0) {
    avenirSheet.getRange(2, 1, INITIAL_AVENIR.length, AVENIR_HEADERS.length).setValues(INITIAL_AVENIR);
  }

  SpreadsheetApp.getUi().alert('初期化が完了しました。AppData_じゃちゅ支払 と AppData_アベニール シートが作成されました。');
}

// ============ Web API ============

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getAll') {
    return jsonResponse({
      jachu: getJachuData(),
      avenir: getAvenirData(),
    });
  }

  return jsonResponse({ error: 'unknown action' });
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const action = body.action;

  if (action === 'saveJachu') {
    saveJachuData(body.data);
    return jsonResponse({ ok: true });
  }

  if (action === 'saveAvenir') {
    saveAvenirData(body.data);
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ error: 'unknown action' });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---- じゃちゅ支払 ----

function getJachuData() {
  const sheet = getOrCreateSheet(SHEET_JACHU, JACHU_HEADERS);
  const rows = sheet.getDataRange().getValues();
  rows.shift(); // headers
  return rows
    .filter(r => r[0] !== '')
    .map(r => ({
      month: String(r[0]),
      label: String(r[1]),
      value: Number(r[2]) || 0,
      memo: String(r[3] || ''),
    }));
}

function saveJachuData(items) {
  const sheet = getOrCreateSheet(SHEET_JACHU, JACHU_HEADERS);
  sheet.clear();
  sheet.appendRow(JACHU_HEADERS);
  if (items.length > 0) {
    const values = items.map(it => [it.month, it.label, it.value, it.memo || '']);
    sheet.getRange(2, 1, values.length, JACHU_HEADERS.length).setValues(values);
  }
}

// ---- アベニール ----

function getAvenirData() {
  const sheet = getOrCreateSheet(SHEET_AVENIR, AVENIR_HEADERS);
  const rows = sheet.getDataRange().getValues();
  rows.shift();
  return rows
    .filter(r => r[0] !== '')
    .map(r => ({
      target: String(r[0]),
      due: String(r[1]),
      done: Boolean(r[2]),
      amount: Number(r[3]) || 0,
      fee: Number(r[4]) || 0,
    }));
}

function saveAvenirData(items) {
  const sheet = getOrCreateSheet(SHEET_AVENIR, AVENIR_HEADERS);
  sheet.clear();
  sheet.appendRow(AVENIR_HEADERS);
  if (items.length > 0) {
    const values = items.map(it => [it.target, it.due, it.done, it.amount, it.fee]);
    sheet.getRange(2, 1, values.length, AVENIR_HEADERS.length).setValues(values);
  }
}

// ---- helper ----

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  }
  return sheet;
}
