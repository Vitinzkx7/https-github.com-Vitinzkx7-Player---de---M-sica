const audio = document.getElementById('audio');
const fileInput = document.getElementById('audioFile');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const loopBtn = document.getElementById('loopBtn');
const volumeSlider = document.getElementById('volume');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const themeToggle = document.getElementById('themeToggle');
const playlist = document.getElementById('playlist');

let audioCtx;
let source;
let analyser;
let dataArray;
let bufferLength;
let tracks = [];
let currentTrackIndex = 0;

// Controle de arquivos
fileInput.addEventListener('change', function () {
  const files = Array.from(this.files);
  tracks = files;
  playlist.innerHTML = '';

  files.forEach((file, index) => {
    const li = document.createElement('li');
    li.textContent = file.name;
    li.addEventListener('click', () => loadTrack(index));
    playlist.appendChild(li);
  });

  if (files.length > 0) {
    loadTrack(0);
  }
});

// Carrega e configura uma faixa da playlist
function loadTrack(index) {
  currentTrackIndex = index;
  const file = URL.createObjectURL(tracks[index]);
  audio.src = file;
  audio.load();
  setupVisualizer();
  audio.play();
}

// Controles
playBtn.onclick = () => audio.play();
pauseBtn.onclick = () => audio.pause();
loopBtn.onclick = () => {
  audio.loop = !audio.loop;
  loopBtn.style.backgroundColor = audio.loop ? 'green' : '';
};
volumeSlider.oninput = () => audio.volume = volumeSlider.value;

// Tempo
audio.ontimeupdate = () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
};

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Visualizador
function setupVisualizer() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (source) source.disconnect();

  source = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  draw();
}

function draw() {
  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    ctx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
    ctx.fi
