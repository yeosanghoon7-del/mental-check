import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { ChevronRight, ChevronLeft, Check, Download, AlertCircle, RotateCcw, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

/* ============ Design tokens ============ */
const C = {
  paper: '#F8F9FA',
  paperDim: '#E9ECEF',
  card: '#FFFFFF',
  ink: '#121417',
  inkDim: '#4A5056',
  accent: '#E63946',
  accent2: '#2A9D8F',
  line: '#DEE2E6',
};

/* ============ Data Definitions ============ */
const TOPS2_ITEMS = [
  { no: 1, text: '시합에서 최선을 다할 수 있도록 긍정적인 혼잣말을 한다.' },
  { no: 2, text: '혼잣말을 효과적으로 잘한다.' },
  { no: 3, text: '시합에 도움이 되는 말을 자신에게 한다.' },
  { no: 4, text: '시합에 도움이 되는 특정단어나 말을 한다.' },
  { no: 5, text: '시합 때 부담이 크면 감정조절이 잘 안된다.' },
  { no: 6, text: '시합 때 감정조절이 잘 되지 않아 힘들다.' },
  { no: 7, text: '실수를 하면 감정조절이 어려워진다.' },
  { no: 8, text: '감정 때문에 실력발휘를 못한다.' },
  { no: 9, text: '내 몸이 기술을 잘 수행할 것으로 믿는다.' },
  { no: 10, text: '자동적으로 기술이 나올 만큼 충분히 준비되어 있다.' },
  { no: 11, text: '부분 동작에 신경 쓰지 않아도 전체동작이 자연스럽게 된다.' },
  { no: 12, text: '시합에 대한 개인목표를 세운다.' },
  { no: 13, text: '매우 세부적인 목표를 세운다.' },
  { no: 14, text: '시합목표를 달성했는지 평가한다.' },
  { no: 15, text: '시합에 대한 결과목표를 세운다.' },
  { no: 16, text: '시합을 하기 전에 동작을 머릿속으로 미리 연습해본다.' },
  { no: 17, text: '시합을 하기 전에 시합 절차(루틴)를 상상해 본다.' },
  { no: 18, text: '시합의 느낌을 머릿속으로 상상한다.' },
  { no: 19, text: '내가 원하는 시합상황을 머릿속으로 떠올려 본다.' },
  { no: 20, text: '시합을 더 잘하도록 긴장을 잘 풀 수 있다.' },
  { no: 21, text: '어려운 상황에서 긴장풀기로 대처한다.' },
  { no: 22, text: '평정심을 잃을 것 같으면 긴장풀기를 한다.' },
  { no: 23, text: '시합을 위해 나 자신을 침착하고 편안하게 만든다.' },
  { no: 24, text: '내가 잘 못하는 것(실수)이 떠오른다.' },
  { no: 25, text: '내가 실수 하는 장면이 떠오른다.' },
  { no: 26, text: '시각적인 방해요인의 영향을 받는다.' },
  { no: 27, text: '시합 환경 조건들에 의해 영향을 받는다.' },
  { no: 28, text: '잠을 잘 못자면 시합 때 영향을 받는다.' },
];

const TOPS2_LIKERT = [
  { v: 1, label: '전혀안함' },
  { v: 2, label: '거의안함' },
  { v: 3, label: '가끔함' },
  { v: 4, label: '자주함' },
  { v: 5, label: '항상함' },
];

const TOPS2_SUBSCALES = [
  { key: 'selfTalk', name: '혼잣말', items: [1, 2, 3, 4], reverse: [], desc: '운동학습과 수행에 영향을 미치는 주된 심리기술 중 하나' },
  { key: 'emotionControl', name: '감정조절', items: [5, 6, 7, 8], reverse: [5, 6, 7, 8], desc: '경기 전이나 중에 유발되는 감정을 조절하는 전략' },
  { key: 'automaticity', name: '자동적수행', items: [9, 10, 11], reverse: [], desc: '주의를 거의 기울이지 않고도 성공적으로 수행하는 능력' },
  { key: 'goalSetting', name: '목표설정', items: [12, 13, 14, 15], reverse: [], desc: '실제와 비슷한 감각·지각·감정을 지닌 목표 경험을 만들어 내는 것' },
  { key: 'imagery', name: '심상', items: [16, 17, 18, 19], reverse: [], desc: '과거 경험과 기억을 바탕으로 실제 수행과 유사한 장면을 상상' },
  { key: 'relaxation', name: '긴장풀기', items: [20, 21, 22, 23], reverse: [], desc: '어려운 상황에서 침착하고 편안하게 만드는 능력' },
  { key: 'negativeThinking', name: '부정적생각', items: [24, 25], reverse: [], desc: '시합 중 실수나 부정적 장면이 떠오르는 정도' },
  { key: 'distractibility', name: '주의산만', items: [26, 27, 28], reverse: [], desc: '시각적 방해요인이나 시합 환경 조건들에 의해 영향을 받는 것' },
];

const CSAI2_ITEMS = [
  { no: 1, text: '이번 시합에 신경 쓰인다.' },
  { no: 2, text: '초조하다.' },
  { no: 3, text: '마음이 가볍다.' },
  { no: 4, text: '자신감에 대하여 의문을 갖는다.' },
  { no: 5, text: '내 몸이 과도하게 민감해진다.' },
  { no: 6, text: '마음이 편하다.' },
  { no: 7, text: '기량을 잘 발휘할 수 없을까 걱정이 된다.' },
  { no: 8, text: '몸이 긴장된다.' },
  { no: 9, text: '자신이 있다.' },
  { no: 10, text: '시합에 질까봐 걱정이 된다.' },
  { no: 11, text: '속이 긴장된다.' },
  { no: 12, text: '안심이 된다.' },
  { no: 13, text: '압박감 때문에 답답할까봐 걱정된다.' },
  { no: 14, text: '몸이 이완된다.' },
  { no: 15, text: '시합에 대처할 자신이 있다.' },
  { no: 16, text: '경기를 못할까봐 걱정이 된다.' },
  { no: 17, text: '심장박동이 빨라진다.' },
  { no: 18, text: '시합을 잘해 낼 자신이 있다.' },
  { no: 19, text: '목표하는 바를 이룰지 걱정이 된다.' },
  { no: 20, text: '속이 철렁한다.' },
  { no: 21, text: '정신적으로 여유가 생긴다.' },
  { no: 22, text: '다른 사람이 내 경기를 보고 실망할까봐 걱정된다.' },
  { no: 23, text: '손이 끈적거린다.' },
  { no: 24, text: '내가 목표를 달성하는 것을 머릿속으로 상상하니까 자신이 생긴다.' },
  { no: 25, text: '집중을 못할까봐 걱정이 된다.' },
  { no: 26, text: '몸이 굳는다.' },
  { no: 27, text: '정신적 압박을 견디어 낼 자신이 있다.' },
];

const CSAI2_LIKERT = [
  { v: 1, label: '전혀안그렇다' },
  { v: 2, label: '약간그렇다' },
  { v: 3, label: '어느정도' },
  { v: 4, label: '아주그렇다' },
];

const CSAI2_SUBSCALES = [
  { key: 'cognitive', name: '인지적불안', items: [1, 4, 7, 10, 13, 16, 19, 22, 25], reverse: [], desc: '시합 결과나 실패에 대한 걱정, 부정적 기대 등 인지적 측면의 불안' },
  { key: 'somatic', name: '신체적불안', items: [2, 5, 8, 11, 14, 17, 20, 23, 26], reverse: [14], desc: '심장박동, 긴장감, 손떨림 등 신체 각성과 관련된 불안 증상' },
  { key: 'selfConfidence', name: '상태자신감', items: [3, 6, 9, 12, 15, 18, 21, 24, 27], reverse: [], desc: '시합 수행에 대해 스스로 느끼는 자신감의 정도' },
];

/* ================= Helper Functions ================= */
function scoreSubscales(subscales, responses, scaleMax) {
  return subscales.map((sub) => {
    let raw = 0;
    sub.items.forEach((no) => {
      const v = responses[no] || 0;
      raw += sub.reverse.includes(no) ? scaleMax + 1 - v : v;
    });
    const max = sub.items.length * scaleMax;
    const norm = max > 0 ? (raw / max) * 100 : 0;
    return { key: sub.key, name: sub.name, raw, max, norm };
  });
}

function validateAnswers(items, responses) {
  return items.filter((it) => !responses[it.no]).map((it) => it.no);
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const esc = (v) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = [headers.map(esc).join(',')];
  rows.forEach((r) => lines.push(headers.map((h) => esc(r[h])).join(',')));
  return lines.join('\n');
}

function downloadCSV(filename, csvString) {
  const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ================= UI Components ================= */
function Field({ label, value, onChange, placeholder }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-center" style={{ color: C.ink }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-3 rounded-xl border outline-none text-sm font-medium transition-all text-center focus:ring-2"
        style={{ borderColor: C.line, background: C.card, color: C.ink }}
      />
    </div>
  );
}

function LikertItem({ no, text, options, value, onChange, idPrefix }) {
  const answered = !!value;
  return (
    <div id={`${idPrefix}-item-${no}`} className="py-5 border-b text-center" style={{ borderColor: C.line }}>
      <div className="mb-3 text-center">
        <span className="font-mono text-xs font-black block mb-1" style={{ color: answered ? C.inkDim : C.accent }}>
          {String(no).padStart(2, '0')}
        </span>
        <p className="text-base font-bold leading-relaxed" style={{ color: C.ink }}>{text}</p>
      </div>
      <div className={`grid ${options.length === 5 ? 'grid-cols-5' : 'grid-cols-4'} gap-2 w-full max-w-md mx-auto`}>
        {options.map((opt) => {
          const isSelected = value === opt.v;
          return (
            <button
              key={opt.v}
              type="button"
              onClick={() => onChange(no, opt.v)}
              className="py-3 px-1 rounded-xl text-center transition-all border flex flex-col items-center justify-center shadow-sm active:scale-95"
              style={{
                background: isSelected ? C.ink : C.card,
                borderColor: isSelected ? C.ink : C.line,
                color: isSelected ? '#FFF' : C.inkDim,
              }}
            >
              <span className="font-mono text-base font-black leading-none mb-1.5">{opt.v}</span>
              <span className="text-[11px] font-bold tracking-tight leading-none whitespace-nowrap">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ScoreRadar({ data }) {
  return (
    <div className="my-3 rounded-xl p-1 border" style={{ background: C.card, borderColor: C.line }}>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <RadarChart data={data} outerRadius="68%">
            <PolarGrid stroke={C.line} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: C.ink, fontSize: 11, fontWeight: 700 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar dataKey="value" stroke={C.accent} fill={C.accent} fillOpacity={0.25} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* 요인별 상세 설명 및 수치 카드 (복원) */
function ScoreRow({ name, raw, max, norm, desc }) {
  return (
    <div className="py-4 border-b last:border-b-0 text-center">
      <h3 className="text-base font-black mb-1" style={{ color: C.ink }}>{name}</h3>
      <div className="mb-1.5">
        <span className="font-mono text-xl font-black" style={{ color: C.ink }}>{norm.toFixed(1)}</span>
        <span className="text-xs font-mono font-semibold" style={{ color: C.inkDim }}> / 100점</span>
      </div>
      {desc && <p className="text-xs font-medium leading-relaxed mb-2 px-2" style={{ color: C.inkDim }}>{desc}</p>}
      <div className="w-full h-2 rounded-full overflow-hidden mb-2 max-w-xs mx-auto" style={{ background: C.paperDim }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, norm))}%`, background: C.accent }} />
      </div>
      <p className="text-xs font-mono font-bold" style={{ color: C.inkDim }}>원점수 {raw} / {max}점</p>
    </div>
  );
}

/* ================= Main App ================= */
export default function App() {
  const [screen, setScreen] = useState('intro');
  const [athlete, setAthlete] = useState({ name: '', org: '', sport: '' });
  const [tops2Res, setTops2Res] = useState({});
  const [csai2Res, setCsai2Res] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [savedEntry, setSavedEntry] = useState(null);
  const [adminEntries, setAdminEntries] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  function goToTops2() {
    if (!athlete.name.trim() || !athlete.org.trim() || !athlete.sport.trim()) {
      setErrorMsg('이름, 소속, 종목을 모두 입력해주세요.');
      return;
    }
    setErrorMsg('');
    setScreen('tops2');
  }

  function goToCsai2() {
    const missing = validateAnswers(TOPS2_ITEMS, tops2Res);
    if (missing.length) {
      setErrorMsg(`미응답 문항이 있습니다 (${missing[0]}번 확인).`);
      const el = document.getElementById(`tops2-item-${missing[0]}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrorMsg('');
    setScreen('csai2');
  }

  function submitAll() {
    const missing = validateAnswers(CSAI2_ITEMS, csai2Res);
    if (missing.length) {
      setErrorMsg(`미응답 문항이 있습니다 (${missing[0]}번 확인).`);
      const el = document.getElementById(`csai2-item-${missing[0]}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrorMsg('');
    const tops2Scores = scoreSubscales(TOPS2_SUBSCALES, tops2Res, 5);
    const csai2Scores = scoreSubscales(CSAI2_SUBSCALES, csai2Res, 4);
    const entry = {
      id: makeId(),
      timestamp: new Date().toISOString(),
      athlete: { ...athlete },
      tops2: { responses: tops2Res, scores: tops2Scores },
      csai2: { responses: csai2Res, scores: csai2Scores },
    };
    try {
      localStorage.setItem(`response:${entry.id}`, JSON.stringify(entry));
    } catch (e) {
      // ignore
    }
    setSavedEntry(entry);
    setScreen('results');
  }

  function loadAdmin() {
    setAdminLoading(true);
    setConfirmClear(false);
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('response:'));
      const entries = keys.map((k) => ({ key: k, ...JSON.parse(localStorage.getItem(k)) }));
      const valid = entries.filter(Boolean).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setAdminEntries(valid);
    } catch {
      setAdminEntries([]);
    } finally {
      setAdminLoading(false);
    }
  }

  function goAdmin() {
    setScreen('admin');
    loadAdmin();
  }

  function clearAll() {
    setAdminLoading(true);
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('response:'));
      keys.forEach((k) => localStorage.removeItem(k));
      setAdminEntries([]);
    } catch {
      // ignore
    }
    setConfirmClear(false);
    setAdminLoading(false);
  }

  function exportCSV() {
    const rows = adminEntries.map((e) => {
      const row = {
        시간: new Date(e.timestamp).toLocaleString('ko-KR'),
        이름: (e.athlete && e.athlete.name) || '',
        소속: (e.athlete && e.athlete.org) || '',
        종목: (e.athlete && e.athlete.sport) || '',
      };
      (e.tops2 && e.tops2.scores ? e.tops2.scores : []).forEach((s) => {
        row[`TOPS2_${s.name}`] = s.raw;
      });
      (e.csai2 && e.csai2.scores ? e.csai2.scores : []).forEach((s) => {
        row[`CSAI2_${s.name}`] = s.raw;
      });
      return row;
    });
    downloadCSV(`sports_psych_data_${Date.now()}.csv`, toCSV(rows));
  }

  const tops2Merged = savedEntry
    ? TOPS2_SUBSCALES.map((sub, i) => ({ ...sub, ...savedEntry.tops2.scores[i] }))
    : [];
  const csai2Merged = savedEntry
    ? CSAI2_SUBSCALES.map((sub, i) => ({ ...sub, ...savedEntry.csai2.scores[i] }))
    : [];

  return (
    <div className="min-h-screen w-full flex justify-center items-start font-sans antialiased" style={{ background: C.paper, color: C.ink }}>
      <div className="w-full max-w-lg mx-auto relative min-h-screen flex flex-col px-4 text-center">
        
        {/* 헤더 */}
        <div className="sticky top-0 z-10 py-3 border-b backdrop-blur-md mb-2 flex items-center justify-between" style={{ background: `${C.paper}F2`, borderColor: C.line }}>
          <div className="w-16"></div>
          <div className="text-center flex-1">
            <p className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: C.accent }}>Mental Skills Check</p>
            <h1 className="text-lg font-black tracking-tight" style={{ color: C.ink }}>스포츠심리기술 검사</h1>
          </div>
          <div className="w-16 text-right">
            {screen !== 'admin' && (
              <button
                onClick={goAdmin}
                className="text-xs font-bold px-2.5 py-1.5 rounded-lg border bg-white shadow-sm whitespace-nowrap"
                style={{ borderColor: C.line, color: C.inkDim }}
              >
                데이터 보기
              </button>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div className="pb-28 flex-1">
          {screen === 'intro' && (
            <div className="pt-2">
              <div className="p-5 rounded-2xl border shadow-sm mb-4" style={{ background: C.card, borderColor: C.line }}>
                <h2 className="text-sm font-bold mb-4 pb-2 border-b text-center" style={{ color: C.ink, borderColor: C.line }}>
                  피검사자 정보 입력
                </h2>
                <Field label="이름 또는 식별 코드" value={athlete.name} onChange={(v) => setAthlete((a) => ({ ...a, name: v }))} placeholder="예: 홍길동 또는 A-01" />
                <Field label="소속 팀 / 학과" value={athlete.org} onChange={(v) => setAthlete((a) => ({ ...a, org: v }))} placeholder="예: OO대학교 / OO팀" />
                <Field label="운동 종목" value={athlete.sport} onChange={(v) => setAthlete((a) => ({ ...a, sport: v }))} placeholder="예: 축구, 태권도 등" />
              </div>

              <div className="p-3.5 rounded-xl border text-xs leading-relaxed text-center" style={{ background: C.paperDim, borderColor: C.line, color: C.inkDim }}>
                • 총 55문항 (TOPS2 28문항 + CSAI-2 27문항)<br />
                • 소요시간: 약 10분 내외
              </div>
            </div>
          )}

          {screen === 'tops2' && (
            <div>
              <p className="text-xs font-bold mb-3 font-mono text-center" style={{ color: C.accent }}>STEP 1 · TOPS2 수행전략검사 (28문항)</p>
              {TOPS2_ITEMS.map((it) => (
                <LikertItem key={it.no} no={it.no} text={it.text} options={TOPS2_LIKERT} value={tops2Res[it.no]} onChange={(no, v) => setTops2Res((r) => ({ ...r, [no]: v }))} idPrefix="tops2" />
              ))}
            </div>
          )}

          {screen === 'csai2' && (
            <div>
              <p className="text-xs font-bold mb-3 font-mono text-center" style={{ color: C.accent }}>STEP 2 · CSAI-2 경쟁상태불안 (27문항)</p>
              {CSAI2_ITEMS.map((it) => (
                <LikertItem key={it.no} no={it.no} text={it.text} options={CSAI2_LIKERT} value={csai2Res[it.no]} onChange={(no, v) => setCsai2Res((r) => ({ ...r, [no]: v }))} idPrefix="csai2" />
              ))}
            </div>
          )}

          {screen === 'results' && savedEntry && (
            <div className="pt-2">
              <div className="p-4 rounded-xl border mb-4 text-center" style={{ background: C.card, borderColor: C.line }}>
                <h2 className="text-base font-bold">{savedEntry.athlete.name} 선수 결과</h2>
                <p className="text-xs text-gray-500">{savedEntry.athlete.org} · {savedEntry.athlete.sport}</p>
              </div>

              <p className="text-xs font-bold font-mono uppercase tracking-wider text-center" style={{ color: C.accent }}>TOPS2 프로파일</p>
              <ScoreRadar data={tops2Merged.map((s) => ({ subject: s.name, value: Number(s.norm.toFixed(1)) }))} />
              <div className="rounded-2xl border p-2 mb-6 shadow-sm" style={{ background: C.card, borderColor: C.line }}>
                {tops2Merged.map((s) => (
                  <ScoreRow key={s.key} name={s.name} raw={s.raw} max={s.max} norm={s.norm} desc={s.desc} />
                ))}
              </div>

              <p className="text-xs font-bold font-mono uppercase tracking-wider text-center mt-6" style={{ color: C.accent }}>CSAI-2 · 경쟁상태불안검사</p>
              <ScoreRadar data={csai2Merged.map((s) => ({ subject: s.name, value: Number(s.norm.toFixed(1)) }))} />
              <div className="rounded-2xl border p-2 shadow-sm" style={{ background: C.card, borderColor: C.line }}>
                {csai2Merged.map((s) => (
                  <ScoreRow key={s.key} name={s.name} raw={s.raw} max={s.max} norm={s.norm} desc={s.desc} />
                ))}
              </div>

              <button onClick={() => setScreen('intro')} className="w-full py-3.5 mt-6 rounded-xl border font-bold text-sm bg-white shadow-sm flex items-center justify-center gap-2">
                <RotateCcw size={16} /> 새 검사 시작하기
              </button>
            </div>
          )}

          {screen === 'admin' && (
            <div className="pt-3 text-left">
              <button onClick={() => setScreen('intro')} className="text-xs font-mono font-bold flex items-center gap-1 mb-4 px-2 py-1 rounded" style={{ color: C.inkDim }}>
                <ChevronLeft size={16} /> 돌아가기
              </button>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold" style={{ color: C.ink }}>내 기기 저장 데이터</h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ background: C.paperDim, color: C.inkDim }}>
                  {adminEntries.length}건
                </span>
              </div>

              <div className="flex gap-2 mb-4">
                <button onClick={exportCSV} disabled={!adminEntries.length} className="flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 shadow-sm" style={{ background: C.ink, color: '#FFF' }}>
                  <Download size={15} /> CSV 다운로드
                </button>
                <button onClick={() => (confirmClear ? clearAll() : setConfirmClear(true))} disabled={!adminEntries.length} className="py-3 px-4 rounded-xl text-xs font-bold border disabled:opacity-40 flex items-center gap-1 shadow-sm" style={{ borderColor: confirmClear ? C.accent : C.line, color: confirmClear ? C.accent : C.inkDim, background: C.card }}>
                  <Trash2 size={15} />
                  {confirmClear ? '삭제 확인' : '전체 삭제'}
                </button>
              </div>

              {!adminLoading && adminEntries.length > 0 && (
                <div className="overflow-x-auto -mx-4 px-4">
                  <table className="text-xs font-mono border-collapse w-full" style={{ minWidth: 600 }}>
                    <thead>
                      <tr className="border-b" style={{ borderColor: C.line }}>
                        {['시간', '이름', '소속', '종목', ...TOPS2_SUBSCALES.map((s) => s.name), ...CSAI2_SUBSCALES.map((s) => s.name)].map((h) => (
                          <th key={h} className="text-left py-2.5 pr-3 font-bold whitespace-nowrap" style={{ color: C.inkDim }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {adminEntries.map((e) => (
                        <tr key={e.key} className="border-b" style={{ borderColor: C.line }}>
                          <td className="py-2.5 pr-3 whitespace-nowrap font-medium" style={{ color: C.ink }}>{new Date(e.timestamp).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                          <td className="py-2.5 pr-3 whitespace-nowrap font-bold" style={{ color: C.ink }}>{e.athlete && e.athlete.name}</td>
                          <td className="py-2.5 pr-3 whitespace-nowrap" style={{ color: C.inkDim }}>{e.athlete && e.athlete.org}</td>
                          <td className="py-2.5 pr-3 whitespace-nowrap" style={{ color: C.inkDim }}>{e.athlete && e.athlete.sport}</td>
                          {(e.tops2 && e.tops2.scores ? e.tops2.scores : []).map((s) => (
                            <td key={s.key} className="py-2.5 pr-3 font-bold whitespace-nowrap" style={{ color: C.ink }}>{s.raw}</td>
                          ))}
                          {(e.csai2 && e.csai2.scores ? e.csai2.scores : []).map((s) => (
                            <td key={s.key} className="py-2.5 pr-3 font-bold whitespace-nowrap" style={{ color: C.ink }}>{s.raw}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <div className="w-full max-w-lg px-4 pb-6 pt-3 pointer-events-auto" style={{ background: `linear-gradient(to top, ${C.paper} 90%, transparent)` }}>
            {errorMsg && (
              <div className="flex items-center justify-center gap-1.5 mb-2 text-xs font-bold p-2 rounded-lg border" style={{ color: C.accent, background: `${C.accent}10`, borderColor: `${C.accent}30` }}>
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}
            {screen === 'intro' && (
              <button onClick={goToTops2} className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-1 text-base shadow-md" style={{ background: C.ink, color: '#FFF' }}>
                검사 시작하기 <ChevronRight size={18} />
              </button>
            )}
            {screen === 'tops2' && (
              <button onClick={goToCsai2} className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-1 text-base shadow-md" style={{ background: C.ink, color: '#FFF' }}>
                다음: 경쟁상태불안검사 <ChevronRight size={18} />
              </button>
            )}
            {screen === 'csai2' && (
              <button onClick={submitAll} className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-1 text-base shadow-md" style={{ background: C.accent, color: '#FFF' }}>
                제출하고 결과 보기 <Check size={18} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
