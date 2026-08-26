import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { ChevronRight, ChevronLeft, Check, Download, AlertCircle, RotateCcw, Trash2, Smartphone, X } from 'lucide-react';

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
  { key: 'selfTalk', name: '혼잣말', items: [1, 2, 3, 4], reverse: [], positive: true,
    def: '시합 수행에 도움이 되는 말을 스스로에게 건네는 심리기술.',
    high: '과제 중심의 긍정적 혼잣말을 효과적으로 활용하고 있어요.',
    low: '혼잣말을 거의 활용하지 못하거나, 활용해도 효과를 못 느끼고 있어요.',
    tip: '시합 전 짧고 구체적인 격려·지시 문구(예: "짧고 강하게")를 미리 정해두고 훈련에서부터 반복해보세요.' },
  { key: 'emotionControl', name: '감정조절', items: [5, 6, 7, 8], reverse: [5, 6, 7, 8], positive: true,
    def: '경기 전이나 중에 유발되는 감정(부담·흥분·실수 후 동요)을 다스리는 능력.',
    high: '압박이 큰 상황에서도 감정 기복 없이 평정심을 잘 유지해요.',
    low: '부담이 크거나 실수를 하면 감정이 쉽게 흔들리는 편이에요.',
    tip: '실수 직후 쓰는 짧은 리셋 루틴(호흡 1회 + 정해둔 동작)을 만들어 감정이 이어지지 않도록 끊어보세요.' },
  { key: 'automaticity', name: '자동적수행', items: [9, 10, 11], reverse: [], positive: true,
    def: '동작 하나하나에 의식적으로 신경 쓰지 않아도 기술이 자연스럽게 나오는 정도.',
    high: '충분히 자동화되어 있어 실행 중 과도하게 생각하지 않고 몸이 알아서 반응해요.',
    low: '동작마다 의식적으로 신경 써야 하거나, 생각이 많아져 동작이 끊기는 편이에요.',
    tip: '지나치게 분석적으로 동작을 되짚기보다, 결과 이미지에만 집중하는 과제중심 연습을 반복해 절차기억을 강화해보세요.' },
  { key: 'goalSetting', name: '목표설정', items: [12, 13, 14, 15], reverse: [], positive: true,
    def: '시합을 위한 개인 목표를 구체적으로 세우고 달성 여부를 스스로 점검하는 습관.',
    high: '세부적인 목표를 세우고 시합 후 달성 여부까지 평가하는 습관이 잡혀 있어요.',
    low: '뚜렷한 목표 없이 즉흥적으로 시합에 임하는 경향이 있어요.',
    tip: '결과(순위·기록)뿐 아니라 과정 목표(예: 특정 기술 성공률)를 함께 세우고, 시합 후 3줄 피드백을 남겨보세요.' },
  { key: 'imagery', name: '심상', items: [16, 17, 18, 19], reverse: [], positive: true,
    def: '실제 수행과 유사한 장면을 감각적으로 머릿속에 그려보는 기술(이미지 트레이닝).',
    high: '시합 전 원하는 동작과 상황을 생생하게 상상하는 훈련이 잘 되어 있어요.',
    low: '심상 훈련을 거의 활용하지 않거나 이미지가 잘 그려지지 않는 편이에요.',
    tip: '훈련 전후 5분씩, 성공적인 수행 장면을 시각·촉각·소리까지 함께 떠올리는 연습을 루틴화해보세요.' },
  { key: 'relaxation', name: '긴장풀기', items: [20, 21, 22, 23], reverse: [], positive: true,
    def: '어려운 상황에서도 스스로를 침착하고 편안한 상태로 되돌리는 능력.',
    high: '긴장이 높아져도 스스로 이완 상태로 전환하는 방법을 잘 알고 있어요.',
    low: '한 번 긴장하면 스스로 풀기 어려워하는 편이에요.',
    tip: '점진적 근육이완이나 4-4-8 호흡 같은 구체적 이완 루틴을 정해 시합 전 루틴에 포함시켜보세요.' },
  { key: 'negativeThinking', name: '부정적생각', items: [24, 25], reverse: [], positive: false,
    def: '시합 중 실수 장면이나 실패 이미지가 떠오르는 정도(점수가 낮을수록 좋음).',
    high: '실수나 실패 장면이 자주 떠올라 수행에 방해가 될 수 있어요.',
    low: '부정적인 이미지에 크게 휘둘리지 않는 편이에요.',
    tip: '부정적 생각이 떠오르는 순간 알아차리고, 미리 정해둔 키워드나 동작으로 즉시 전환하는 "STOP-전환" 연습을 해보세요.' },
  { key: 'distractibility', name: '주의산만', items: [26, 27, 28], reverse: [], positive: false,
    def: '시각적 방해요인이나 시합 환경 조건(소음, 날씨 등)에 영향을 받는 정도(점수가 낮을수록 좋음).',
    high: '외부 자극이나 환경 변화에 비교적 쉽게 흔들리는 편이에요.',
    low: '외부 방해요인이 있어도 집중을 잘 유지하는 편이에요.',
    tip: '훈련 중 일부러 소음이나 관중 등 방해 자극을 노출시켜, 그 상황에서도 루틴을 유지하는 연습을 해보세요.' },
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
  { key: 'cognitive', name: '인지적불안', items: [1, 4, 7, 10, 13, 16, 19, 22, 25], reverse: [], positive: false,
    def: '시합 결과나 실패에 대한 걱정, 부정적 기대 등 생각 차원의 불안(점수가 낮을수록 좋음).',
    high: '결과나 실패 가능성에 대한 걱정이 큰 편이에요.',
    low: '결과에 대한 불필요한 걱정 없이 시합에 임하는 편이에요.',
    tip: '결과가 아닌 과정 목표("이번 세트에 이 기술만 성공하자")로 초점을 좁히는 인지적 재구성 연습을 해보세요.' },
  { key: 'somatic', name: '신체적불안', items: [2, 5, 8, 11, 14, 17, 20, 23, 26], reverse: [14], positive: false,
    def: '심장박동, 근육 긴장, 손떨림 등 몸으로 나타나는 각성 증상(점수가 낮을수록 좋음).',
    high: '시합 상황에서 신체적 긴장·각성 증상이 뚜렷하게 나타나는 편이에요.',
    low: '신체적으로 비교적 편안한 상태를 유지하는 편이에요.',
    tip: '호흡 조절과 점진적 근육이완을 시합 전 워밍업 루틴에 포함시켜 각성 수준을 미리 낮춰보세요.' },
  { key: 'selfConfidence', name: '상태자신감', items: [3, 6, 9, 12, 15, 18, 21, 24, 27], reverse: [], positive: true,
    def: '시합 수행에 대해 스스로 느끼는 자신감의 정도.',
    high: '시합에 대처하고 잘 해낼 수 있다는 자신감이 높은 편이에요.',
    low: '수행에 대한 의구심이 있거나 자신감이 낮은 편이에요.',
    tip: '최근 성공했던 경험을 구체적으로 떠올리거나, 강점 리스트를 시합 전에 다시 읽는 루틴을 만들어보세요.' },
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

