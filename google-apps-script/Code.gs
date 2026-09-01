/**
 * 스포츠심리기술 검사 - 구글시트 백엔드 (Google Apps Script)
 *
 * 설치 방법:
 * 1. 새 구글 스프레드시트를 만든다 (예: "심리검사_결과").
 * 2. 메뉴 확장 프로그램 > Apps Script 를 연다.
 * 3. 기본 생성된 코드를 지우고 이 파일 내용 전체를 붙여넣는다.
 * 4. 왼쪽 톱니바퀴(프로젝트 설정) > 스크립트 속성에서
 *    속성 이름: ADMIN_PASSWORD, 값: 원하는 관리자 비밀번호 를 추가한다.
 * 5. 오른쪽 위 "배포" > "새 배포" > 유형: 웹 앱 선택.
 *    - 실행 계정: 나
 *    - 액세스 권한이 있는 사용자: 모든 사용자
 *    "배포" 클릭 → 구글 계정 권한 승인(본인 계정이므로 안전) → 생성된 웹 앱 URL을 복사한다.
 * 6. 복사한 URL을 src/App.jsx 맨 위 GOOGLE_SCRIPT_URL 상수에 붙여넣는다.
 *
 * 스프레드시트를 나중에 열어서 원본 데이터를 직접 볼 수도 있고,
 * 앱에서는 이 스크립트를 통해서만 이름+생년월일(선수 본인) 또는
 * 비밀번호(관리자)로 데이터를 조회할 수 있다.
 */

const SHEET_NAME = 'responses';
const ADMIN_PASSWORD_PROP = 'ADMIN_PASSWORD';

const HEADERS = [
  'id', 'timestamp', 'name', 'birth', 'org', 'sport',
  'TOPS2_selfTalk', 'TOPS2_emotionControl', 'TOPS2_automaticity', 'TOPS2_goalSetting',
  'TOPS2_imagery', 'TOPS2_relaxation', 'TOPS2_negativeThinking', 'TOPS2_distractibility',
  'CSAI2_cognitive', 'CSAI2_somatic', 'CSAI2_selfConfidence',
  'responses_json',
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

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

function readAllRows_() {
  const sheet = getSheet_();
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

function handleSubmit_(body) {
  const entry = body.entry || {};
  const athlete = entry.athlete || {};
  const tops2 = {};
  (entry.tops2Scores || []).forEach((s) => { tops2[s.key] = s.raw; });
  const csai2 = {};
  (entry.csai2Scores || []).forEach((s) => { csai2[s.key] = s.raw; });

  getSheet_().appendRow([
    entry.id, entry.timestamp, athlete.name, athlete.birth, athlete.org, athlete.sport,
    tops2.selfTalk, tops2.emotionControl, tops2.automaticity, tops2.goalSetting,
    tops2.imagery, tops2.relaxation, tops2.negativeThinking, tops2.distractibility,
    csai2.cognitive, csai2.somatic, csai2.selfConfidence,
    JSON.stringify({ tops2: entry.tops2Responses, csai2: entry.csai2Responses }),
  ]);
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
