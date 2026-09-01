const ADMIN_PASSWORD_PROP = 'ADMIN_PASSWORD';

// 검사마다 저장할 시트 탭을 따로 둔다(예: "TOPS2 수행전략검사", "CSAI-2 경쟁상태불안검사" 탭 등).
// 그래야 구글시트를 직접 열었을 때도 검사별로 결과가 분리되어, 하위척도 원점수가 컬럼으로 바로 보인다.
// scores_json/responses_json은 앱 자체(조회·상세보기 등)가 다시 읽어들이기 위한 원본 데이터라
// 사람이 직접 보라고 있는 컬럼은 아니다.
const FIXED_HEADERS = ['id', 'timestamp', 'testId', 'testName', 'name', 'phone4', 'org', 'sport'];
const TRAILING_HEADERS = ['scores_json', 'responses_json'];

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// 휴대폰 뒷자리(예: "0234")를 구글시트가 숫자로 인식해 앞자리 0을 지워버리는 경우가 있어서,
// 다시 읽어올 때 숫자 타입이면 4자리로 0을 채워 문자열로 복원한다.
function normalizePhone4_(v) {
  if (v === '' || v === null || v === undefined) return '';
  if (typeof v === 'number') return String(v).padStart(4, '0');
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
    obj.phone4 = normalizePhone4_(obj.phone4);
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
    [entry.id, entry.timestamp, entry.testId, entry.testName, athlete.name, athlete.phone4, athlete.org, athlete.sport]
      .concat(scores.map((s) => s.raw))
      .concat([JSON.stringify(scores), JSON.stringify(entry.responses || {})])
  );
  // 응답을 돌려주기 전에 시트 쓰기를 확정한다.
  // (없으면 "저장 완료" 응답 이후 바로 조회했을 때 아직 안 써진 것처럼 보이는 경우가 있었음)
  SpreadsheetApp.flush();
  return jsonOut_({ ok: true });
}

function handleLookup_(body) {
  const name = String(body.name || '').trim();
  const phone4 = String(body.phone4 || '').trim();
  if (!name || !phone4) return jsonOut_({ ok: false, error: 'missing name/phone4' });

  const rows = readAllRows_().filter((r) => String(r.name).trim() === name && r.phone4 === phone4);
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
