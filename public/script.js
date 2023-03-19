const CHARACTERS = ['.', ',', '~',':', ';', '=', '!', '*', '#', '$', '@'];
const charCount = CHARACTERS.length;
const step = Math.round(256/charCount);
let frames = [];

function getCharacter(pixelVal){
    let index = Math.round(pixelVal/step)
    if (index >= CHARACTERS.length){
        index = CHARACTERS.length -1;
    }
    return CHARACTERS[index];
}

function displayFilter() {
    this.c1 = document.getElementById("canvas");
    this.ctx1 = this.c1.getContext("2d");
    var codeSection = document.getElementById("code-section");

    var result = "";

    console.log("Frame width: ", frames[0].width);
    console.log("frame height: ", frames[0].height);

    for (let i = 0; i < frames[0].width; i++) {
        for (let j = 0; j < frames[0].width; j++) {

            const index = (i * frames[0].width) + j;

            console.log("index: ", index);
            result += getCharacter(frames[0].data[index]);
        }
        result += "\n";
    }

    codeSection.innerHTML += result;

    // frames.forEach(frame => {
    //     codeSection.innerHTML = "";
    //     setTimeout(() => {
    //         for (let i = 0; i < frame.width; i++) {
    //             for (let j = 0; j < frame.height; j++) {
    //                 codeSection.innerHTML += getCharacter(frame.data[i])
    //             }
    //         }
    //     }, 10000)
    //     // var codeSection = document.getElementById("code-section");
    //     // codeSection.innerHTML += getCharacter(frame.data[0])
    //     // codeSection.innerHTML = "";
    // });

}

function timerCallback() {
    if (this.video.paused || this.video.ended) {
        displayFilter();
        return;
    }
    this.computeFrame();
    setTimeout(() => {
        this.timerCallback();
    }, 2); // roughly 60 frames per second
}

function doLoad() {
    this.video = document.getElementById("video");
    this.c1 = document.getElementById("canvas");
    this.ctx1 = this.c1.getContext("2d");

    this.video.addEventListener(
    "play",
    () => {
        this.width = this.video.width;
        this.height = this.video.height;
        this.timerCallback();
    },
    false
    );
};

function computeFrame() {
    // var codeSection = document.getElementById("code-section");
    // codeSection.innerHTML = "";

    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    const frame = this.ctx1.getImageData(0, 0, this.width, this.height);

    const l = frame.data.length / 4;

    for (let i = 0; i < l; i++) {
    const grey =
        (frame.data[i * 4 + 0] +
        frame.data[i * 4 + 1] +
        frame.data[i * 4 + 2]) /
        3;

    frame.data[i * 4 + 0] = grey;
    frame.data[i * 4 + 1] = grey;
    frame.data[i * 4 + 2] = grey;
    }

    frames.push(frame);

    this.ctx1.putImageData(frame, 0, 0);
    return;
};

document.onreadystatechange = () => {
    if (document.readyState == 'complete')
    {
        doLoad();
    }
}