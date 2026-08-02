const STORAGE_KEY = "bunny-pop-saved-strips";
const COUNTDOWN_SECONDS = 3;
const CUT_COUNT = 4;
const AUTO_SHOT_GAP_MS = 900;
const STICKER_BASE_WIDTH_RATIO = 0.17;
const BACKDROP_LOOP_MS = 36000;
const BACKDROP_STAR_COUNT = 240;
const BACKDROP_STREAK_COUNT = 3;
const MAX_BACKDROP_PIXEL_RATIO = 1.5;
const BACKGROUND_VIDEO_RATE = 0.35;
const BACKGROUND_VIDEO_CROSSFADE_SOURCE_SECONDS = 1.32;
const BACKGROUND_VIDEO_CROSSFADE_MS = Math.round(
  (BACKGROUND_VIDEO_CROSSFADE_SOURCE_SECONDS / BACKGROUND_VIDEO_RATE) * 1000,
);
const BACKGROUND_MUSIC_VOLUME = 0.38;
const MEDIA_UNLOCK_EVENTS = ["pointerdown", "touchstart", "click", "keydown"];
const REDUCED_MOTION_QUERY = window.matchMedia("(prefers-reduced-motion: reduce)");
const PHOTO_WIDTH = 960;
const PHOTO_HEIGHT = 1200;
const MEDIAPIPE_VISION_VERSION = "1.0.1";
const MEDIAPIPE_VISION_MODULE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VISION_VERSION}/vision_bundle.mjs`;
const MEDIAPIPE_WASM_PATH = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VISION_VERSION}/wasm`;
const PERSON_SEGMENTATION_MODEL = new URL(
  "./assets/models/selfie-multiclass-256x256.tflite",
  document.baseURI,
).href;
const PERSON_SEGMENTATION_FALLBACK_MODEL = new URL(
  "./assets/models/selfie-segmenter.tflite",
  document.baseURI,
).href;
const PERSON_MASK_SOFT_EDGE_START = 0.18;
const PERSON_MASK_SOFT_EDGE_END = 0.72;
const PERSON_MASK_MIN_VISIBLE_RATIO = 0.0005;
const CAMERA_PERMISSION_TIMEOUT_MS = 15000;

const portraitBackgrounds = [
  { id: "blush", name: "블러시", color: "#e5b5cf" },
  { id: "lilac", name: "라일락", color: "#bba5d5" },
  { id: "moon", name: "문 펄", color: "#eadde8" },
  { id: "mauve", name: "모브", color: "#775577" },
];

const themes = [
  {
    id: "aurora",
    name: "Aurora Veil",
    description: "핑크빛 오로라가 커튼처럼 흐르는 몽환적인 프레임",
    className: "theme-aurora",
    preview: ["#3a214a", "#f2a9d4"],
    tagLine: "AURORA VEIL / LIGHT CURTAIN / SERIES 04",
    shellLabel: "POLAR LIGHT DREAM ARCHIVE",
    seed: 11,
    palette: {
      bgA: "#3a214a",
      bgB: "#9b5a83",
      bgC: "#2b1839",
      ink: "#fff8fd",
      border: "#f7dced",
      frameFill: "rgba(75,38,81,0.36)",
      accent: "#ff9fd1",
      accentSoft: "#efd3ff",
    },
  },
  {
    id: "starlight",
    name: "Starlit Mirror",
    description: "수평선 위로 별빛이 번져 반사되는 고요한 우주 프레임",
    className: "theme-starlight",
    preview: ["#21142c", "#c27baa"],
    tagLine: "STARLIT MIRROR / WISH UPON THE WATER / 04",
    shellLabel: "REFLECTED STARLIGHT ARCHIVE",
    seed: 23,
    palette: {
      bgA: "#21142c",
      bgB: "#744778",
      bgC: "#29172f",
      ink: "#fff8fd",
      border: "#f5ddea",
      frameFill: "rgba(61,33,68,0.42)",
      accent: "#e0a1d1",
      accentSoft: "#f3d9ff",
    },
  },
  {
    id: "nebula",
    name: "Lilac Nebula",
    description: "라일락 성운과 미세한 별가루가 감싸는 몽환적인 프레임",
    className: "theme-nebula",
    preview: ["#321b48", "#d27aaf"],
    tagLine: "LILAC NEBULA / STARDUST MEMORY / NO. 04",
    shellLabel: "CELESTIAL CLOUD OBSERVATORY",
    seed: 37,
    palette: {
      bgA: "#321b48",
      bgB: "#8d527f",
      bgC: "#24142f",
      ink: "#fff7fd",
      border: "#f3d8ef",
      frameFill: "rgba(67,34,77,0.38)",
      accent: "#f69acb",
      accentSoft: "#e6cdff",
    },
  },
  {
    id: "astral",
    name: "Astral Spiral",
    description: "두 개의 은하 소용돌이와 푸른 성운광을 담은 프레임",
    className: "theme-astral",
    preview: ["#28163b", "#9b6ac8"],
    tagLine: "ASTRAL SPIRAL / TWIN GALAXIES / SERIES 04",
    shellLabel: "DEEP SPACE DREAM SEQUENCE",
    seed: 53,
    palette: {
      bgA: "#28163b",
      bgB: "#714595",
      bgC: "#1b1029",
      ink: "#fff8ff",
      border: "#ead8f8",
      frameFill: "rgba(55,29,70,0.4)",
      accent: "#c99cf4",
      accentSoft: "#f0d8ff",
    },
  },
];

function svgToDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createStickerAssetLibrary() {
  return [
    {
      id: "spectral-alien",
      label: "Spectral Alien",
      dataUrl: svgToDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
          <defs>
            <linearGradient id="spectralBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f7fbff"/>
              <stop offset="56%" stop-color="#ffd0e8"/>
              <stop offset="100%" stop-color="#b58ad9"/>
            </linearGradient>
            <filter id="spectralGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <g filter="url(#spectralGlow)" stroke="#f5f8ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M82 52c-8-20-4-34 8-34 13 0 19 12 19 29M158 52c8-20 4-34-8-34-13 0-19 12-19 29" fill="none"/>
            <path d="M86 20l8 9-8 9-8-9zM154 20l8 9-8 9-8-9z" fill="#f3c6ff"/>
            <path d="M65 72l30-29 15 17M175 72l-30-29-15 17" fill="none"/>
            <path d="M69 67h102v91c0 31-23 55-51 55s-51-24-51-55z" fill="url(#spectralBody)" fill-opacity=".9"/>
            <ellipse cx="94" cy="117" rx="17" ry="24" fill="#2a1730"/>
            <ellipse cx="146" cy="117" rx="17" ry="24" fill="#2a1730"/>
            <circle cx="99" cy="110" r="5" fill="#ffffff" stroke="none"/>
            <circle cx="151" cy="110" r="5" fill="#ffffff" stroke="none"/>
            <path d="M113 150c4 4 10 4 14 0M99 178h42" fill="none"/>
          </g>
        </svg>
      `),
    },
    {
      id: "pulsar-mark",
      label: "Pulsar Mark",
      dataUrl: svgToDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
          <g stroke="#f6f8ff" fill="none" stroke-linecap="round">
            <circle cx="110" cy="110" r="12" fill="#ffffff"/>
            <circle cx="110" cy="110" r="44" stroke-width="2" opacity=".38"/>
            <path d="M110 14v192M14 110h192M42 42l136 136M178 42L42 178" stroke-width="5"/>
            <path d="M80 110a30 12 0 1 0 60 0 30 12 0 1 0-60 0" stroke="#f0acd7" stroke-width="3" transform="rotate(-18 110 110)"/>
          </g>
        </svg>
      `),
    },
    {
      id: "orbit-seal",
      label: "Orbit Seal",
      dataUrl: svgToDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 220">
          <g fill="none" stroke="#edf3ff" stroke-width="3">
            <ellipse cx="120" cy="110" rx="94" ry="34" transform="rotate(-18 120 110)"/>
            <ellipse cx="120" cy="110" rx="74" ry="18" transform="rotate(18 120 110)" opacity=".66"/>
            <circle cx="120" cy="110" r="45" stroke="#d7a8f4" opacity=".8"/>
            <path d="M120 28v164M38 110h164" opacity=".34"/>
            <circle cx="120" cy="110" r="7" fill="#ffffff" stroke="none"/>
            <circle cx="41" cy="134" r="6" fill="#ffabd5" stroke="none"/>
          </g>
        </svg>
      `),
    },
    {
      id: "seraph",
      label: "Seraph Silhouette",
      dataUrl: svgToDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
          <g fill="#f7f8ff">
            <circle cx="110" cy="56" r="18"/>
            <path d="M90 76h40l18 92H72z"/>
            <path d="M84 88C48 74 28 88 18 112c28-8 47 3 65 25z"/>
            <path d="M136 88c36-14 56 0 66 24-28-8-47 3-65 25z"/>
            <path d="M82 112c-30 2-48 18-52 42 24-12 44-8 60 5z" opacity=".72"/>
            <path d="M138 112c30 2 48 18 52 42-24-12-44-8-60 5z" opacity=".72"/>
          </g>
          <ellipse cx="110" cy="52" rx="32" ry="10" fill="none" stroke="#f0b6e3" stroke-width="4"/>
        </svg>
      `),
    },
    {
      id: "lunar-flower",
      label: "Lunar Flower",
      dataUrl: svgToDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
          <g fill="none" stroke="#f3f6ff" stroke-width="4">
            <path d="M110 56c-28-42-58-22-42 16 10 23 42 38 42 38s32-15 42-38c16-38-14-58-42-16z" fill="#d39be8" fill-opacity=".38"/>
            <path d="M110 110v88M110 154c-26-19-48-12-58 8 23 0 40 10 58 26M110 168c24-18 45-14 57 5-22-1-39 7-57 20"/>
            <circle cx="110" cy="92" r="10" fill="#ffffff"/>
            <path d="M110 20v28M96 34h28" stroke="#ffabd5"/>
          </g>
        </svg>
      `),
    },
  ];
}

const state = {
  currentWorkflowStep: 1,
  maxUnlockedWorkflowStep: 1,
  stream: null,
  isCountingDown: false,
  isAutoSession: false,
  selectedThemeId: "aurora",
  capturedPhotos: Array(CUT_COUNT).fill(null),
  rawCapturedPhotos: Array(CUT_COUNT).fill(null),
  portraitCutouts: Array(CUT_COUNT).fill(null),
  portraitBaseCutouts: Array(CUT_COUNT).fill(null),
  activeSlotIndex: 0,
  savedStrips: [],
  presetStickers: createStickerAssetLibrary(),
  stickers: [],
  selectedStickerId: null,
  nextStickerId: 1,
  frameLayout: null,
  backdropScene: null,
  backdropAnimationFrame: null,
  backgroundActiveVideoIndex: 0,
  backgroundVideoCrossfading: false,
  backgroundVideoMonitor: null,
  backgroundVideoTransitionTimer: null,
  backgroundVideoUnlockHandler: null,
  backgroundVideoVisibilityHandler: null,
  backgroundMusicDesired: true,
  backgroundMusicUnlockHandler: null,
  portraitBackgroundEnabled: true,
  selectedPortraitBackgroundId: portraitBackgrounds[0].id,
  portraitSegmenter: null,
  portraitSegmenterPromise: null,
  portraitVisionRuntimePromise: null,
  portraitCpuFallbackPromise: null,
  portraitSegmenterDelegate: null,
  portraitSegmenterCanvas: null,
  portraitSegmentationState: "idle",
  isPhotoProcessing: false,
  portraitEditorSlotIndex: null,
  portraitEditorMode: "erase",
  portraitEditorBrushSize: 80,
  portraitEditorRawCanvas: null,
  portraitEditorWorkingCutout: null,
  portraitEditorUndoSnapshot: null,
  portraitEditorCursor: null,
  portraitEditorLastPoint: null,
  portraitEditorPointerId: null,
  portraitEditorStatusMessage: "캔버스 위를 드래그해 누끼를 수정하세요.",
};

const refs = {
  workflowShell: document.getElementById("workflowShell"),
  workflowStages: Array.from(document.querySelectorAll("[data-workflow-step]")),
  workflowProgressItems: Array.from(document.querySelectorAll("[data-workflow-target]")),
  sharedPreviewModule: document.getElementById("sharedPreviewModule"),
  previewMountSticker: document.getElementById("previewMountSticker"),
  previewMountFinal: document.getElementById("previewMountFinal"),
  previewMountSave: document.getElementById("previewMountSave"),
  frameNextButton: document.getElementById("frameNextButton"),
  captureBackButton: document.getElementById("captureBackButton"),
  captureNextButton: document.getElementById("captureNextButton"),
  stickerBackButton: document.getElementById("stickerBackButton"),
  stickerNextButton: document.getElementById("stickerNextButton"),
  previewBackButton: document.getElementById("previewBackButton"),
  previewNextButton: document.getElementById("previewNextButton"),
  saveBackButton: document.getElementById("saveBackButton"),
  restartButton: document.getElementById("restartButton"),
  camera: document.getElementById("camera"),
  cameraStage: document.getElementById("cameraStage"),
  cameraStatus: document.getElementById("cameraStatus"),
  cameraEmpty: document.getElementById("cameraEmpty"),
  cameraMessage: document.getElementById("cameraMessage"),
  cameraHelp: document.getElementById("cameraHelp"),
  countdown: document.getElementById("countdown"),
  boothModeLabel: document.getElementById("boothModeLabel"),
  currentSlotLabel: document.getElementById("currentSlotLabel"),
  sessionMessage: document.getElementById("sessionMessage"),
  sessionStrip: document.getElementById("sessionStrip"),
  startCameraButton: document.getElementById("startCameraButton"),
  uploadPhotoButton: document.getElementById("uploadPhotoButton"),
  photoUploadInput: document.getElementById("photoUploadInput"),
  portraitBackgroundToggle: document.getElementById("portraitBackgroundToggle"),
  portraitBackgroundToggleLabel: document.getElementById("portraitBackgroundToggleLabel"),
  portraitBackgroundOptions: document.getElementById("portraitBackgroundOptions"),
  portraitSegmentationStatus: document.getElementById("portraitSegmentationStatus"),
  captureButton: document.getElementById("captureButton"),
  autoCaptureButton: document.getElementById("autoCaptureButton"),
  retakeButton: document.getElementById("retakeButton"),
  editPortraitButton: document.getElementById("editPortraitButton"),
  resetButton: document.getElementById("resetButton"),
  saveButton: document.getElementById("saveButton"),
  slotStatus: document.getElementById("slotStatus"),
  frameStatus: document.getElementById("frameStatus"),
  cosmicBackgroundVideos: Array.from(document.querySelectorAll(".cosmic-background-video")),
  galaxyBackground: document.getElementById("galaxyBackground"),
  backgroundMusic: document.getElementById("backgroundMusic"),
  musicToggleButton: document.getElementById("musicToggleButton"),
  stripPreview: document.getElementById("stripPreview"),
  stripInner: document.getElementById("stripInner"),
  stripCosmos: document.getElementById("stripCosmos"),
  stripSlots: document.getElementById("stripSlots"),
  stripThemeName: document.getElementById("stripThemeName"),
  footerTimestamp: document.getElementById("footerTimestamp"),
  themeOptions: document.getElementById("themeOptions"),
  themeSummary: document.getElementById("themeSummary"),
  stickerOptions: document.getElementById("stickerOptions"),
  stickerLayer: document.getElementById("stickerLayer"),
  clearStickersButton: document.getElementById("clearStickersButton"),
  savedGallery: document.getElementById("savedGallery"),
  themeButtonTemplate: document.getElementById("themeButtonTemplate"),
  stickerButtonTemplate: document.getElementById("stickerButtonTemplate"),
  portraitEditorOverlay: document.getElementById("portraitEditorOverlay"),
  portraitEditorTitle: document.getElementById("portraitEditorTitle"),
  portraitEditorCutLabel: document.getElementById("portraitEditorCutLabel"),
  portraitEditorCanvas: document.getElementById("portraitEditorCanvas"),
  portraitEraseButton: document.getElementById("portraitEraseButton"),
  portraitRestoreButton: document.getElementById("portraitRestoreButton"),
  portraitBrushSize: document.getElementById("portraitBrushSize"),
  portraitBrushSizeValue: document.getElementById("portraitBrushSizeValue"),
  portraitUndoButton: document.getElementById("portraitUndoButton"),
  portraitResetMaskButton: document.getElementById("portraitResetMaskButton"),
  portraitEditorStatus: document.getElementById("portraitEditorStatus"),
  portraitEditorCancelButton: document.getElementById("portraitEditorCancelButton"),
  portraitEditorApplyButton: document.getElementById("portraitEditorApplyButton"),
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function normalizeHex(hex) {
  const value = hex.replace("#", "");
  return value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
}

function hexToRgb(hex) {
  const numeric = Number.parseInt(normalizeHex(hex), 16);
  return {
    r: (numeric >> 16) & 255,
    g: (numeric >> 8) & 255,
    b: numeric & 255,
  };
}

function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

function getSelectedPortraitBackground() {
  return (
    portraitBackgrounds.find((background) => background.id === state.selectedPortraitBackgroundId) ||
    portraitBackgrounds[0]
  );
}

function smoothstep(start, end, value) {
  const amount = clamp((value - start) / (end - start), 0, 1);
  return amount * amount * (3 - 2 * amount);
}

function setPortraitSegmentationState(nextState, message) {
  state.portraitSegmentationState = nextState;
  if (!refs.portraitSegmentationStatus) {
    return;
  }

  refs.portraitSegmentationStatus.dataset.state = nextState;
  refs.portraitSegmentationStatus.textContent = message;
}

function renderPortraitBackgroundOptions() {
  if (!refs.portraitBackgroundOptions) {
    return;
  }

  refs.portraitBackgroundOptions.innerHTML = "";
  refs.portraitBackgroundOptions.classList.toggle("is-disabled", !state.portraitBackgroundEnabled);

  portraitBackgrounds.forEach((background) => {
    const label = document.createElement("label");
    label.className = "portrait-background-option";
    label.title = `${background.name} 단색 배경`;

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "portrait-background";
    input.value = background.id;
    input.checked = background.id === state.selectedPortraitBackgroundId;
    input.disabled =
      !state.portraitBackgroundEnabled ||
      state.isCountingDown ||
      state.isAutoSession ||
      state.isPhotoProcessing;
    input.addEventListener("change", () => handlePortraitBackgroundChange(background.id));

    const choice = document.createElement("span");
    choice.className = "portrait-background-choice";

    const swatch = document.createElement("i");
    swatch.className = "portrait-background-swatch";
    swatch.style.setProperty("--portrait-background-color", background.color);
    swatch.setAttribute("aria-hidden", "true");

    const name = document.createElement("small");
    name.textContent = background.name;

    choice.append(swatch, name);
    label.append(input, choice);
    refs.portraitBackgroundOptions.appendChild(label);
  });
}

async function getPortraitVisionRuntime() {
  if (!state.portraitVisionRuntimePromise) {
    state.portraitVisionRuntimePromise = (async () => {
      const { FilesetResolver, ImageSegmenter } = await import(MEDIAPIPE_VISION_MODULE);
      const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_PATH);
      return { ImageSegmenter, vision };
    })().catch((error) => {
      state.portraitVisionRuntimePromise = null;
      throw error;
    });
  }

  return state.portraitVisionRuntimePromise;
}

async function createPortraitSegmenter(delegate, modelAssetPath = PERSON_SEGMENTATION_MODEL) {
  const { ImageSegmenter, vision } = await getPortraitVisionRuntime();
  const options = {
    runningMode: "IMAGE",
    outputCategoryMask: false,
    outputConfidenceMasks: true,
    baseOptions: {
      modelAssetPath,
      delegate,
    },
  };

  if (delegate === "GPU") {
    const gpuCanvas = document.createElement("canvas");
    gpuCanvas.width = 1;
    gpuCanvas.height = 1;
    const segmenter = await ImageSegmenter.createFromOptions(vision, {
      ...options,
      canvas: gpuCanvas,
    });
    return { segmenter, canvas: gpuCanvas };
  }

  const segmenter = await ImageSegmenter.createFromOptions(vision, options);
  return { segmenter, canvas: null };
}

function installPortraitSegmenter(created, delegate) {
  const previousSegmenter = state.portraitSegmenter;
  state.portraitSegmenter = created.segmenter;
  state.portraitSegmenterCanvas = created.canvas;
  state.portraitSegmenterDelegate = delegate;

  if (previousSegmenter && previousSegmenter !== created.segmenter) {
    previousSegmenter.close?.();
  }

  return created.segmenter;
}

async function ensurePortraitSegmenter() {
  if (state.portraitSegmenter) {
    if (state.portraitBackgroundEnabled) {
      const modeLabel =
        state.portraitSegmenterDelegate === "CPU"
          ? "호환 모드 누끼 준비 완료"
          : "자동 누끼 준비 완료";
      setPortraitSegmentationState("ready", modeLabel);
    }
    return state.portraitSegmenter;
  }

  if (state.portraitSegmenterPromise) {
    return state.portraitSegmenterPromise;
  }

  setPortraitSegmentationState("loading", "누끼 모델 불러오는 중");

  state.portraitSegmenterPromise = (async () => {
    let created;
    let delegate = "GPU";

    try {
      created = await createPortraitSegmenter("GPU");
    } catch (gpuError) {
      console.warn("GPU 누끼 초기화 실패, CPU로 전환합니다.", gpuError);
      delegate = "CPU";
      created = await createPortraitSegmenter("CPU", PERSON_SEGMENTATION_FALLBACK_MODEL);
    }

    const segmenter = installPortraitSegmenter(created, delegate);
    setPortraitSegmentationState(
      state.portraitBackgroundEnabled ? "ready" : "disabled",
      state.portraitBackgroundEnabled
        ? delegate === "CPU"
          ? "호환 모드 누끼 준비 완료"
          : "자동 누끼 준비 완료"
        : "원본 배경 사용 중",
    );
    return segmenter;
  })().catch((error) => {
    state.portraitSegmenterPromise = null;
    setPortraitSegmentationState("error", "누끼 준비 실패 · 원본 유지");
    throw error;
  });

  return state.portraitSegmenterPromise;
}

async function ensureCpuPortraitSegmenter() {
  if (state.portraitSegmenter && state.portraitSegmenterDelegate === "CPU") {
    return state.portraitSegmenter;
  }

  if (!state.portraitCpuFallbackPromise) {
    setPortraitSegmentationState("loading", "기기 호환 모드로 다시 인식 중");
    state.portraitCpuFallbackPromise = createPortraitSegmenter(
      "CPU",
      PERSON_SEGMENTATION_FALLBACK_MODEL,
    )
      .then((created) => installPortraitSegmenter(created, "CPU"))
      .catch((error) => {
        state.portraitCpuFallbackPromise = null;
        throw error;
      });
  }

  return state.portraitCpuFallbackPromise;
}

function createNormalizedPhotoCanvas(source, sourceWidth, sourceHeight) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = PHOTO_WIDTH;
  canvas.height = PHOTO_HEIGHT;
  drawImageCover(context, source, sourceWidth, sourceHeight, PHOTO_WIDTH, PHOTO_HEIGHT);
  return canvas;
}

function cloneCanvas(source) {
  if (!source) {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  canvas.getContext("2d").drawImage(source, 0, 0);
  return canvas;
}

function createEmptyPhotoCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = PHOTO_WIDTH;
  canvas.height = PHOTO_HEIGHT;
  return canvas;
}

function combinePersonConfidenceMasks(masks, labels) {
  const maskWidth = masks[0]?.width || 0;
  const maskHeight = masks[0]?.height || 0;
  const combined = new Float32Array(maskWidth * maskHeight);
  const personMaskIndexes = labels.length === masks.length
    ? labels
        .map((label, index) => (label.toLowerCase().includes("background") ? -1 : index))
        .filter((index) => index !== -1)
    : masks.map((_, index) => index).slice(masks.length > 1 ? 1 : 0);

  if (!personMaskIndexes.length) {
    throw new Error("인물 클래스 마스크를 찾지 못했습니다.");
  }

  personMaskIndexes.forEach((maskIndex) => {
    const values = masks[maskIndex].getAsFloat32Array();
    for (let index = 0; index < combined.length; index += 1) {
      combined[index] += values[index];
    }
  });

  for (let index = 0; index < combined.length; index += 1) {
    combined[index] = clamp(combined[index], 0, 1);
  }

  return { confidence: combined, maskWidth, maskHeight };
}

function refinePersonConfidenceMask(source, width, height) {
  const refined = new Float32Array(source.length);
  const neighbors = [
    [-1, -1, 1], [0, -1, 2], [1, -1, 1],
    [-1, 0, 2], [0, 0, 4], [1, 0, 2],
    [-1, 1, 1], [0, 1, 2], [1, 1, 1],
  ];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let weightedTotal = 0;
      let totalWeight = 0;

      neighbors.forEach(([offsetX, offsetY, weight]) => {
        const sampleX = clamp(x + offsetX, 0, width - 1);
        const sampleY = clamp(y + offsetY, 0, height - 1);
        weightedTotal += source[sampleY * width + sampleX] * weight;
        totalWeight += weight;
      });

      const index = y * width + x;
      const softened = weightedTotal / totalWeight;
      refined[index] = clamp(source[index] * 0.78 + softened * 0.22, 0, 1);
    }
  }

  return refined;
}

function assertUsablePersonMask(confidence) {
  let visiblePixels = 0;
  let peakConfidence = 0;

  for (let index = 0; index < confidence.length; index += 1) {
    const value = confidence[index];
    peakConfidence = Math.max(peakConfidence, value);
    if (value >= PERSON_MASK_SOFT_EDGE_START) {
      visiblePixels += 1;
    }
  }

  const visibleRatio = confidence.length ? visiblePixels / confidence.length : 0;
  if (visibleRatio < PERSON_MASK_MIN_VISIBLE_RATIO) {
    const error = new Error(
      `인물 마스크가 비어 있습니다. peak=${peakConfidence.toFixed(3)}, ratio=${visibleRatio.toFixed(4)}`,
    );
    error.name = "InvalidPortraitMaskError";
    throw error;
  }
}

async function createPortraitCutout(rawPhoto, segmenter) {
  const image = await loadImage(rawPhoto);
  const photoCanvas = createNormalizedPhotoCanvas(image, image.naturalWidth, image.naturalHeight);
  const result = segmenter.segment(photoCanvas);

  try {
    const masks = result.confidenceMasks || [];
    const labels = segmenter.getLabels();
    if (!masks.length) {
      throw new Error("인물 마스크를 생성하지 못했습니다.");
    }

    const combinedMask = combinePersonConfidenceMasks(masks, labels);
    const maskWidth = combinedMask.maskWidth;
    const maskHeight = combinedMask.maskHeight;
    const confidence = refinePersonConfidenceMask(
      combinedMask.confidence,
      maskWidth,
      maskHeight,
    );
    assertUsablePersonMask(confidence);
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = maskWidth;
    maskCanvas.height = maskHeight;
    const maskContext = maskCanvas.getContext("2d");
    const maskImage = maskContext.createImageData(maskWidth, maskHeight);

    for (let index = 0; index < confidence.length; index += 1) {
      const offset = index * 4;
      const alpha = Math.round(
        smoothstep(PERSON_MASK_SOFT_EDGE_START, PERSON_MASK_SOFT_EDGE_END, confidence[index]) * 255,
      );
      maskImage.data[offset] = 255;
      maskImage.data[offset + 1] = 255;
      maskImage.data[offset + 2] = 255;
      maskImage.data[offset + 3] = alpha;
    }

    maskContext.putImageData(maskImage, 0, 0);

    const personCanvas = document.createElement("canvas");
    const personContext = personCanvas.getContext("2d");
    personCanvas.width = PHOTO_WIDTH;
    personCanvas.height = PHOTO_HEIGHT;
    personContext.drawImage(photoCanvas, 0, 0);
    personContext.globalCompositeOperation = "destination-in";
    personContext.imageSmoothingEnabled = true;
    personContext.imageSmoothingQuality = "high";
    personContext.drawImage(maskCanvas, 0, 0, PHOTO_WIDTH, PHOTO_HEIGHT);

    return personCanvas;
  } finally {
    result.close();
  }
}

async function createReliablePortraitCutout(rawPhoto) {
  const segmenter = await ensurePortraitSegmenter();

  try {
    return await createPortraitCutout(rawPhoto, segmenter);
  } catch (error) {
    if (state.portraitSegmenterDelegate !== "GPU") {
      throw error;
    }

    console.warn("GPU 인물 분리에 실패해 CPU 호환 모드로 다시 시도합니다.", error);
    const cpuSegmenter = await ensureCpuPortraitSegmenter();
    return createPortraitCutout(rawPhoto, cpuSegmenter);
  }
}

function composePortraitBackground(personCanvas, background) {
  const outputCanvas = document.createElement("canvas");
  const outputContext = outputCanvas.getContext("2d");
  outputCanvas.width = PHOTO_WIDTH;
  outputCanvas.height = PHOTO_HEIGHT;
  outputContext.fillStyle = background.color;
  outputContext.fillRect(0, 0, PHOTO_WIDTH, PHOTO_HEIGHT);
  outputContext.drawImage(personCanvas, 0, 0);
  return outputCanvas.toDataURL("image/png");
}

async function processAndStorePhoto(slotIndex, rawPhoto) {
  state.rawCapturedPhotos[slotIndex] = rawPhoto;
  state.portraitCutouts[slotIndex] = null;
  state.portraitBaseCutouts[slotIndex] = null;

  if (!state.portraitBackgroundEnabled) {
    state.capturedPhotos[slotIndex] = rawPhoto;
    setPortraitSegmentationState("disabled", "원본 배경 사용 중");
    renderPortraitBackgroundOptions();
    renderPreviewShell();
    return;
  }

  state.isPhotoProcessing = true;
  setPortraitSegmentationState("processing", "인물 분리 중");
  renderPortraitBackgroundOptions();
  updateControlState();

  try {
    setPortraitSegmentationState("processing", "인물 분리 중");
    const personCanvas = await createReliablePortraitCutout(rawPhoto);
    state.portraitCutouts[slotIndex] = personCanvas;
    state.portraitBaseCutouts[slotIndex] = cloneCanvas(personCanvas);
    state.capturedPhotos[slotIndex] = composePortraitBackground(
      personCanvas,
      getSelectedPortraitBackground(),
    );
    setPortraitSegmentationState(
      "ready",
      state.portraitSegmenterDelegate === "CPU"
        ? "호환 모드 누끼 적용 완료"
        : "자동 누끼 준비 완료",
    );
  } catch (error) {
    if (error?.name === "InvalidPortraitMaskError") {
      console.warn(error);
    } else {
      console.error(error);
    }
    state.portraitCutouts[slotIndex] = null;
    state.portraitBaseCutouts[slotIndex] = null;
    state.capturedPhotos[slotIndex] = rawPhoto;
    setPortraitSegmentationState(
      "error",
      error?.name === "InvalidPortraitMaskError"
        ? "인물 인식 실패 · 원본 유지"
        : "누끼 실패 · 원본 유지",
    );
  } finally {
    state.isPhotoProcessing = false;
    renderPortraitBackgroundOptions();
    renderPreviewShell();
  }
}

async function handlePortraitBackgroundChange(backgroundId) {
  if (
    !state.portraitBackgroundEnabled ||
    state.isCountingDown ||
    state.isAutoSession ||
    state.isPhotoProcessing
  ) {
    return;
  }

  state.selectedPortraitBackgroundId = backgroundId;
  renderPortraitBackgroundOptions();

  const occupiedSlots = state.rawCapturedPhotos
    .map((photo, index) => (photo ? index : -1))
    .filter((index) => index !== -1);

  if (!occupiedSlots.length) {
    ensurePortraitSegmenter().catch((error) => console.error(error));
    return;
  }

  state.isPhotoProcessing = true;
  setPortraitSegmentationState("processing", "배경색 다시 적용 중");
  renderPortraitBackgroundOptions();
  updateControlState();

  try {
    const background = getSelectedPortraitBackground();

    for (const slotIndex of occupiedSlots) {
      if (!state.portraitCutouts[slotIndex]) {
        state.portraitCutouts[slotIndex] = await createReliablePortraitCutout(
          state.rawCapturedPhotos[slotIndex],
        );
        state.portraitBaseCutouts[slotIndex] = cloneCanvas(
          state.portraitCutouts[slotIndex],
        );
      }

      state.capturedPhotos[slotIndex] = composePortraitBackground(
        state.portraitCutouts[slotIndex],
        background,
      );
    }

    setPortraitSegmentationState(
      "ready",
      state.portraitSegmenterDelegate === "CPU"
        ? "호환 모드 누끼 적용 완료"
        : "자동 누끼 준비 완료",
    );
  } catch (error) {
    if (error?.name === "InvalidPortraitMaskError") {
      console.warn(error);
    } else {
      console.error(error);
    }
    occupiedSlots.forEach((slotIndex) => {
      state.portraitCutouts[slotIndex] = null;
      state.portraitBaseCutouts[slotIndex] = null;
      state.capturedPhotos[slotIndex] = state.rawCapturedPhotos[slotIndex];
    });
    setPortraitSegmentationState(
      "error",
      error?.name === "InvalidPortraitMaskError"
        ? "인물 인식 실패 · 원본 유지"
        : "누끼 실패 · 원본 유지",
    );
  } finally {
    state.isPhotoProcessing = false;
    renderPortraitBackgroundOptions();
    renderPreviewShell();
  }
}

async function handlePortraitBackgroundToggle() {
  if (state.isCountingDown || state.isAutoSession || state.isPhotoProcessing) {
    refs.portraitBackgroundToggle.checked = state.portraitBackgroundEnabled;
    return;
  }

  state.portraitBackgroundEnabled = refs.portraitBackgroundToggle.checked;

  if (!state.portraitBackgroundEnabled) {
    state.rawCapturedPhotos.forEach((rawPhoto, slotIndex) => {
      if (rawPhoto) {
        state.capturedPhotos[slotIndex] = rawPhoto;
      }
    });
    setPortraitSegmentationState("disabled", "원본 배경 사용 중");
    renderPortraitBackgroundOptions();
    renderPreviewShell();
    return;
  }

  setPortraitSegmentationState("loading", "누끼 배경 적용 중");
  renderPortraitBackgroundOptions();
  renderPreviewShell();
  await handlePortraitBackgroundChange(state.selectedPortraitBackgroundId);
}

function setPortraitEditorMode(mode) {
  state.portraitEditorMode = mode;
  state.portraitEditorStatusMessage =
    mode === "erase"
      ? "지울 배경 영역을 손가락이나 마우스로 칠하세요."
      : "잘려 나간 인물 영역을 손가락이나 마우스로 복원하세요.";
  renderPortraitEditor();
}

function renderPortraitEditor() {
  const workingCutout = state.portraitEditorWorkingCutout;
  if (!workingCutout || refs.portraitEditorOverlay.hidden) {
    return;
  }

  const canvas = refs.portraitEditorCanvas;
  const context = canvas.getContext("2d");
  const background = getSelectedPortraitBackground();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = background.color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(workingCutout, 0, 0, canvas.width, canvas.height);

  if (state.portraitEditorCursor) {
    const radius = state.portraitEditorBrushSize / 2;
    context.save();
    context.beginPath();
    context.arc(
      state.portraitEditorCursor.x,
      state.portraitEditorCursor.y,
      radius,
      0,
      Math.PI * 2,
    );
    context.lineWidth = 5;
    context.strokeStyle = "rgba(45, 19, 52, 0.76)";
    context.stroke();
    context.lineWidth = 2;
    context.strokeStyle = "rgba(255, 247, 252, 0.96)";
    context.stroke();
    context.restore();
  }

  const isEraseMode = state.portraitEditorMode === "erase";
  refs.portraitEraseButton.classList.toggle("active", isEraseMode);
  refs.portraitEraseButton.setAttribute("aria-pressed", String(isEraseMode));
  refs.portraitRestoreButton.classList.toggle("active", !isEraseMode);
  refs.portraitRestoreButton.setAttribute("aria-pressed", String(!isEraseMode));
  refs.portraitBrushSize.value = String(state.portraitEditorBrushSize);
  refs.portraitBrushSizeValue.value = String(state.portraitEditorBrushSize);
  refs.portraitUndoButton.disabled = !state.portraitEditorUndoSnapshot;
  refs.portraitResetMaskButton.textContent = state.portraitBaseCutouts[state.portraitEditorSlotIndex]
    ? "자동 누끼로 초기화"
    : "브러시 결과 지우기";
  refs.portraitEditorStatus.textContent = state.portraitEditorStatusMessage;
}

async function openPortraitEditor() {
  const slotIndex = state.activeSlotIndex;
  const rawPhoto = state.rawCapturedPhotos[slotIndex];
  if (!rawPhoto || !state.portraitBackgroundEnabled) {
    return;
  }

  refs.editPortraitButton.disabled = true;

  try {
    const image = await loadImage(rawPhoto);
    state.portraitEditorSlotIndex = slotIndex;
    state.portraitEditorRawCanvas = createNormalizedPhotoCanvas(
      image,
      image.naturalWidth,
      image.naturalHeight,
    );
    state.portraitEditorWorkingCutout = state.portraitCutouts[slotIndex]
      ? cloneCanvas(state.portraitCutouts[slotIndex])
      : createEmptyPhotoCanvas();
    state.portraitEditorUndoSnapshot = null;
    state.portraitEditorCursor = null;
    state.portraitEditorLastPoint = null;
    state.portraitEditorPointerId = null;
    state.portraitEditorMode = state.portraitCutouts[slotIndex] ? "erase" : "restore";
    state.portraitEditorStatusMessage = state.portraitCutouts[slotIndex]
      ? "캔버스 위를 드래그해 누끼를 수정하세요."
      : "자동 인식 결과가 없어 비어 있습니다. 복원 브러시로 인물 영역을 칠하세요.";

    refs.portraitEditorCutLabel.textContent = `CUT ${String(slotIndex + 1).padStart(2, "0")}`;
    refs.portraitEditorOverlay.hidden = false;
    document.body.classList.add("portrait-editor-open");
    renderPortraitEditor();
    refs.portraitEditorTitle.focus({ preventScroll: true });
  } catch (error) {
    console.error(error);
    alert("누끼 편집기를 열지 못했어요. 다시 시도해 주세요.");
  } finally {
    updateControlState();
  }
}

function closePortraitEditor() {
  refs.portraitEditorOverlay.hidden = true;
  document.body.classList.remove("portrait-editor-open");
  state.portraitEditorSlotIndex = null;
  state.portraitEditorRawCanvas = null;
  state.portraitEditorWorkingCutout = null;
  state.portraitEditorUndoSnapshot = null;
  state.portraitEditorCursor = null;
  state.portraitEditorLastPoint = null;
  state.portraitEditorPointerId = null;
  refs.editPortraitButton.focus({ preventScroll: true });
}

function getPortraitEditorPoint(event) {
  const bounds = refs.portraitEditorCanvas.getBoundingClientRect();
  return {
    x: clamp(
      ((event.clientX - bounds.left) / bounds.width) * refs.portraitEditorCanvas.width,
      0,
      refs.portraitEditorCanvas.width,
    ),
    y: clamp(
      ((event.clientY - bounds.top) / bounds.height) * refs.portraitEditorCanvas.height,
      0,
      refs.portraitEditorCanvas.height,
    ),
  };
}

function applyPortraitBrushDab(point) {
  const workingCutout = state.portraitEditorWorkingCutout;
  const rawCanvas = state.portraitEditorRawCanvas;
  if (!workingCutout || !rawCanvas) {
    return;
  }

  const context = workingCutout.getContext("2d");
  const radius = state.portraitEditorBrushSize / 2;

  if (state.portraitEditorMode === "erase") {
    const gradient = context.createRadialGradient(
      point.x,
      point.y,
      radius * 0.28,
      point.x,
      point.y,
      radius,
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    gradient.addColorStop(0.68, "rgba(0, 0, 0, 0.94)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.save();
    context.globalCompositeOperation = "destination-out";
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
    return;
  }

  const left = Math.max(0, Math.floor(point.x - radius));
  const top = Math.max(0, Math.floor(point.y - radius));
  const right = Math.min(PHOTO_WIDTH, Math.ceil(point.x + radius));
  const bottom = Math.min(PHOTO_HEIGHT, Math.ceil(point.y + radius));
  const width = right - left;
  const height = bottom - top;
  if (!width || !height) {
    return;
  }

  const patch = document.createElement("canvas");
  patch.width = width;
  patch.height = height;
  const patchContext = patch.getContext("2d");
  patchContext.drawImage(rawCanvas, left, top, width, height, 0, 0, width, height);
  const localX = point.x - left;
  const localY = point.y - top;
  const gradient = patchContext.createRadialGradient(
    localX,
    localY,
    radius * 0.28,
    localX,
    localY,
    radius,
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
  gradient.addColorStop(0.68, "rgba(0, 0, 0, 0.94)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  patchContext.globalCompositeOperation = "destination-in";
  patchContext.fillStyle = gradient;
  patchContext.beginPath();
  patchContext.arc(localX, localY, radius, 0, Math.PI * 2);
  patchContext.fill();
  context.save();
  context.globalCompositeOperation = "source-over";
  context.drawImage(patch, left, top);
  context.restore();
}

function applyPortraitBrushSegment(from, to) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const spacing = Math.max(3, state.portraitEditorBrushSize * 0.18);
  const steps = Math.max(1, Math.ceil(distance / spacing));

  for (let step = 1; step <= steps; step += 1) {
    const amount = step / steps;
    applyPortraitBrushDab({
      x: from.x + (to.x - from.x) * amount,
      y: from.y + (to.y - from.y) * amount,
    });
  }
}

function handlePortraitEditorPointerDown(event) {
  if (event.pointerType === "mouse" && event.button !== 0) {
    return;
  }

  event.preventDefault();
  state.portraitEditorUndoSnapshot = cloneCanvas(state.portraitEditorWorkingCutout);
  state.portraitEditorPointerId = event.pointerId;
  state.portraitEditorLastPoint = getPortraitEditorPoint(event);
  state.portraitEditorCursor = state.portraitEditorLastPoint;
  refs.portraitEditorCanvas.setPointerCapture?.(event.pointerId);
  applyPortraitBrushDab(state.portraitEditorLastPoint);
  state.portraitEditorStatusMessage =
    state.portraitEditorMode === "erase" ? "배경 영역을 지우는 중" : "인물 영역을 복원하는 중";
  renderPortraitEditor();
}

function handlePortraitEditorPointerMove(event) {
  const point = getPortraitEditorPoint(event);
  state.portraitEditorCursor = point;

  if (event.pointerId === state.portraitEditorPointerId && state.portraitEditorLastPoint) {
    event.preventDefault();
    applyPortraitBrushSegment(state.portraitEditorLastPoint, point);
    state.portraitEditorLastPoint = point;
  }

  renderPortraitEditor();
}

function handlePortraitEditorPointerEnd(event) {
  if (event.pointerId !== state.portraitEditorPointerId) {
    return;
  }

  refs.portraitEditorCanvas.releasePointerCapture?.(event.pointerId);
  state.portraitEditorPointerId = null;
  state.portraitEditorLastPoint = null;
  state.portraitEditorStatusMessage = "브러시 수정이 반영됐습니다. 결과를 확인한 뒤 적용하세요.";
  renderPortraitEditor();
}

function undoPortraitEditorStroke() {
  if (!state.portraitEditorUndoSnapshot) {
    return;
  }

  state.portraitEditorWorkingCutout = cloneCanvas(state.portraitEditorUndoSnapshot);
  state.portraitEditorUndoSnapshot = null;
  state.portraitEditorStatusMessage = "마지막 브러시 작업을 취소했습니다.";
  renderPortraitEditor();
}

function resetPortraitEditorMask() {
  const baseCutout = state.portraitBaseCutouts[state.portraitEditorSlotIndex];
  state.portraitEditorUndoSnapshot = cloneCanvas(state.portraitEditorWorkingCutout);
  state.portraitEditorWorkingCutout = baseCutout
    ? cloneCanvas(baseCutout)
    : createEmptyPhotoCanvas();
  state.portraitEditorStatusMessage = baseCutout
    ? "자동 누끼 결과로 초기화했습니다."
    : "복원한 영역을 모두 지웠습니다.";
  renderPortraitEditor();
}

function getPortraitCutoutVisibleRatio(canvas) {
  const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
  let visiblePixels = 0;
  let sampledPixels = 0;

  for (let offset = 3; offset < pixels.length; offset += 16) {
    sampledPixels += 1;
    if (pixels[offset] > 8) {
      visiblePixels += 1;
    }
  }

  return sampledPixels ? visiblePixels / sampledPixels : 0;
}

function applyPortraitEditorChanges() {
  const slotIndex = state.portraitEditorSlotIndex;
  const workingCutout = state.portraitEditorWorkingCutout;
  if (slotIndex === null || !workingCutout) {
    return;
  }

  if (getPortraitCutoutVisibleRatio(workingCutout) < PERSON_MASK_MIN_VISIBLE_RATIO) {
    state.portraitEditorStatusMessage = "인물 영역이 비어 있습니다. 복원 브러시로 사람을 칠해 주세요.";
    renderPortraitEditor();
    return;
  }

  state.portraitCutouts[slotIndex] = cloneCanvas(workingCutout);
  state.capturedPhotos[slotIndex] = composePortraitBackground(
    state.portraitCutouts[slotIndex],
    getSelectedPortraitBackground(),
  );
  setPortraitSegmentationState("ready", "브러시 누끼 수정 적용 완료");
  closePortraitEditor();
  renderPreviewShell();
}

function getSelectedTheme() {
  return themes.find((theme) => theme.id === state.selectedThemeId) || themes[0];
}

function getAllStickerAssets() {
  return state.presetStickers;
}

function getFilledCount() {
  return state.capturedPhotos.filter(Boolean).length;
}

function getPreviewMount(step) {
  const mounts = {
    3: refs.previewMountSticker,
    4: refs.previewMountFinal,
    5: refs.previewMountSave,
  };

  return mounts[step] || null;
}

function updateWorkflowControls() {
  const isComplete = getFilledCount() === CUT_COUNT;
  const isBusy = state.isCountingDown || state.isAutoSession || state.isPhotoProcessing;

  refs.captureNextButton.disabled = !isComplete || isBusy;
  refs.stickerNextButton.disabled = !isComplete;
  refs.previewNextButton.disabled = !isComplete;
}

function renderWorkflow() {
  refs.workflowStages.forEach((stage) => {
    const step = Number(stage.dataset.workflowStep);
    const isActive = step === state.currentWorkflowStep;
    stage.hidden = !isActive;
    stage.classList.toggle("active", isActive);
  });

  refs.workflowProgressItems.forEach((item) => {
    const step = Number(item.dataset.workflowTarget);
    const isActive = step === state.currentWorkflowStep;
    item.disabled = step > state.maxUnlockedWorkflowStep;
    item.classList.toggle("active", isActive);
    item.classList.toggle("complete", step < state.currentWorkflowStep);
    item.toggleAttribute("aria-current", isActive);
    if (isActive) {
      item.setAttribute("aria-current", "step");
    }
  });

  const previewMount = getPreviewMount(state.currentWorkflowStep);
  if (previewMount && refs.sharedPreviewModule.parentElement !== previewMount) {
    previewMount.appendChild(refs.sharedPreviewModule);
  }

  document.body.dataset.workflowStep = String(state.currentWorkflowStep);
  updateWorkflowControls();
}

function goToWorkflowStep(step, options = {}) {
  const targetStep = clamp(Number(step), 1, 5);
  const isSequentialAdvance = targetStep === state.currentWorkflowStep + 1;
  const isUnlocked = targetStep <= state.maxUnlockedWorkflowStep;

  if (!options.force && !isUnlocked && !isSequentialAdvance) {
    return;
  }

  if (targetStep >= 3 && getFilledCount() !== CUT_COUNT) {
    alert("네 컷을 모두 채운 뒤 다음 단계로 이동해 주세요.");
    return;
  }

  if (state.currentWorkflowStep === 2 && targetStep !== 2) {
    stopCamera();
  }

  state.currentWorkflowStep = targetStep;
  state.maxUnlockedWorkflowStep = Math.max(state.maxUnlockedWorkflowStep, targetStep);
  state.selectedStickerId = null;
  renderPreviewShell();
  renderWorkflow();

  if (targetStep === 2) {
    ensurePortraitSegmenter().catch((error) => console.error(error));
  }

  const activeHeading = document.querySelector(`[data-workflow-step="${targetStep}"] h2`);
  activeHeading?.focus({ preventScroll: true });
  refs.workflowShell.scrollIntoView({
    behavior: REDUCED_MOTION_QUERY.matches ? "auto" : "smooth",
    block: "start",
  });
}

function getNextEmptySlot(startIndex = 0) {
  for (let index = startIndex; index < CUT_COUNT; index += 1) {
    if (!state.capturedPhotos[index]) {
      return index;
    }
  }

  return state.capturedPhotos.findIndex((photo) => !photo);
}

function createBackdropScene() {
  const stars = Array.from({ length: BACKDROP_STAR_COUNT }, () => ({
    x: randomBetween(0.01, 0.99),
    y: randomBetween(0.01, 0.99),
    size: randomBetween(0.45, 2.5),
    alpha: randomBetween(0.16, 0.92),
    twinkle: randomBetween(0.45, 1.85),
    phase: randomBetween(0, Math.PI * 2),
    sparkle: Math.random() > 0.78,
    color: pickRandom(["#ffffff", "#ffd8ec", "#e4c6ff", "#ff9fd1"]),
  }));

  const streaks = Array.from({ length: BACKDROP_STREAK_COUNT }, (_, index) => ({
    y: randomBetween(0.04, 0.8),
    length: randomBetween(140, 260),
    angle: randomBetween(-0.5, -0.24),
    speed: randomBetween(0.012, 0.026),
    phase: index / BACKDROP_STREAK_COUNT,
    alpha: randomBetween(0.06, 0.16),
    color: pickRandom(["#ffafd9", "#e3bdff", "#c996f1"]),
  }));

  return { stars, streaks };
}

function resizeBackdropCanvas() {
  if (!refs.galaxyBackground) {
    return;
  }

  const ratio = Math.min(window.devicePixelRatio || 1, MAX_BACKDROP_PIXEL_RATIO);
  const width = window.innerWidth;
  const height = window.innerHeight;
  refs.galaxyBackground.width = Math.round(width * ratio);
  refs.galaxyBackground.height = Math.round(height * ratio);
  refs.galaxyBackground.style.width = `${width}px`;
  refs.galaxyBackground.style.height = `${height}px`;

  const context = refs.galaxyBackground.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  if (state.backdropScene && REDUCED_MOTION_QUERY.matches) {
    window.requestAnimationFrame(drawBackdrop);
  }
}

function createAuroraPath(context, band, width, height, time, offset = 0) {
  const points = [];
  const stepCount = 22;
  const verticalPadding = height * 0.12;
  const horizontalDrift = Math.sin(time * band.speed * 0.3 + band.phase) * width * 0.035;

  for (let step = 0; step <= stepCount; step += 1) {
    const ratio = step / stepCount;
    const y = -verticalPadding + ratio * (height + verticalPadding * 2);
    const primaryWave = Math.sin(ratio * Math.PI * 2 * band.frequency + time * band.speed + band.phase);
    const detailWave = Math.sin(ratio * Math.PI * 5.2 - time * band.speed * 0.64 + band.phase * 1.7);
    const x =
      band.baseX * width +
      horizontalDrift +
      primaryWave * band.amplitude * width +
      detailWave * band.amplitude * width * 0.28 +
      offset;

    points.push({ x, y });
  }

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);

  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    context.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
  }

  const last = points[points.length - 1];
  context.lineTo(last.x, last.y);
}

function drawAuroraBand(context, band, width, height, time) {
  const gradient = context.createLinearGradient(0, -height * 0.1, 0, height * 1.1);
  gradient.addColorStop(0, withAlpha(band.colorB, 0));
  gradient.addColorStop(0.12, withAlpha(band.colorB, 0.54));
  gradient.addColorStop(0.44, withAlpha(band.colorA, 0.96));
  gradient.addColorStop(0.74, withAlpha(band.colorB, 0.72));
  gradient.addColorStop(1, withAlpha(band.colorA, 0));

  context.save();
  context.globalCompositeOperation = "screen";
  context.globalAlpha = band.opacity;
  context.strokeStyle = gradient;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.filter = `blur(${Math.max(18, Math.min(42, width * 0.022))}px)`;
  context.lineWidth = Math.max(110, width * band.width);
  createAuroraPath(context, band, width, height, time);
  context.stroke();

  context.globalAlpha = band.opacity * 0.72;
  context.filter = `blur(${Math.max(8, Math.min(20, width * 0.011))}px)`;
  context.lineWidth = Math.max(28, width * band.width * 0.28);
  createAuroraPath(context, band, width, height, time, width * 0.012);
  context.stroke();

  context.filter = "none";
  context.globalAlpha = band.opacity * 0.25;
  context.lineWidth = 1;
  for (let filament = -2; filament <= 2; filament += 1) {
    createAuroraPath(context, band, width, height, time, filament * width * 0.017);
    context.stroke();
  }
  context.restore();
}

function drawBackgroundStreak(context, x, y, length, angle, color, alpha) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.globalAlpha = alpha;
  const gradient = context.createLinearGradient(-length, 0, 0, 0);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.72, color);
  gradient.addColorStop(1, "#ffffff");
  context.strokeStyle = gradient;
  context.lineWidth = 1;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(-length, 0);
  context.lineTo(0, 0);
  context.stroke();
  context.restore();
}

function drawBackdrop(timestamp = 0) {
  if (!refs.galaxyBackground || !state.backdropScene) {
    return;
  }

  const context = refs.galaxyBackground.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight;
  const progress = (timestamp % BACKDROP_LOOP_MS) / BACKDROP_LOOP_MS;
  const time = timestamp / 1000;

  context.clearRect(0, 0, width, height);

  state.backdropScene.streaks.forEach((streak) => {
    const drift = ((progress * streak.speed * 22 + streak.phase) % 1) * (width + streak.length * 1.6) - streak.length;
    drawBackgroundStreak(context, drift, streak.y * height, streak.length, streak.angle, streak.color, streak.alpha);
  });

  state.backdropScene.stars.forEach((star, index) => {
    const twinkle = (Math.sin(progress * Math.PI * 2 * star.twinkle + star.phase) + 1) / 2;
    const alpha = clamp(star.alpha * (0.28 + twinkle * 0.96), 0, 1);
    const x = star.x * width + Math.sin(progress * Math.PI * 2 + index * 0.2) * 1.2;
    const y = star.y * height + Math.cos(progress * Math.PI * 2 + index * 0.1) * 0.8;

    context.save();
    context.translate(x, y);
    context.globalAlpha = alpha;
    context.fillStyle = star.color;
    context.shadowColor = star.color;
    context.shadowBlur = star.sparkle ? star.size * (3 + twinkle * 3) : star.size * 2;
    context.beginPath();
    context.arc(0, 0, Math.max(0.45, star.size * 0.36), 0, Math.PI * 2);
    context.fill();

    if (star.sparkle) {
      const ray = star.size * (1.25 + twinkle * 1.6);
      context.strokeStyle = star.color;
      context.lineWidth = Math.max(0.45, star.size * 0.26);
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(-ray, 0);
      context.lineTo(ray, 0);
      context.moveTo(0, -ray);
      context.lineTo(0, ray);
      context.stroke();
    }
    context.restore();
  });

  if (!REDUCED_MOTION_QUERY.matches) {
    state.backdropAnimationFrame = window.requestAnimationFrame(drawBackdrop);
  }
}

function initializeBackdrop() {
  state.backdropScene = createBackdropScene();
  resizeBackdropCanvas();

  if (state.backdropAnimationFrame) {
    window.cancelAnimationFrame(state.backdropAnimationFrame);
  }

  state.backdropAnimationFrame = window.requestAnimationFrame(drawBackdrop);
  window.addEventListener("resize", resizeBackdropCanvas);
}

function removeBackgroundVideoUnlockListeners() {
  if (!state.backgroundVideoUnlockHandler) {
    return;
  }

  MEDIA_UNLOCK_EVENTS.forEach((eventName) => {
    document.removeEventListener(eventName, state.backgroundVideoUnlockHandler, true);
  });
  state.backgroundVideoUnlockHandler = null;
}

async function attemptBackgroundVideoPlayback() {
  const activeVideo = refs.cosmicBackgroundVideos[state.backgroundActiveVideoIndex];
  if (!activeVideo) {
    return;
  }

  try {
    await activeVideo.play();
    document.body.classList.add("video-background-ready");
    removeBackgroundVideoUnlockListeners();
  } catch (error) {
    // Mobile browsers may defer playback until the first touch.
  }
}

function initializeBackgroundVideo() {
  const videos = refs.cosmicBackgroundVideos;
  if (videos.length < 2) {
    return;
  }

  videos.forEach((video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.disablePictureInPicture = true;
    video.playbackRate = BACKGROUND_VIDEO_RATE;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
  });

  const activeVideo = videos[state.backgroundActiveVideoIndex];
  const revealVideo = () => document.body.classList.add("video-background-ready");

  if (activeVideo.readyState >= 2) {
    revealVideo();
  } else {
    activeVideo.addEventListener("loadeddata", revealVideo, { once: true });
  }

  state.backgroundVideoUnlockHandler = () => attemptBackgroundVideoPlayback();
  MEDIA_UNLOCK_EVENTS.forEach((eventName) => {
    document.addEventListener(eventName, state.backgroundVideoUnlockHandler, true);
  });

  state.backgroundVideoVisibilityHandler = () => {
    if (document.visibilityState === "visible") {
      attemptBackgroundVideoPlayback();
    }
  };
  document.addEventListener("visibilitychange", state.backgroundVideoVisibilityHandler);
  attemptBackgroundVideoPlayback();

  state.backgroundVideoMonitor = window.setInterval(() => {
    const currentVideo = videos[state.backgroundActiveVideoIndex];
    if (
      state.backgroundVideoCrossfading ||
      !Number.isFinite(currentVideo.duration) ||
      currentVideo.duration <= BACKGROUND_VIDEO_CROSSFADE_SOURCE_SECONDS
    ) {
      return;
    }

    const crossfadeStartsAt = currentVideo.duration - BACKGROUND_VIDEO_CROSSFADE_SOURCE_SECONDS;
    if (currentVideo.currentTime < crossfadeStartsAt) {
      return;
    }

    const nextVideoIndex = state.backgroundActiveVideoIndex === 0 ? 1 : 0;
    const nextVideo = videos[nextVideoIndex];
    state.backgroundVideoCrossfading = true;
    nextVideo.loop = false;
    nextVideo.currentTime = 0;
    nextVideo.playbackRate = BACKGROUND_VIDEO_RATE;

    nextVideo
      .play()
      .then(() => {
        nextVideo.classList.add("is-visible");
        currentVideo.classList.remove("is-visible");

        state.backgroundVideoTransitionTimer = window.setTimeout(() => {
          currentVideo.pause();
          currentVideo.currentTime = 0;
          state.backgroundActiveVideoIndex = nextVideoIndex;
          state.backgroundVideoCrossfading = false;
        }, BACKGROUND_VIDEO_CROSSFADE_MS + 120);
      })
      .catch(() => {
        state.backgroundVideoCrossfading = false;
        currentVideo.loop = true;
      });
  }, 160);
}

function removeMusicUnlockListeners() {
  if (!state.backgroundMusicUnlockHandler) {
    return;
  }

  MEDIA_UNLOCK_EVENTS.forEach((eventName) => {
    document.removeEventListener(eventName, state.backgroundMusicUnlockHandler, true);
  });
  state.backgroundMusicUnlockHandler = null;
}

function updateMusicToggle() {
  const isPlaying = !refs.backgroundMusic.paused;
  const isWaiting = state.backgroundMusicDesired && !isPlaying;

  refs.musicToggleButton.classList.toggle("is-playing", isPlaying);
  refs.musicToggleButton.classList.toggle("is-waiting", isWaiting);
  refs.musicToggleButton.setAttribute("aria-pressed", String(isPlaying));
  refs.musicToggleButton.setAttribute(
    "aria-label",
    isPlaying ? "배경음악 끄기" : "배경음악 켜기",
  );
  refs.musicToggleButton.title = isPlaying
    ? "배경음악 끄기"
    : isWaiting
      ? "화면을 터치하면 배경음악이 재생됩니다"
      : "배경음악 켜기";
}

async function attemptBackgroundMusicPlayback() {
  if (!state.backgroundMusicDesired) {
    return;
  }

  refs.backgroundMusic.muted = false;

  try {
    await refs.backgroundMusic.play();
    removeMusicUnlockListeners();
  } catch (error) {
    // Most mobile browsers allow sound only after the first user interaction.
  }

  updateMusicToggle();
}

function initializeBackgroundMusic() {
  refs.backgroundMusic.volume = BACKGROUND_MUSIC_VOLUME;
  refs.backgroundMusic.loop = true;

  state.backgroundMusicUnlockHandler = (event) => {
    if (refs.musicToggleButton.contains(event.target)) {
      return;
    }

    attemptBackgroundMusicPlayback();
  };

  MEDIA_UNLOCK_EVENTS.forEach((eventName) => {
    document.addEventListener(eventName, state.backgroundMusicUnlockHandler, true);
  });

  refs.backgroundMusic.addEventListener("play", updateMusicToggle);
  refs.backgroundMusic.addEventListener("pause", updateMusicToggle);
  attemptBackgroundMusicPlayback();
}

function toggleBackgroundMusic() {
  if (!refs.backgroundMusic.paused) {
    state.backgroundMusicDesired = false;
    refs.backgroundMusic.pause();
    removeMusicUnlockListeners();
    updateMusicToggle();
    return;
  }

  state.backgroundMusicDesired = true;
  attemptBackgroundMusicPlayback();
}

function createFrameLayout(theme = getSelectedTheme()) {
  const ornamentSets = {
    aurora: {
      crosses: [
        { x: 0.9, y: 0.32, size: 36, opacity: 0.42, layer: 1 },
        { x: 0.1, y: 0.7, size: 28, opacity: 0.34, layer: 1 },
      ],
      filaments: [
        { x: 0.04, y: 0.18, width: 190, angle: 74, opacity: 0.62, layer: 1 },
        { x: 0.93, y: 0.3, width: 176, angle: 104, opacity: 0.5, layer: 1 },
        { x: 0.03, y: 0.62, width: 168, angle: 82, opacity: 0.48, layer: 1 },
        { x: 0.9, y: 0.78, width: 182, angle: 98, opacity: 0.54, layer: 1 },
      ],
    },
    starlight: {
      crosses: [
        { x: 0.1, y: 0.19, size: 52, opacity: 0.68, layer: 1 },
        { x: 0.9, y: 0.44, size: 42, opacity: 0.56, layer: 1 },
        { x: 0.08, y: 0.76, size: 36, opacity: 0.46, layer: 1 },
      ],
      filaments: [
        { x: 0.05, y: 0.94, width: 390, angle: 0, opacity: 0.68, layer: 1 },
        { x: 0.16, y: 0.965, width: 290, angle: 0, opacity: 0.38, layer: 1 },
      ],
    },
    nebula: {
      crosses: [
        { x: 0.91, y: 0.62, size: 46, opacity: 0.54, layer: 1 },
        { x: 0.09, y: 0.87, size: 32, opacity: 0.4, layer: 1 },
      ],
      filaments: [
        { x: 0.02, y: 0.24, width: 210, angle: 28, opacity: 0.5, layer: 1 },
        { x: 0.58, y: 0.43, width: 210, angle: -38, opacity: 0.42, layer: 1 },
        { x: 0.03, y: 0.78, width: 220, angle: -18, opacity: 0.48, layer: 1 },
      ],
    },
    astral: {
      crosses: [
        { x: 0.1, y: 0.23, size: 54, opacity: 0.62, layer: 1 },
        { x: 0.91, y: 0.5, size: 44, opacity: 0.52, layer: 1 },
      ],
      filaments: [
        { x: 0.02, y: 0.3, width: 220, angle: 19, opacity: 0.56, layer: 1 },
        { x: 0.56, y: 0.7, width: 220, angle: -24, opacity: 0.5, layer: 1 },
      ],
    },
  };

  const ornaments = ornamentSets[theme.id];

  return {
    stars: [
      [0.08, 0.07, 20], [0.2, 0.1, 5], [0.47, 0.055, 3], [0.79, 0.08, 8], [0.92, 0.12, 16],
      [0.06, 0.22, 5], [0.94, 0.28, 8], [0.07, 0.38, 12], [0.93, 0.46, 5], [0.06, 0.55, 7],
      [0.94, 0.62, 18], [0.07, 0.72, 4], [0.92, 0.8, 9], [0.08, 0.88, 14], [0.19, 0.94, 5],
      [0.38, 0.965, 3], [0.61, 0.94, 6], [0.79, 0.965, 4], [0.91, 0.92, 18], [0.51, 0.03, 4],
    ].map(([x, y, size], index) => ({
      x: clamp(x + randomBetween(-0.018, 0.018), 0.04, 0.96),
      y: clamp(y + randomBetween(-0.018, 0.018), 0.04, 0.96),
      size,
      opacity: randomBetween(0.5, 0.98),
      color: index % 2 === 0 ? theme.palette.accentSoft : "#ffffff",
      glow: withAlpha(theme.palette.accent, 0.66),
      layer: 4,
    })),
    crosses: ornaments.crosses,
    filaments: ornaments.filaments,
  };
}

function ensureFrameLayout() {
  if (!state.frameLayout) {
    state.frameLayout = createFrameLayout(getSelectedTheme());
  }

  return state.frameLayout;
}

function createFrameElement(className, item) {
  const element = document.createElement("span");
  element.className = className;
  element.style.left = `${item.x * 100}%`;
  element.style.top = `${item.y * 100}%`;
  element.style.zIndex = String(item.layer || 1);
  return element;
}

function renderFrameDecorations() {
  const theme = getSelectedTheme();
  const layout = ensureFrameLayout();
  refs.stripCosmos.innerHTML = "";

  layout.filaments.forEach((filament) => {
    const element = createFrameElement("frame-filament", filament);
    element.style.width = `${filament.width}px`;
    element.style.setProperty("--angle", `${filament.angle}deg`);
    element.style.setProperty("--opacity", filament.opacity);
    element.style.setProperty("--filament-color", withAlpha(theme.palette.accent, 0.48));
    refs.stripCosmos.appendChild(element);
  });

  layout.crosses.forEach((cross) => {
    const element = createFrameElement("frame-cross", cross);
    element.style.setProperty("--cross-size", `${cross.size}px`);
    element.style.setProperty("--cross-color", withAlpha(theme.palette.border, cross.opacity));
    refs.stripCosmos.appendChild(element);
  });

  layout.stars.forEach((star, index) => {
    const element = createFrameElement("frame-star", star);
    element.style.width = `${star.size}px`;
    element.style.height = `${star.size}px`;
    element.style.setProperty("--star-color", star.color);
    element.style.setProperty("--star-glow", star.glow);
    element.style.setProperty("--opacity", star.opacity);
    element.style.setProperty("--twinkle-delay", `${-(index % 7) * 0.43}s`);
    refs.stripCosmos.appendChild(element);
  });

  refs.frameStatus.textContent = theme.tagLine;
}

function createThemePreview(theme, element) {
  const [left, right] = theme.preview;
  element.dataset.theme = theme.id;
  element.style.setProperty("--preview-a", left);
  element.style.setProperty("--preview-b", right);
}

function renderThemeOptions() {
  refs.themeOptions.innerHTML = "";

  themes.forEach((theme) => {
    const button = refs.themeButtonTemplate.content.firstElementChild.cloneNode(true);
    button.dataset.themeId = theme.id;
    button.querySelector("strong").textContent = theme.name;
    button.querySelector("span").textContent = theme.description;
    button.classList.toggle("active", theme.id === state.selectedThemeId);
    createThemePreview(theme, button.querySelector(".theme-card-preview"));
    button.addEventListener("click", () => {
      state.selectedThemeId = theme.id;
      state.frameLayout = createFrameLayout(theme);
      renderThemeOptions();
      renderPreviewShell();
    });
    refs.themeOptions.appendChild(button);
  });
}

function renderStickerOptions() {
  refs.stickerOptions.innerHTML = "";

  getAllStickerAssets().forEach((asset) => {
    const button = refs.stickerButtonTemplate.content.firstElementChild.cloneNode(true);
    const thumb = button.querySelector(".sticker-thumb");
    const image = document.createElement("img");
    image.src = asset.dataUrl;
    image.alt = asset.label;
    thumb.appendChild(image);
    button.querySelector("strong").textContent = asset.label;
    button.addEventListener("click", () => addStickerToCanvas(asset));
    refs.stickerOptions.appendChild(button);
  });
}

function renderSessionStrip() {
  refs.sessionStrip.innerHTML = "";

  state.capturedPhotos.forEach((photo, index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "session-dot";
    item.classList.toggle("filled", Boolean(photo));
    item.classList.toggle("active", index === state.activeSlotIndex);
    const preview = document.createElement("span");
    preview.className = "session-thumb";
    if (photo) {
      const image = document.createElement("img");
      image.src = photo;
      image.alt = `${index + 1}번째 촬영 결과`;
      preview.appendChild(image);
    } else {
      preview.textContent = String(index + 1).padStart(2, "0");
    }

    const meta = document.createElement("span");
    meta.className = "session-dot-meta";
    meta.innerHTML = `<strong>CUT ${String(index + 1).padStart(2, "0")}</strong><small>${photo ? "DONE" : "READY"}</small>`;
    item.append(preview, meta);
    item.addEventListener("click", () => {
      state.activeSlotIndex = index;
      state.selectedStickerId = null;
      renderPreviewShell();
    });
    refs.sessionStrip.appendChild(item);
  });
}

function renderStripSlots() {
  refs.stripSlots.innerHTML = "";

  state.capturedPhotos.forEach((photo, index) => {
    const slot = document.createElement("button");
    slot.type = "button";
    slot.className = "strip-slot";
    slot.classList.toggle("selected", index === state.activeSlotIndex);
    slot.addEventListener("click", () => {
      state.activeSlotIndex = index;
      state.selectedStickerId = null;
      renderPreviewShell();
    });

    if (photo) {
      const image = document.createElement("img");
      image.src = photo;
      image.alt = `${index + 1}번째 컷`;
      slot.appendChild(image);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "strip-slot-placeholder";
      placeholder.innerHTML = `<div><strong>FRAME ${String(index + 1).padStart(2, "0")}</strong><br />여기에 다음 컷이 들어와요.</div>`;
      slot.appendChild(placeholder);
    }

    refs.stripSlots.appendChild(slot);
  });
}

function applyStickerTransform(element, sticker) {
  element.style.left = `${sticker.x * 100}%`;
  element.style.top = `${sticker.y * 100}%`;
  element.style.width = `${STICKER_BASE_WIDTH_RATIO * sticker.scale * 100}%`;
  element.style.transform = `translate(-50%, -50%) rotate(${sticker.rotation}deg)`;

  const image = element.querySelector(".sticker-image");
  if (image) {
    image.style.transform = `scaleX(${sticker.mirrored ? -1 : 1})`;
  }
}

function createStickerHandle(className, label, glyph) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `sticker-handle ${className}`;
  button.setAttribute("aria-label", label);
  button.title = label;
  button.textContent = glyph;
  button.addEventListener("pointerdown", (event) => event.stopPropagation());
  button.addEventListener("click", (event) => event.stopPropagation());
  return button;
}

function selectStickerInLayer(stickerId) {
  state.selectedStickerId = stickerId;
  refs.stickerLayer.querySelectorAll(".sticker-item").forEach((element) => {
    element.classList.toggle("selected", element.dataset.stickerId === stickerId);
  });
}

function renderStickerLayer() {
  refs.stickerLayer.innerHTML = "";

  state.stickers.forEach((sticker) => {
    const item = document.createElement("div");
    item.className = "sticker-item";
    item.dataset.stickerId = sticker.id;
    item.classList.toggle("selected", sticker.id === state.selectedStickerId);

    const image = document.createElement("img");
    image.className = "sticker-image";
    image.src = sticker.dataUrl;
    image.alt = sticker.label;

    const controls = document.createElement("div");
    controls.className = "sticker-transform-controls";

    const deleteHandle = createStickerHandle("sticker-delete-handle", "스티커 삭제", "×");
    deleteHandle.addEventListener("click", () => deleteStickerById(sticker.id));

    const flipHandle = createStickerHandle("sticker-flip-handle", "스티커 좌우 반전", "↔");
    flipHandle.addEventListener("click", () => toggleStickerMirror(sticker.id));

    const rotateHandle = createStickerHandle("sticker-rotate-handle", "드래그해서 회전", "↻");
    rotateHandle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      startStickerRotate(event, sticker.id, item);
    });

    const scaleHandle = createStickerHandle("sticker-scale-handle", "드래그해서 크기 조절", "↘");
    scaleHandle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      startStickerScale(event, sticker.id, item);
    });

    controls.append(deleteHandle, flipHandle, rotateHandle, scaleHandle);
    item.append(image, controls);
    applyStickerTransform(item, sticker);

    item.addEventListener("click", (event) => {
      event.stopPropagation();
      selectStickerInLayer(sticker.id);
    });

    item.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }
      event.preventDefault();
      startStickerDrag(event, sticker.id, item);
    });

    refs.stickerLayer.appendChild(item);
  });
}

function renderSavedGallery() {
  if (!state.savedStrips.length) {
    refs.savedGallery.innerHTML = `
      <div class="empty-gallery">
        <div>
          <p>아직 저장된 포토 스트립이 없어요.</p>
          <small>4컷을 완성하고 저장하면 여기에 쌓여요.</small>
        </div>
      </div>
    `;
    return;
  }

  refs.savedGallery.innerHTML = "";

  state.savedStrips.forEach((item) => {
    const card = document.createElement("article");
    card.className = "saved-item";

    const image = document.createElement("img");
    image.src = item.dataUrl;
    image.alt = `${item.themeName} 포토 스트립`;

    const title = document.createElement("strong");
    title.textContent = item.themeName;

    const meta = document.createElement("span");
    meta.textContent = item.savedAt;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "mini-button gallery-download";
    button.textContent = "다시 저장";
    button.addEventListener("click", () => {
      downloadDataUrl(item.dataUrl, item.fileName || `spectra-${Date.now()}.png`);
    });

    card.append(image, title, meta, button);
    refs.savedGallery.appendChild(card);
  });
}

function getSessionMessage(filledCount) {
  if (state.isAutoSession) {
    return `${state.activeSlotIndex + 1}번째 컷을 자동 촬영 중이에요. 포즈를 바꿔 주세요.`;
  }

  if (!state.stream) {
    return "카메라를 시작하면 바로 4컷 촬영을 진행할 수 있어요.";
  }

  if (filledCount === CUT_COUNT) {
    return "4컷이 모두 채워졌어요. 저장하거나 원하는 컷만 다시 찍을 수 있어요.";
  }

  return `${state.activeSlotIndex + 1}번째 프레임이 선택되어 있어요. 촬영 후 다음 칸으로 넘어갑니다.`;
}

function updateControlState() {
  const hasStream = Boolean(state.stream);
  const filledCount = getFilledCount();
  const activePhoto = state.capturedPhotos[state.activeSlotIndex];
  const isBusy = state.isCountingDown || state.isAutoSession || state.isPhotoProcessing;
  const isComplete = filledCount === CUT_COUNT;

  refs.cameraStage.classList.toggle("is-ready", hasStream);
  refs.cameraStatus.textContent = state.isPhotoProcessing
    ? "인물 분리 중"
    : hasStream
      ? "카메라 연결됨"
      : "카메라 대기 중";
  refs.boothModeLabel.textContent = state.isAutoSession ? "AUTO SEQUENCE" : "MANUAL";
  refs.currentSlotLabel.textContent = `CUT ${String(state.activeSlotIndex + 1).padStart(2, "0")}`;
  refs.sessionMessage.textContent = getSessionMessage(filledCount);
  refs.captureButton.disabled = !hasStream || isBusy || isComplete;
  refs.autoCaptureButton.disabled = !hasStream || isBusy || isComplete;
  refs.retakeButton.disabled = !activePhoto || isBusy;
  refs.editPortraitButton.disabled =
    !activePhoto ||
    !state.rawCapturedPhotos[state.activeSlotIndex] ||
    !state.portraitBackgroundEnabled ||
    isBusy;
  refs.saveButton.disabled = filledCount !== CUT_COUNT || isBusy;
  refs.startCameraButton.disabled = isBusy;
  refs.uploadPhotoButton.disabled = isBusy;
  refs.photoUploadInput.disabled = isBusy;
  refs.portraitBackgroundToggle.disabled = isBusy;
  refs.portraitBackgroundToggle.checked = state.portraitBackgroundEnabled;
  refs.portraitBackgroundToggleLabel.textContent = state.portraitBackgroundEnabled ? "켜짐" : "꺼짐";
  refs.portraitBackgroundOptions.classList.toggle("is-disabled", !state.portraitBackgroundEnabled);
  refs.portraitBackgroundOptions.querySelectorAll("input").forEach((input) => {
    input.disabled = isBusy || !state.portraitBackgroundEnabled;
  });
  updateWorkflowControls();
}

function renderPreviewShell() {
  const theme = getSelectedTheme();
  const filledCount = getFilledCount();

  ensureFrameLayout();
  refs.stripPreview.className = `strip-preview ${theme.className}`;
  refs.stripPreview.style.setProperty("--frame-border", withAlpha(theme.palette.border, 0.62));
  refs.stripPreview.style.setProperty("--frame-glow", withAlpha(theme.palette.accent, 0.22));
  refs.stripThemeName.textContent = theme.name;
  refs.themeSummary.textContent = theme.name;
  refs.footerTimestamp.textContent = filledCount ? formatTimestamp() : "READY TO SHOOT";
  refs.slotStatus.textContent = `${filledCount} / ${CUT_COUNT} 컷 완료`;

  renderFrameDecorations();
  renderSessionStrip();
  renderStripSlots();
  renderStickerLayer();
  updateControlState();
}

function renderAll() {
  renderThemeOptions();
  renderPortraitBackgroundOptions();
  renderStickerOptions();
  renderPreviewShell();
  renderSavedGallery();
  renderWorkflow();
}

function setCameraMessage(message, help, isError = false) {
  refs.cameraMessage.textContent = message;
  refs.cameraHelp.textContent = help;
  refs.cameraEmpty.classList.toggle("is-error", isError);
}

function getCameraEnvironment() {
  const userAgent = navigator.userAgent;
  const isAndroid = /Android/i.test(userAgent);
  const isMac = /Macintosh|Mac OS X/i.test(userAgent) && !/iPhone|iPad|iPod/i.test(userAgent);
  const isSafari = /Safari/i.test(userAgent) && !/Chrome|CriOS|Chromium|Edg|OPR/i.test(userAgent);
  const isInAppBrowser = /KAKAOTALK|Instagram|FBAN|FBAV|Line\/|NAVER|DaumApps|; wv\)/i.test(userAgent);

  return { isAndroid, isMac, isSafari, isInAppBrowser };
}

function getCameraPermissionHelp() {
  const environment = getCameraEnvironment();

  if (environment.isInAppBrowser) {
    return "현재 앱 내부 브라우저에서는 카메라가 차단될 수 있어요. 우측 상단 메뉴에서 'Chrome으로 열기' 또는 'Safari로 열기'를 선택해 주세요.";
  }

  if (environment.isAndroid) {
    return "Chrome 주소창의 사이트 정보 → 권한 → 카메라를 허용해 주세요. 계속 막히면 Android 설정 → 앱 → Chrome → 권한 → 카메라도 허용해야 합니다.";
  }

  if (environment.isMac && environment.isSafari) {
    return "Safari → 설정 → 웹사이트 → 카메라에서 이 사이트를 허용하고, macOS 시스템 설정 → 개인정보 보호 및 보안 → 카메라에서도 Safari를 켜 주세요.";
  }

  if (environment.isMac) {
    return "주소창의 사이트 설정에서 카메라를 허용하고, macOS 시스템 설정 → 개인정보 보호 및 보안 → 카메라에서도 현재 브라우저를 켠 뒤 브라우저를 다시 열어 주세요.";
  }

  return "브라우저의 사이트 설정과 기기 설정에서 카메라 권한을 모두 허용한 뒤 다시 시작해 주세요.";
}

function getCameraErrorMessage(error) {
  const errorName = error?.name || "UnknownError";

  if (!window.isSecureContext) {
    return {
      status: "HTTPS 연결이 필요해요",
      message: "현재 주소에서는 카메라를 열 수 없어요.",
      help: "GitHub 저장소 화면이 아니라 https://로 시작하는 GitHub Pages 배포 주소에서 접속해 주세요.",
    };
  }

  if (errorName === "CameraPermissionTimeoutError") {
    return {
      status: "카메라 권한을 확인해 주세요",
      message: "카메라 권한창이 나타나지 않았어요.",
      help: `${getCameraPermissionHelp()} 이미 차단한 적이 있다면 이 사이트의 권한을 초기화한 뒤 다시 눌러 주세요.`,
    };
  }

  if (["NotAllowedError", "PermissionDeniedError", "SecurityError"].includes(errorName)) {
    return {
      status: "카메라 권한이 차단됐어요",
      message: "이 사이트의 카메라 권한을 허용해 주세요.",
      help: getCameraPermissionHelp(),
    };
  }

  if (["NotReadableError", "TrackStartError"].includes(errorName)) {
    return {
      status: "카메라를 사용 중이에요",
      message: "다른 앱이나 브라우저 탭이 카메라를 사용하고 있어요.",
      help: "화상회의 앱과 다른 카메라 탭을 닫은 뒤 다시 시도해 주세요.",
    };
  }

  if (["NotFoundError", "DevicesNotFoundError"].includes(errorName)) {
    return {
      status: "카메라를 찾지 못했어요",
      message: "사용 가능한 카메라가 연결되어 있지 않아요.",
      help: "기기의 카메라 연결을 확인하거나 '사진 불러오기'를 이용해 주세요.",
    };
  }

  return {
    status: "카메라 연결에 실패했어요",
    message: "카메라를 시작하지 못했어요.",
    help: "브라우저를 새로고침한 뒤 다시 시도하거나 '사진 불러오기'를 이용해 주세요.",
  };
}

function getUserMediaWithTimeout(constraints) {
  return new Promise((resolve, reject) => {
    let timedOut = false;
    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      const timeoutError = new Error("Camera permission request timed out.");
      timeoutError.name = "CameraPermissionTimeoutError";
      reject(timeoutError);
    }, CAMERA_PERMISSION_TIMEOUT_MS);

    navigator.mediaDevices.getUserMedia(constraints).then(
      (stream) => {
        window.clearTimeout(timeoutId);
        if (timedOut) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        resolve(stream);
      },
      (error) => {
        window.clearTimeout(timeoutId);
        if (!timedOut) {
          reject(error);
        }
      },
    );
  });
}

async function requestCameraStream() {
  try {
    return await getUserMediaWithTimeout({
      video: {
        facingMode: { ideal: "user" },
        width: { ideal: 1280 },
        height: { ideal: 960 },
      },
      audio: false,
    });
  } catch (error) {
    if (!["OverconstrainedError", "ConstraintNotSatisfiedError"].includes(error?.name)) {
      throw error;
    }

    return getUserMediaWithTimeout({
      video: true,
      audio: false,
    });
  }
}

async function startCamera() {
  if (state.stream) {
    return;
  }

  setCameraMessage(
    "카메라 연결을 준비하고 있어요.",
    "권한 요청이 나타나면 카메라 사용을 허용해 주세요. 창이 뜨지 않으면 잠시 후 해결 방법을 안내합니다.",
  );
  refs.cameraStatus.textContent = "카메라 연결 중";

  if (!window.isSecureContext) {
    const cameraError = getCameraErrorMessage({ name: "SecurityError" });
    refs.cameraStatus.textContent = cameraError.status;
    setCameraMessage(cameraError.message, cameraError.help, true);
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    refs.cameraStatus.textContent = "카메라 미지원 브라우저";
    setCameraMessage(
      "이 브라우저에서는 카메라 기능을 사용할 수 없어요.",
      getCameraEnvironment().isInAppBrowser
        ? getCameraPermissionHelp()
        : "최신 Safari, Chrome 또는 Edge에서 다시 접속하거나 '사진 불러오기'를 이용해 주세요.",
      true,
    );
    return;
  }

  try {
    const stream = await requestCameraStream();

    state.stream = stream;
    refs.camera.srcObject = stream;
    await refs.camera.play().catch((error) => console.warn("Camera preview autoplay was delayed.", error));
    refs.cameraEmpty.classList.remove("is-error");
    updateControlState();
  } catch (error) {
    console.error(error);
    const cameraError = getCameraErrorMessage(error);
    refs.cameraStatus.textContent = cameraError.status;
    setCameraMessage(cameraError.message, cameraError.help, true);
  }
}

function stopCamera() {
  if (!state.stream) {
    return;
  }

  state.stream.getTracks().forEach((track) => track.stop());
  state.stream = null;
  refs.camera.srcObject = null;
  setCameraMessage(
    "카메라를 시작하거나 기기에 저장된 사진을 불러와 주세요.",
    "권한창이 뜨지 않으면 이 사이트의 카메라 권한을 초기화한 뒤 다시 시도해 주세요.",
  );
  updateControlState();
}

async function runCountdown() {
  state.isCountingDown = true;
  updateControlState();

  for (let number = COUNTDOWN_SECONDS; number > 0; number -= 1) {
    refs.countdown.textContent = String(number);
    refs.countdown.classList.add("visible");
    await wait(1000);
  }

  refs.countdown.classList.remove("visible");
  state.isCountingDown = false;
  updateControlState();
}

function drawImageCover(context, source, sourceWidth, sourceHeight, targetWidth, targetHeight, mirror = false) {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;
  let cropX = 0;
  let cropY = 0;
  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;

  if (sourceRatio > targetRatio) {
    cropWidth = sourceHeight * targetRatio;
    cropX = (sourceWidth - cropWidth) / 2;
  } else {
    cropHeight = sourceWidth / targetRatio;
    cropY = (sourceHeight - cropHeight) / 2;
  }

  context.save();
  if (mirror) {
    context.translate(targetWidth, 0);
    context.scale(-1, 1);
  }
  context.drawImage(
    source,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    targetWidth,
    targetHeight,
  );
  context.restore();
}

function captureCurrentFrame() {
  if (!refs.camera.videoWidth || !refs.camera.videoHeight) {
    throw new Error("카메라 프레임을 아직 사용할 수 없습니다.");
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = PHOTO_WIDTH;
  canvas.height = PHOTO_HEIGHT;

  drawImageCover(
    context,
    refs.camera,
    refs.camera.videoWidth,
    refs.camera.videoHeight,
    PHOTO_WIDTH,
    PHOTO_HEIGHT,
    true,
  );

  return canvas.toDataURL("image/png");
}

async function normalizeUploadedPhoto(file) {
  const sourceUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(sourceUrl);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = PHOTO_WIDTH;
    canvas.height = PHOTO_HEIGHT;
    drawImageCover(
      context,
      image,
      image.naturalWidth,
      image.naturalHeight,
      PHOTO_WIDTH,
      PHOTO_HEIGHT,
    );
    return canvas.toDataURL("image/jpeg", 0.94);
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

async function handlePhotoUpload(event) {
  const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/"));
  event.target.value = "";

  if (!files.length || state.isCountingDown || state.isAutoSession || state.isPhotoProcessing) {
    return;
  }

  const emptySlots = state.capturedPhotos
    .map((photo, index) => (photo ? -1 : index))
    .filter((index) => index !== -1);
  const targets = emptySlots.length
    ? [state.activeSlotIndex, ...emptySlots].filter(
        (index, position, list) => !state.capturedPhotos[index] && list.indexOf(index) === position,
      )
    : [state.activeSlotIndex];

  try {
    const uploadCount = Math.min(files.length, targets.length);
    for (let index = 0; index < uploadCount; index += 1) {
      const rawPhoto = await normalizeUploadedPhoto(files[index]);
      state.activeSlotIndex = targets[index];
      await processAndStorePhoto(targets[index], rawPhoto);
    }

    const nextEmptySlot = getNextEmptySlot(state.activeSlotIndex + 1);
    if (nextEmptySlot !== -1) {
      state.activeSlotIndex = nextEmptySlot;
    }
    renderPreviewShell();
  } catch (error) {
    console.error(error);
    alert("사진을 불러오지 못했어요. 다른 이미지로 다시 시도해 주세요.");
  }
}

function handleRetake() {
  state.capturedPhotos[state.activeSlotIndex] = null;
  state.rawCapturedPhotos[state.activeSlotIndex] = null;
  state.portraitCutouts[state.activeSlotIndex] = null;
  state.portraitBaseCutouts[state.activeSlotIndex] = null;
  renderPreviewShell();
}

function handleReset() {
  state.capturedPhotos = Array(CUT_COUNT).fill(null);
  state.rawCapturedPhotos = Array(CUT_COUNT).fill(null);
  state.portraitCutouts = Array(CUT_COUNT).fill(null);
  state.portraitBaseCutouts = Array(CUT_COUNT).fill(null);
  state.activeSlotIndex = 0;
  state.stickers = [];
  state.selectedStickerId = null;
  state.isAutoSession = false;
  state.frameLayout = createFrameLayout(getSelectedTheme());
  refs.countdown.classList.remove("visible");
  renderPreviewShell();
}

function restartWorkflow() {
  stopCamera();
  handleReset();
  state.currentWorkflowStep = 1;
  state.maxUnlockedWorkflowStep = 1;
  renderWorkflow();
  refs.workflowShell.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function captureIntoSlot(slotIndex) {
  state.activeSlotIndex = slotIndex;
  renderPreviewShell();
  await runCountdown();
  await processAndStorePhoto(slotIndex, captureCurrentFrame());
}

async function handleCapture() {
  if (!state.stream || state.isCountingDown || state.isAutoSession || state.isPhotoProcessing) {
    return;
  }

  try {
    await captureIntoSlot(state.activeSlotIndex);
    const nextEmptySlot = getNextEmptySlot(state.activeSlotIndex + 1);
    if (nextEmptySlot !== -1) {
      state.activeSlotIndex = nextEmptySlot;
    }
    renderPreviewShell();
  } catch (error) {
    console.error(error);
    state.isCountingDown = false;
    renderPreviewShell();
    alert("사진을 촬영하지 못했어요. 카메라 연결 상태를 다시 확인해 주세요.");
  }
}

function getAutoSessionTargets() {
  if (!state.capturedPhotos[state.activeSlotIndex]) {
    return Array.from({ length: CUT_COUNT - state.activeSlotIndex }, (_, index) => index + state.activeSlotIndex)
      .filter((index) => !state.capturedPhotos[index]);
  }

  const nextEmpty = getNextEmptySlot(state.activeSlotIndex + 1);
  if (nextEmpty === -1) {
    return [];
  }

  return Array.from({ length: CUT_COUNT - nextEmpty }, (_, index) => index + nextEmpty)
    .filter((index) => !state.capturedPhotos[index]);
}

async function handleAutoCapture() {
  if (!state.stream || state.isCountingDown || state.isAutoSession || state.isPhotoProcessing) {
    return;
  }

  const targets = getAutoSessionTargets();
  if (!targets.length) {
    alert("연속 촬영할 빈 컷이 없어요. 다시 찍을 칸을 선택하거나 전체 초기화를 해 주세요.");
    return;
  }

  state.isAutoSession = true;
  renderPreviewShell();

  try {
    for (let index = 0; index < targets.length; index += 1) {
      await captureIntoSlot(targets[index]);
      renderPreviewShell();

      if (index < targets.length - 1) {
        await wait(AUTO_SHOT_GAP_MS);
      }
    }

    const nextEmptySlot = getNextEmptySlot();
    if (nextEmptySlot !== -1) {
      state.activeSlotIndex = nextEmptySlot;
    }
  } catch (error) {
    console.error(error);
    alert("연속 촬영을 완료하지 못했어요. 카메라 연결 상태를 다시 확인해 주세요.");
  } finally {
    state.isAutoSession = false;
    state.isCountingDown = false;
    refs.countdown.classList.remove("visible");
    renderPreviewShell();
  }
}

function addStickerToCanvas(asset) {
  const sticker = {
    id: `sticker-${state.nextStickerId}`,
    label: asset.label,
    dataUrl: asset.dataUrl,
    x: 0.5,
    y: 0.5,
    scale: 1,
    rotation: 0,
    mirrored: false,
  };

  state.nextStickerId += 1;
  state.stickers.push(sticker);
  state.selectedStickerId = sticker.id;
  renderStickerLayer();
}

function bindStickerPointerGesture(event, update) {
  const pointerId = event.pointerId;

  function handleMove(moveEvent) {
    if (moveEvent.pointerId !== pointerId) {
      return;
    }
    moveEvent.preventDefault();
    update(moveEvent);
  }

  function handleEnd(endEvent) {
    if (endEvent.pointerId !== pointerId) {
      return;
    }
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerup", handleEnd);
    window.removeEventListener("pointercancel", handleEnd);
  }

  window.addEventListener("pointermove", handleMove, { passive: false });
  window.addEventListener("pointerup", handleEnd);
  window.addEventListener("pointercancel", handleEnd);
}

function startStickerDrag(event, stickerId, element) {
  const sticker = state.stickers.find((item) => item.id === stickerId);
  if (!sticker) {
    return;
  }

  selectStickerInLayer(stickerId);

  const stageRect = refs.stripInner.getBoundingClientRect();
  const startClientX = event.clientX;
  const startClientY = event.clientY;
  const startX = sticker.x;
  const startY = sticker.y;

  bindStickerPointerGesture(event, (moveEvent) => {
    sticker.x = clamp(startX + (moveEvent.clientX - startClientX) / stageRect.width, 0.04, 0.96);
    sticker.y = clamp(startY + (moveEvent.clientY - startClientY) / stageRect.height, 0.03, 0.97);
    applyStickerTransform(element, sticker);
  });
}

function startStickerScale(event, stickerId, element) {
  const sticker = state.stickers.find((item) => item.id === stickerId);
  if (!sticker) {
    return;
  }

  selectStickerInLayer(stickerId);
  const stageRect = refs.stripInner.getBoundingClientRect();
  const centerX = stageRect.left + sticker.x * stageRect.width;
  const centerY = stageRect.top + sticker.y * stageRect.height;
  const startDistance = Math.max(1, Math.hypot(event.clientX - centerX, event.clientY - centerY));
  const startScale = sticker.scale;

  bindStickerPointerGesture(event, (moveEvent) => {
    const distance = Math.hypot(moveEvent.clientX - centerX, moveEvent.clientY - centerY);
    sticker.scale = clamp(startScale * (distance / startDistance), 0.45, 2.6);
    applyStickerTransform(element, sticker);
  });
}

function startStickerRotate(event, stickerId, element) {
  const sticker = state.stickers.find((item) => item.id === stickerId);
  if (!sticker) {
    return;
  }

  selectStickerInLayer(stickerId);
  const stageRect = refs.stripInner.getBoundingClientRect();
  const centerX = stageRect.left + sticker.x * stageRect.width;
  const centerY = stageRect.top + sticker.y * stageRect.height;
  const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
  const startRotation = sticker.rotation;

  bindStickerPointerGesture(event, (moveEvent) => {
    const angle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
    const delta = ((angle - startAngle) * 180) / Math.PI;
    sticker.rotation = Math.round(((startRotation + delta + 540) % 360) - 180);
    applyStickerTransform(element, sticker);
  });
}

function toggleStickerMirror(stickerId) {
  const sticker = state.stickers.find((item) => item.id === stickerId);
  if (!sticker) {
    return;
  }

  sticker.mirrored = !sticker.mirrored;
  state.selectedStickerId = stickerId;
  renderStickerLayer();
}

function deleteStickerById(stickerId) {
  state.stickers = state.stickers.filter((sticker) => sticker.id !== stickerId);
  state.selectedStickerId = null;
  renderStickerLayer();
}

function saveStripRecord(item) {
  state.savedStrips = [item, ...state.savedStrips].slice(0, 8);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedStrips));
  renderSavedGallery();
}

function drawRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawWindowLights(context, x, y) {
  [
    { color: "rgba(235,240,255,0.7)", offset: 0 },
    { color: "#f2b6dc", offset: 14 },
    { color: "rgba(235,240,255,0.28)", offset: 28 },
  ].forEach((item) => {
    context.fillStyle = item.color;
    context.fillRect(x + item.offset, y, 3, 3);
  });
}

function seededUnit(seed, index) {
  const value = Math.sin(seed * 91.73 + (index + 1) * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function drawSavedStarField(context, theme, width, height, count = 280) {
  context.save();
  context.globalCompositeOperation = "screen";

  for (let index = 0; index < count; index += 1) {
    const x = seededUnit(theme.seed, index * 4) * width;
    const y = seededUnit(theme.seed, index * 4 + 1) * height;
    const sizeSeed = seededUnit(theme.seed, index * 4 + 2);
    const alpha = 0.16 + seededUnit(theme.seed, index * 4 + 3) * 0.68;
    const size = sizeSeed > 0.94 ? 2.8 + sizeSeed * 3 : 0.45 + sizeSeed * 1.25;

    context.save();
    context.translate(x, y);
    context.globalAlpha = alpha;
    context.fillStyle = sizeSeed > 0.62 ? theme.palette.accentSoft : "#ffffff";
    context.shadowColor = theme.palette.accentSoft;
    context.shadowBlur = sizeSeed > 0.94 ? 12 : 3;
    context.beginPath();
    context.arc(0, 0, Math.max(0.45, size * 0.34), 0, Math.PI * 2);
    context.fill();

    if (sizeSeed > 0.94) {
      context.strokeStyle = "#ffffff";
      context.lineWidth = 0.7;
      context.beginPath();
      context.moveTo(-size * 2.2, 0);
      context.lineTo(size * 2.2, 0);
      context.moveTo(0, -size * 2.2);
      context.lineTo(0, size * 2.2);
      context.stroke();
    }
    context.restore();
  }

  context.restore();
}

function drawSavedNebula(context, theme, width, height) {
  const clouds = [
    { x: 0.08, y: 0.2, radius: 0.54, color: theme.palette.accentSoft, alpha: 0.32 },
    { x: 0.88, y: 0.42, radius: 0.5, color: theme.palette.accent, alpha: 0.3 },
    { x: 0.18, y: 0.72, radius: 0.58, color: "#d5a2f3", alpha: 0.3 },
    { x: 0.8, y: 0.9, radius: 0.48, color: "#ffafd6", alpha: 0.26 },
  ];

  context.save();
  context.globalCompositeOperation = "screen";
  clouds.forEach((cloud) => {
    const x = cloud.x * width;
    const y = cloud.y * height;
    const radius = width * cloud.radius;
    const glow = context.createRadialGradient(x, y, 0, x, y, radius);
    glow.addColorStop(0, withAlpha(cloud.color, cloud.alpha));
    glow.addColorStop(0.42, withAlpha(cloud.color, cloud.alpha * 0.45));
    glow.addColorStop(1, withAlpha(cloud.color, 0));
    context.fillStyle = glow;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  });
  context.restore();
}

function drawSavedStarlightHorizon(context, theme, width, height) {
  const horizonY = height * 0.88;
  const glow = context.createRadialGradient(width / 2, horizonY, 0, width / 2, horizonY, width * 0.72);
  glow.addColorStop(0, withAlpha(theme.palette.accentSoft, 0.46));
  glow.addColorStop(0.28, withAlpha(theme.palette.accent, 0.22));
  glow.addColorStop(1, withAlpha(theme.palette.accent, 0));
  context.fillStyle = glow;
  context.fillRect(0, horizonY - width * 0.72, width, width * 1.44);

  context.save();
  context.strokeStyle = withAlpha(theme.palette.accentSoft, 0.38);
  context.lineWidth = 1;
  for (let index = 0; index < 5; index += 1) {
    context.beginPath();
    context.ellipse(width / 2, horizonY + index * 15, width * (0.36 + index * 0.08), 18 + index * 8, 0, Math.PI, Math.PI * 2);
    context.stroke();
  }
  context.restore();
}

function drawSavedGalaxy(context, theme, centerX, centerY, radius, seed) {
  context.save();
  context.globalCompositeOperation = "screen";

  for (let arm = 0; arm < 4; arm += 1) {
    for (let index = 0; index < 120; index += 1) {
      const progress = index / 119;
      const angle = progress * Math.PI * 3.8 + arm * (Math.PI / 2);
      const distance = radius * progress;
      const jitter = (seededUnit(seed, arm * 200 + index) - 0.5) * radius * 0.1;
      const x = centerX + Math.cos(angle) * (distance + jitter);
      const y = centerY + Math.sin(angle) * (distance * 0.36 + jitter * 0.25);
      const size = 0.7 + (1 - progress) * 2.2;

      context.globalAlpha = 0.18 + (1 - progress) * 0.44;
      context.fillStyle = arm % 2 === 0 ? theme.palette.accentSoft : theme.palette.accent;
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    }
  }

  const core = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.28);
  core.addColorStop(0, "rgba(255,255,255,0.92)");
  core.addColorStop(0.25, withAlpha(theme.palette.accentSoft, 0.58));
  core.addColorStop(1, withAlpha(theme.palette.accent, 0));
  context.globalAlpha = 1;
  context.fillStyle = core;
  context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
  context.restore();
}

function drawStripBackground(context, theme, width, height) {
  const background = context.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, theme.palette.bgA);
  background.addColorStop(0.55, theme.palette.bgB);
  background.addColorStop(1, theme.palette.bgC);
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  if (theme.id === "aurora") {
    [0.08, 0.29, 0.52, 0.73, 0.94].forEach((baseX, index) => {
      drawAuroraBand(
        context,
        {
          baseX,
          width: 0.17,
          amplitude: 0.07 + (index % 2) * 0.025,
          frequency: 0.84 + index * 0.08,
          speed: 0.28,
          phase: index * 0.82,
          opacity: 0.24,
          colorA: index % 2 ? "#ffc0e1" : "#ff97cd",
          colorB: "#c89cf4",
        },
        width,
        height,
        0,
      );
    });
  } else if (theme.id === "starlight") {
    drawSavedStarlightHorizon(context, theme, width, height);
  } else if (theme.id === "nebula") {
    drawSavedNebula(context, theme, width, height);
  } else if (theme.id === "astral") {
    drawSavedNebula(context, theme, width, height);
    drawSavedGalaxy(context, theme, width * 0.74, height * 0.12, width * 0.25, theme.seed);
    drawSavedGalaxy(context, theme, width * 0.24, height * 0.82, width * 0.28, theme.seed + 8);
  }

  drawSavedStarField(context, theme, width, height);
}

function drawBackdropStars(context, layout) {
  layout.stars.forEach((star) => {
    const x = star.x;
    const y = star.y;
    const size = star.size;
    context.save();
    context.translate(x, y);
    context.globalAlpha = star.opacity;
    context.strokeStyle = star.color;
    context.lineWidth = Math.max(1, size * 0.1);
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(-size * 0.5, 0);
    context.lineTo(size * 0.5, 0);
    context.moveTo(0, -size * 0.5);
    context.lineTo(0, size * 0.5);
    context.stroke();
    context.restore();
  });
}

function drawFrameLayout(context, theme, shellX, shellY, shellWidth, shellHeight, contentTop, contentBottom) {
  const layout = ensureFrameLayout();
  const layoutScale = shellWidth / 430;

  layout.filaments.forEach((filament) => {
    const x = shellX + filament.x * shellWidth;
    const y = shellY + filament.y * shellHeight;
    context.save();
    context.translate(x, y);
    context.rotate((filament.angle * Math.PI) / 180);
    context.globalAlpha = filament.opacity;
    const filamentWidth = filament.width * layoutScale;
    const gradient = context.createLinearGradient(0, 0, filamentWidth, 0);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.48, withAlpha(theme.palette.accent, 0.6));
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.strokeStyle = gradient;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(filamentWidth, 0);
    context.stroke();
    context.restore();
  });

  layout.crosses.forEach((cross) => {
    const x = shellX + cross.x * shellWidth;
    const y = shellY + cross.y * shellHeight;
    context.save();
    context.globalAlpha = cross.opacity;
    context.strokeStyle = theme.palette.border;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(x - (cross.size * layoutScale) / 2, y);
    context.lineTo(x + (cross.size * layoutScale) / 2, y);
    context.moveTo(x, y - (cross.size * layoutScale) / 2);
    context.lineTo(x, y + (cross.size * layoutScale) / 2);
    context.stroke();
    context.restore();
  });

  drawBackdropStars(
    context,
    {
      stars: layout.stars.map((star) => ({
        ...star,
        x: shellX + star.x * shellWidth,
        y: shellY + star.y * shellHeight,
        size: star.size * layoutScale,
      })),
    },
  );

  context.save();
  context.strokeStyle = withAlpha(theme.palette.border, 0.28);
  context.lineWidth = 1;
  context.strokeRect(shellX + 10, contentTop - 12, shellWidth - 20, contentBottom - contentTop + 24);
  context.restore();
}

async function generateStripDataUrl() {
  const theme = getSelectedTheme();
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  await document.fonts.load('48px "ZenSerif"').catch(() => undefined);

  const width = 960;
  const outerPadding = 80;
  const shellInset = 20;
  const topBarHeight = 136;
  const shellHeaderGap = 20;
  const footerHeight = 120;
  const slotGap = 26;
  const photoWidth = width - outerPadding * 2;
  const photoHeight = Math.round((photoWidth * 5) / 4);
  const slotsTop = outerPadding + topBarHeight + shellHeaderGap;
  const height = slotsTop + photoHeight * CUT_COUNT + slotGap * (CUT_COUNT - 1) + footerHeight + outerPadding;
  const shellX = shellInset;
  const shellY = shellInset;
  const shellWidth = width - shellInset * 2;
  const shellHeight = height - shellInset * 2;
  const footerY = height - footerHeight;

  canvas.width = width;
  canvas.height = height;

  drawStripBackground(context, theme, width, height);

  context.fillStyle = theme.palette.frameFill;
  context.fillRect(shellX, shellY, shellWidth, shellHeight);
  context.strokeStyle = withAlpha(theme.palette.border, 0.34);
  context.lineWidth = 1;
  context.strokeRect(shellX, shellY, shellWidth, shellHeight);
  context.strokeRect(shellX + 10, shellY + 10, shellWidth - 20, shellHeight - 20);

  drawWindowLights(context, shellX + 24, shellY + 24);

  context.fillStyle = theme.palette.ink;
  context.font = '48px "ZenSerif", serif';
  context.textAlign = "left";
  context.fillText("SPECTRA", outerPadding, shellY + 70);
  context.font = '22px "ZenSerif", serif';
  context.fillStyle = withAlpha(theme.palette.border, 0.72);
  context.fillText(theme.name, outerPadding, shellY + 100);

  context.font = '10px "ZenSerif", serif';
  context.textAlign = "right";
  context.fillStyle = withAlpha(theme.palette.border, 0.55);
  context.fillText(theme.shellLabel, width - outerPadding, shellY + 42);
  context.fillText("FOUR EXPOSURES / ARCHIVE 04", width - outerPadding, shellY + 62);
  context.beginPath();
  context.moveTo(outerPadding, shellY + topBarHeight - 10);
  context.lineTo(width - outerPadding, shellY + topBarHeight - 10);
  context.strokeStyle = withAlpha(theme.palette.border, 0.24);
  context.stroke();

  drawFrameLayout(
    context,
    theme,
    shellX,
    shellY,
    shellWidth,
    shellHeight,
    slotsTop,
    slotsTop + photoHeight * CUT_COUNT + slotGap * (CUT_COUNT - 1),
  );

  const loadedPhotos = await Promise.all(
    state.capturedPhotos.map((photo) => (photo ? loadImage(photo) : Promise.resolve(null))),
  );

  loadedPhotos.forEach((image, index) => {
    const slotY = slotsTop + index * (photoHeight + slotGap);

    context.save();
    context.beginPath();
    context.rect(outerPadding, slotY, photoWidth, photoHeight);
    context.clip();

    if (image) {
      context.drawImage(image, outerPadding, slotY, photoWidth, photoHeight);
      context.fillStyle = "rgba(5, 8, 16, 0.06)";
      context.fillRect(outerPadding, slotY, photoWidth, photoHeight);
    } else {
      context.fillStyle = "#2c1934";
      context.fillRect(outerPadding, slotY, photoWidth, photoHeight);
      context.fillStyle = withAlpha(theme.palette.ink, 0.72);
      context.textAlign = "center";
      context.font = '14px "ZenSerif", serif';
      context.fillText(`FRAME ${String(index + 1).padStart(2, "0")}`, width / 2, slotY + photoHeight / 2);
    }

    context.restore();

    context.strokeStyle = withAlpha(theme.palette.border, 0.52);
    context.lineWidth = 1;
    context.strokeRect(outerPadding, slotY, photoWidth, photoHeight);
    context.strokeStyle = withAlpha(theme.palette.border, 0.14);
    context.strokeRect(outerPadding + 10, slotY + 10, photoWidth - 20, photoHeight - 20);

    context.save();
    context.translate(outerPadding + 22, slotY + photoHeight - 22);
    context.strokeStyle = withAlpha(theme.palette.accentSoft, 0.72);
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(-8, 0);
    context.lineTo(8, 0);
    context.moveTo(0, -8);
    context.lineTo(0, 8);
    context.stroke();
    context.restore();
  });

  const stageWidth = shellWidth;
  const stageHeight = shellHeight;
  const loadedStickers = await Promise.all(
    state.stickers.map((sticker) => loadImage(sticker.dataUrl).then((image) => ({ image, sticker }))),
  );

  loadedStickers.forEach(({ image, sticker }) => {
    const size = stageWidth * STICKER_BASE_WIDTH_RATIO * sticker.scale;
    const x = shellX + sticker.x * stageWidth;
    const y = shellY + sticker.y * stageHeight;

    context.save();
    context.translate(x, y);
    context.rotate((sticker.rotation * Math.PI) / 180);
    context.scale(sticker.mirrored ? -1 : 1, 1);
    context.drawImage(image, -size / 2, -size / 2, size, size);
    context.restore();
  });

  context.fillStyle = theme.palette.ink;
  context.font = '10px "ZenSerif", serif';
  context.textAlign = "left";
  context.fillText("CELESTIAL IMAGE ARCHIVE", outerPadding, footerY + 42);
  context.fillText(theme.tagLine, outerPadding, footerY + 58);
  context.textAlign = "right";
  context.fillText(formatTimestamp(), width - outerPadding, footerY + 58);

  return canvas.toDataURL("image/png");
}

function downloadDataUrl(dataUrl, fileName) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.rel = "noopener";
  link.click();
}

async function handleSave() {
  if (getFilledCount() !== CUT_COUNT) {
    return;
  }

  try {
    const dataUrl = await generateStripDataUrl();
    const theme = getSelectedTheme();
    const savedAt = formatTimestamp();
    const fileName = `spectra-${theme.id}-${Date.now()}.png`;

    downloadDataUrl(dataUrl, fileName);

    saveStripRecord({
      dataUrl,
      themeName: theme.name,
      savedAt,
      fileName,
    });
  } catch (error) {
    console.error(error);
    alert("이미지를 저장하지 못했어요. 다시 시도해 주세요.");
  }
}

function restoreSavedStrips() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw);
    state.savedStrips = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(error);
    state.savedStrips = [];
  }
}

function bindEvents() {
  refs.musicToggleButton.addEventListener("click", toggleBackgroundMusic);
  refs.frameNextButton.addEventListener("click", () => goToWorkflowStep(2));
  refs.captureBackButton.addEventListener("click", () => goToWorkflowStep(1));
  refs.captureNextButton.addEventListener("click", () => goToWorkflowStep(3));
  refs.stickerBackButton.addEventListener("click", () => goToWorkflowStep(2));
  refs.stickerNextButton.addEventListener("click", () => goToWorkflowStep(4));
  refs.previewBackButton.addEventListener("click", () => goToWorkflowStep(3));
  refs.previewNextButton.addEventListener("click", () => goToWorkflowStep(5));
  refs.saveBackButton.addEventListener("click", () => goToWorkflowStep(4));
  refs.restartButton.addEventListener("click", restartWorkflow);
  refs.workflowProgressItems.forEach((item) => {
    item.addEventListener("click", () => goToWorkflowStep(Number(item.dataset.workflowTarget)));
  });
  refs.startCameraButton.addEventListener("click", startCamera);
  refs.uploadPhotoButton.addEventListener("click", () => refs.photoUploadInput.click());
  refs.photoUploadInput.addEventListener("change", handlePhotoUpload);
  refs.portraitBackgroundToggle.addEventListener("change", handlePortraitBackgroundToggle);
  refs.captureButton.addEventListener("click", handleCapture);
  refs.autoCaptureButton.addEventListener("click", handleAutoCapture);
  refs.retakeButton.addEventListener("click", handleRetake);
  refs.editPortraitButton.addEventListener("click", openPortraitEditor);
  refs.resetButton.addEventListener("click", handleReset);
  refs.portraitEraseButton.addEventListener("click", () => setPortraitEditorMode("erase"));
  refs.portraitRestoreButton.addEventListener("click", () => setPortraitEditorMode("restore"));
  refs.portraitBrushSize.addEventListener("input", (event) => {
    state.portraitEditorBrushSize = Number(event.target.value);
    renderPortraitEditor();
  });
  refs.portraitUndoButton.addEventListener("click", undoPortraitEditorStroke);
  refs.portraitResetMaskButton.addEventListener("click", resetPortraitEditorMask);
  refs.portraitEditorCancelButton.addEventListener("click", closePortraitEditor);
  refs.portraitEditorApplyButton.addEventListener("click", applyPortraitEditorChanges);
  refs.portraitEditorOverlay.addEventListener("click", (event) => {
    if (event.target === refs.portraitEditorOverlay) {
      closePortraitEditor();
    }
  });
  refs.portraitEditorCanvas.addEventListener("pointerdown", handlePortraitEditorPointerDown);
  refs.portraitEditorCanvas.addEventListener("pointermove", handlePortraitEditorPointerMove, {
    passive: false,
  });
  refs.portraitEditorCanvas.addEventListener("pointerup", handlePortraitEditorPointerEnd);
  refs.portraitEditorCanvas.addEventListener("pointercancel", handlePortraitEditorPointerEnd);
  refs.portraitEditorCanvas.addEventListener("pointerleave", () => {
    if (state.portraitEditorPointerId === null) {
      state.portraitEditorCursor = null;
      renderPortraitEditor();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !refs.portraitEditorOverlay.hidden) {
      closePortraitEditor();
    }
  });
  refs.saveButton.addEventListener("click", handleSave);
  refs.clearStickersButton.addEventListener("click", () => {
    state.stickers = [];
    state.selectedStickerId = null;
    renderStickerLayer();
  });
  refs.stripInner.addEventListener("click", (event) => {
    if (event.target === refs.stripInner || event.target === refs.stickerLayer) {
      state.selectedStickerId = null;
      renderStickerLayer();
    }
  });

  window.addEventListener("beforeunload", () => {
    stopCamera();
    refs.backgroundMusic.pause();
    removeBackgroundVideoUnlockListeners();
    removeMusicUnlockListeners();
    window.removeEventListener("resize", resizeBackdropCanvas);

    if (state.backgroundVideoVisibilityHandler) {
      document.removeEventListener("visibilitychange", state.backgroundVideoVisibilityHandler);
    }

    if (state.backgroundVideoMonitor) {
      window.clearInterval(state.backgroundVideoMonitor);
    }

    if (state.backgroundVideoTransitionTimer) {
      window.clearTimeout(state.backgroundVideoTransitionTimer);
    }

    if (state.backdropAnimationFrame) {
      window.cancelAnimationFrame(state.backdropAnimationFrame);
    }

    state.portraitSegmenter?.close();
  });
}

function init() {
  restoreSavedStrips();
  state.frameLayout = createFrameLayout(getSelectedTheme());
  initializeBackgroundVideo();
  initializeBackgroundMusic();
  initializeBackdrop();
  bindEvents();
  renderAll();
  ensurePortraitSegmenter().catch((error) => console.error(error));
}

init();
