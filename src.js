const $ = e => document.getElementById(e);
const preview = $("preview");
const recording = $("recording");
const circle = $("circle");
circle.style.display = "none";

const initCam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });
    preview.srcObject = stream;
    preview.captureStream = preview.captureStream || preview.mozCaptureStream;
};
initCam();

const waitNext = () => new Promise(resolve => requestAnimationFrame(resolve));


let recorder = null;
const startRecording = async () => {
    circle.style.display = "block";
    recorder = new MediaRecorder(preview.captureStream());
    let data = [];

    recorder.ondataavailable = event => data.push(event.data);
    recorder.start();

    let isStop = false;
    recorder.onstop = () => isStop = true;
    while (isStop == false) {
        await waitNext();
    }

    const recordedBlob = new Blob(data, { type: "video/webm" });
    recording.src = URL.createObjectURL(recordedBlob);
    recording.play();
    circle.style.display = "none";
    recorder = null;
};

const switchMode = () => {
    if (recorder != null) {
        recorder.stop();
        preview.style.display = "none";
        recording.style.display = "block";
    } else {
        startRecording();
        preview.style.display = "block";
        recording.style.display = "none";
    }
}
recording.onended = () => switchMode();
document.addEventListener('keydown', e => {
    console.error(e.keyCode);
    if (e.keyCode == 32) {
        console.error(2);
        switchMode();
    }
});

// recStart(true);
// [const stop = (stream) => stream.getTracks().forEach(track => track.stop());

// startButton.addEventListener("click", () => {


//     return new Promise(resolve => preview.onplaying = resolve);
// }).then(() => startRecording(preview.captureStream()))
//     .then(recordedChunks => {
//         let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
//         recording.src = URL.createObjectURL(recordedBlob);
//     })
//     .catch(console.error);
// }, false); stopButton.addEventListener("click", function () {
//         stop(preview.srcObject);
//     }, false);