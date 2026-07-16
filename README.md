# SPECTRA PHOTOBOOTH

딥 인디고와 청백색 오로라, 별빛, 푸른 성운을 중심으로 구성한 몽환적인 4컷 포토부스입니다.
실제 웹캠으로 사진을 촬영하고 프레임과 스펙트럴 오브젝트를 편집한 뒤 PNG로 저장할 수 있습니다.

## 실행

카메라 API는 브라우저 보안 정책 때문에 `file://` 대신 `localhost` 또는 HTTPS에서 여는 것이 안전합니다.

```bash
cd "/Users/cacilielae/Documents/포토부스 웹사이트 제작"
python3 -m http.server 5174
```

브라우저에서 `http://localhost:5174` 또는 `http://127.0.0.1:5174` 로 접속한 뒤 카메라 권한을 허용합니다.

## 포함 기능

- 실사 밤하늘 영상과 잔잔하게 반짝이는 별빛 배경
- 자동재생을 시도하고 첫 화면 터치로 보완되는 반복 배경음악
- 4컷 포토 프레임 미리보기
- 웹캠 실시간 프리뷰와 3초 카운트다운
- 1컷 수동 촬영과 4컷 연속 촬영
- 원하는 컷 선택 후 다시 촬영
- 우주 프레임 테마 4종: Aurora Veil, Starlit Mirror, Blue Nebula, Astral Spiral
- 오브젝트 드래그, 크기, 회전, 좌우 반전, 삭제
- 고해상도 PNG 저장
- 최근 저장본 `localStorage` 갤러리

## 배경음악 교체

`assets/audio/fantasy-universe-night-forest.mp3` 파일을 같은 이름의 MP3로 교체하면 됩니다.
모바일 브라우저에서 소리 자동재생이 차단될 경우 첫 화면 터치와 동시에 재생됩니다.

음원 출처: 전주정보문화산업진흥원
