// 최소 서비스 워커: PWA 설치(홈 화면 추가) 조건을 만족시키기 위한 용도입니다.
// 데모용이라 오프라인 캐싱은 하지 않고, fetch 이벤트만 등록합니다.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 네트워크 요청을 그대로 통과시킵니다 (오프라인 캐싱 없음).
});
