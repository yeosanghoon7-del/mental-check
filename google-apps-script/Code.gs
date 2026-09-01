const ADMIN_PASSWORD_PROP = 'ADMIN_PASSWORD';

// 검사마다 저장할 시트 탭을 따로 둔다(예: "TOPS2 수행전략검사", "CSAI-2 경쟁상태불안검사" 탭 등).
// 그래야 구글시트를 직접 열었을 때도 검사별로 결과가 분리되어, 하위척도 원점수가 컬럼으로 바로 보인다.
// scores_json/responses_json은 앱 자체(조회·상세보기 등)가 다시 읽어들이기 위한 원본 데이터라
// 사람이 직접 보라고 있는 컬럼은 아니다.
const FIXED_HEADERS = ['id', 'timestamp', 'testId', 'testName', 'name', 'birth', 'org', 'sport'];
const TRAILING_HEADERS = ['scores_json', 'responses_json'];

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// 구글시트가 "생년월일" 같은 날짜 형식 문자열을 자동으로 Date 타입으로 바꿔버리는 경우가 있어서,
// instanceof Date 대신 duck-typing으로 안전하게 감지해 항상 'yyyy-MM-dd' 문자열로 통일한다.
function normalizeBirth_(v) {
  if (v === '' || v === null || v === undefined) return '';
  const isDateLike = typeof v === 'object' && typeof v.getTime === 'function' && !isNaN(v.getTime());
  if (isDateLike) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(v).trim();
}

// 구글시트 탭 이름에 쓸 수 없는 문자(: \ / ? * [ ])만 안전하게 치환한다.
function safeSheetName_(name) {
  const cleaned = String(name || 'unknown').replace(/[:\\/?*[\]]/g, ' ').trim();
  return cleaned.slice(0, 90) || 'unknown';
}

// 검사(testId)별로 시트 탭을 찾거나, 없으면 이 제출 건의 척도 이름들로 헤더를 만들어 새로 생성한다.
function getOrCreateTestSheet_(testId, testName, scoreDefs) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = safeSheetName_(testName || testId);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    const scoreHeaders = (scoreDefs || []).map((s) => s.name || s.key);
    sheet.appendRow(FIXED_HEADERS.concat(scoreHeaders, TRAILING_HEADERS));
  }
  return sheet;
}

function readRowsFromSheet_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    obj.birth = normalizeBirth_(obj.birth);
    return obj;
  });
}

// 모든 검사 탭을 훑어 하나의 배열로 합친다. lookup/admin은 검사 종류를 가리지 않고 조회하므로 필요하다.
function readAllRows_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let rows = [];
  ss.getSheets().forEach((sheet) => {
    rows = rows.concat(readRowsFromSheet_(sheet));
  });
  return rows;
}

function handleSubmit_(body) {
  const entry = body.entry || {};
  const athlete = entry.athlete || {};
  const scores = entry.scores || [];

  const sheet = getOrCreateTestSheet_(entry.testId, entry.testName, scores);
  sheet.appendRow(
    [entry.id, entry.timestamp, entry.testId, entry.testName, athlete.name, athlete.birth, athlete.org, athlete.sport]
      .concat(scores.map((s) => s.raw))
      .concat([JSON.stringify(scores), JSON.stringify(entry.responses || {})])
  );
  return jsonOut_({ ok: true });
}

function handleLookup_(body) {
  const name = String(body.name || '').trim();
  const birth = String(body.birth || '').trim();
  if (!name || !birth) return jsonOut_({ ok: false, error: 'missing name/birth' });

  const rows = readAllRows_().filter((r) => String(r.name).trim() === name && r.birth === birth);
  return jsonOut_({ ok: true, rows });
}

function handleAdmin_(body) {
  const pw = PropertiesService.getScriptProperties().getProperty(ADMIN_PASSWORD_PROP);
  if (!pw || body.password !== pw) return jsonOut_({ ok: false, error: 'unauthorized' });
  return jsonOut_({ ok: true, rows: readAllRows_() });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.action === 'submit') return handleSubmit_(body);
    if (body.action === 'lookup') return handleLookup_(body);
    if (body.action === 'admin') return handleAdmin_(body);
    return jsonOut_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  return jsonOut_({ ok: false, error: 'use POST' });
}
