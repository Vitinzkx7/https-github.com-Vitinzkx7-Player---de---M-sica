const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("audioFile");
let source, analyser;

fileInput.onchange = () => {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    audioCtx.decodeAudioData(reader.result, function (buffer) {
      if (source) source.stop();
      source = audioCtx.createBufferSource();
      source.buffer = buffer;
      analyser = audioCtx.createAnalyser();
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      source.start();
      visualize();
    });
  };
  reader.readAsArrayBuffer(file);
};

function visualize() {
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i];
      ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }
  draw();
}