function ScoreRow({ name, raw, max, norm, def, high, low, tip, positive }) {
  const level = norm >= 60 ? 'high' : norm <= 40 ? 'low' : 'mid';
  const levelText = level === 'high' ? high : level === 'low' ? low : '두드러지지 않은 보통 수준의 반응을 보여요.';
  const levelColor = level === 'mid' ? C.inkDim : (level === 'high') === positive ? C.accent2 : C.accent;
  return (
    <div className="py-4 border-b last:border-b-0 text-center">
      <h3 className="text-base font-black mb-1" style={{ color: C.ink }}>{name}</h3>
      <div className="mb-1">
        <span className="font-mono text-xl font-black" style={{ color: C.ink }}>{norm.toFixed(1)}</span>
        <span className="text-xs font-mono font-semibold" style={{ color: C.inkDim }}> / 100점</span>
        <span className="ml-1.5 text-[10px] font-bold" style={{ color: C.inkDim }}>({positive ? '높을수록 좋음' : '낮을수록 좋음'})</span>
      </div>
      {def && <p className="text-xs font-medium leading-relaxed mb-2 px-2" style={{ color: C.inkDim }}>{def}</p>}
      <div className="w-full h-2 rounded-full overflow-hidden mb-2 max-w-xs mx-auto" style={{ background: C.paperDim }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, norm))}%`, background: C.accent }} />
      </div>
      <p className="text-xs font-mono font-bold mb-2" style={{ color: C.inkDim }}>원점수 {raw} / {max}점</p>
      {levelText && (
        <p className="text-xs font-bold leading-relaxed mb-2 px-2" style={{ color: levelColor }}>{levelText}</p>
      )}
      {tip && (
        <p className="text-[11px] leading-relaxed px-3 py-2 rounded-lg mx-2" style={{ background: C.paperDim, color: C.inkDim }}>💡 {tip}</p>
      )}
    </div>
  );
}

/* ================= Main App ================= */
export default function App() {
  // ===== 새로고침해도 진행 중이던 화면/응답이 유지되도록 처리 =====
  const DRAFT_KEY = 'mc_draft_v1';
  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  const draft = loadDraft();

  const [screen, setScreen] = useState(draft?.screen || 'intro');
  const [athlete, setAthlete] = useState(draft?.athlete || { name: '', org: '', sport: '' });
  const [tops2Res, setTops2Res] = useState(draft?.tops2Res || {});
  const [csai2Res, setCsai2Res] = useState(draft?.csai2Res || {});
  const [errorMsg, setErrorMsg] = useState('');
  const [savedEntry, setSavedEntry] = useState(draft?.savedEntry || null);
  const [adminEntries, setAdminEntries] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  // ===== 앱 설치(PWA) 관련 상태 =====
  const [installPrompt, setInstallPrompt] = useState(null); // 안드로이드/데스크톱 크롬이 던져주는 설치 이벤트
  const [isStandalone, setIsStandalone] = useState(false);  // 이미 앱으로 실행 중인지
  const [isIOS, setIsIOS] = useState(false);                // iOS는 beforeinstallprompt를 지원 안 함
  const [showIOSGuide, setShowIOSGuide] = useState(false);  // iOS용 수동 안내 팝업
  const [confirmGoIntro, setConfirmGoIntro] = useState(false); // 처음화면 이동 확인 팝업 (window.confirm 대신 자체 구현)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ screen, athlete, tops2Res, csai2Res, savedEntry }));
    } catch {
      // 저장 실패는 무시 (용량 초과 등)
    }
  }, [screen, athlete, tops2Res, csai2Res, savedEntry]);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsStandalone(standalone);

    const ua = window.navigator.userAgent || '';
    setIsIOS(/iphone|ipad|ipod/i.test(ua) && !window.MSStream);

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const onInstalled = () => {
      setInstallPrompt(null);
      setIsStandalone(true);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function handleInstallClick() {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  const showInstallButton = !isStandalone && (isIOS || !!installPrompt);

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
    } catch (e) {}
    setSavedEntry(entry);
    setScreen('results');
  }

  function startNewTest() {
    setAthlete({ name: '', org: '', sport: '' });
    setTops2Res({});
    setCsai2Res({});
    setSavedEntry(null);
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
    setScreen('intro');
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
    } catch {}
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

        <div className="sticky top-0 z-10 py-3 border-b backdrop-blur-md mb-2 flex items-center justify-between" style={{ background: `${C.paper}F2`, borderColor: C.line }}>
          <div className="w-16"></div>
          <div className="text-center flex-1">
            <p className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: C.accent }}>Mental Skills Check</p>
            <h1 className="text-lg font-black tracking-tight" style={{ color: C.ink }}>스포츠심리기술 검사</h1>
          </div>
          <div className="w-16 text-right">
            {screen !== 'admin' && (
              <button onClick={goAdmin} className="text-xs font-bold px-2.5 py-1.5 rounded-lg border bg-white shadow-sm whitespace-nowrap" style={{ borderColor: C.line, color: C.inkDim }}>
                데이터 보기
              </button>
            )}
          </div>
        </div>

        {showInstallButton && screen === 'intro' && (
          <button
            onClick={handleInstallClick}
            className="w-full mt-2 mb-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-sm border"
            style={{ background: C.card, borderColor: C.accent, color: C.accent }}
          >
            <Smartphone size={16} /> 홈 화면에 앱으로 설치하기
          </button>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setShowIOSGuide(false)}>
            <div className="w-full max-w-lg bg-white rounded-t-2xl p-5 pb-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold" style={{ color: C.ink }}>iPhone에서 앱으로 설치하기</h3>
                <button onClick={() => setShowIOSGuide(false)}><X size={18} style={{ color: C.inkDim }} /></button>
              </div>
              <ol className="text-sm leading-relaxed space-y-2" style={{ color: C.inkDim }}>
                <li>1. Safari 하단(또는 상단)의 공유 버튼 <span style={{ fontWeight: 700 }}>⬆️</span>을 눌러요.</li>
                <li>2. 메뉴를 아래로 내려 <span style={{ fontWeight: 700, color: C.ink }}>"홈 화면에 추가"</span>를 눌러요.</li>
                <li>3. 오른쪽 위 <span style={{ fontWeight: 700, color: C.ink }}>"추가"</span>를 누르면 완료돼요.</li>
              </ol>
            </div>
          </div>
        )}

        {confirmGoIntro && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setConfirmGoIntro(false)}>
            <div className="w-full max-w-xs bg-white rounded-2xl p-5 text-center shadow-lg" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm font-bold mb-1" style={{ color: C.ink }}>처음 화면으로 돌아갈까요?</p>
              <p className="text-xs leading-relaxed mb-4" style={{ color: C.inkDim }}>지금까지 답변은 그대로 저장돼요.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmGoIntro(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border"
                  style={{ borderColor: C.line, color: C.inkDim, background: C.card }}
                >
                  취소
                </button>
                <button
                  onClick={() => { setConfirmGoIntro(false); setScreen('intro'); }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold"
                  style={{ background: C.ink, color: '#FFF' }}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="pb-28 flex-1">
          {screen === 'intro' && (
            <div className="pt-2">
              <div className="p-5 rounded-2xl border shadow-sm mb-4" style={{ background: C.card, borderColor: C.line }}>
                <h2 className="text-sm font-bold mb-4 pb-2 border-b text-center" style={{ color: C.ink, borderColor: C.line }}>피검사자 정보 입력</h2>
                <Field label="이름 또는 식별 코드" value={athlete.name} onChange={(v) => setAthlete((a) => ({ ...a, name: v }))} placeholder="예: 홍길동 또는 A-01" />
                <Field label="소속 팀 / 학과" value={athlete.org} onChange={(v) => setAthlete((a) => ({ ...a, org: v }))} placeholder="예: OO대학교 / OO팀" />
                <Field label="운동 종목" value={athlete.sport} onChange={(v) => setAthlete((a) => ({ ...a, sport: v }))} placeholder="예: 축구, 태권도 등" />
              </div>
              <div className="p-3.5 rounded-xl border text-xs leading-relaxed text-center" style={{ background: C.paperDim, borderColor: C.line, color: C.inkDim }}>
                • 총 55문항 (TOPS2 28문항 + CSAI-2 27문항)<br />• 소요시간: 약 10분 내외
              </div>
            </div>
          )}

          {screen === 'tops2' && (
            <div>
              <button
                onClick={() => setConfirmGoIntro(true)}
                className="w-full mb-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold border"
                style={{ borderColor: C.line, background: C.card, color: C.inkDim }}
              >
                <ChevronLeft size={14} /> 처음 화면으로
              </button>
              <p className="text-xs font-bold mb-3 font-mono text-center" style={{ color: C.accent }}>STEP 1 · TOPS2 수행전략검사 (28문항)</p>
              {TOPS2_ITEMS.map((it) => (
                <LikertItem key={it.no} no={it.no} text={it.text} options={TOPS2_LIKERT} value={tops2Res[it.no]} onChange={(no, v) => setTops2Res((r) => ({ ...r, [no]: v }))} idPrefix="tops2" />
              ))}
            </div>
          )}

          {screen === 'csai2' && (
            <div>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setScreen('tops2')}
                  className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold border"
                  style={{ borderColor: C.line, background: C.card, color: C.ink }}
                >
                  <ChevronLeft size={14} /> 이전 문항으로 (TOPS2)
                </button>
                <button
                  onClick={() => setConfirmGoIntro(true)}
                  className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold border"
                  style={{ borderColor: C.line, background: C.card, color: C.inkDim }}
                >
                  처음 화면으로
                </button>
              </div>
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
                  <ScoreRow key={s.key} name={s.name} raw={s.raw} max={s.max} norm={s.norm} def={s.def} high={s.high} low={s.low} tip={s.tip} positive={s.positive} />
                ))}
              </div>

              <p className="text-xs font-bold font-mono uppercase tracking-wider text-center mt-6" style={{ color: C.accent }}>CSAI-2 · 경쟁상태불안검사</p>
              <ScoreRadar data={csai2Merged.map((s) => ({ subject: s.name, value: Number(s.norm.toFixed(1)) }))} />
              <div className="rounded-2xl border p-2 shadow-sm" style={{ background: C.card, borderColor: C.line }}>
                {csai2Merged.map((s) => (
                  <ScoreRow key={s.key} name={s.name} raw={s.raw} max={s.max} norm={s.norm} def={s.def} high={s.high} low={s.low} tip={s.tip} positive={s.positive} />
                ))}
              </div>

              <button onClick={startNewTest} className="w-full py-3.5 mt-6 rounded-xl border font-bold text-sm bg-white shadow-sm flex items-center justify-center gap-2">
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
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ background: C.paperDim, color: C.inkDim }}>{adminEntries.length}건</span>
              </div>

              <div className="flex gap-2 mb-4">
                <button onClick={exportCSV} disabled={!adminEntries.length} className="flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 shadow-sm" style={{ background: C.ink, color: '#FFF' }}>
                  <Download size={15} /> CSV 다운로드
                </button>
                <button onClick={() => (confirmClear ? clearAll() : setConfirmClear(true))} disabled={!adminEntries.length} className="py-3 px-4 rounded-xl text-xs font-bold border disabled:opacity-40 flex items-center gap-1 shadow-sm" style={{ borderColor: confirmClear ? C.accent : C.line, color: confirmClear ? C.accent : C.inkDim, background: C.card }}>
                  <Trash2 size={15} />{confirmClear ? '삭제 확인' : '전체 삭제'}
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
              {!adminLoading && !adminEntries.length && (
                <p className="text-xs" style={{ color: C.inkDim }}>아직 저장된 응답이 없어요.</p>
              )}
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <div className="w-full max-w-lg px-4 pb-6 pt-3 pointer-events-auto" style={{ background: `linear-gradient(to top, ${C.paper} 90%, transparent)` }}>
            {errorMsg && (
              <div className="flex items-center justify-center gap-1.5 mb-2 text-xs font-bold p-2 rounded-lg border" style={{ color: C.accent, background: `${C.accent}10`, borderColor: `${C.accent}30` }}>
                <AlertCircle size={14} /><span>{errorMsg}</span>
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
