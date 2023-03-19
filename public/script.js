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
    // this.c1 = document.getElementById("canvas");
    // this.ctx1 = this.c1.getContext("2d");
    // var codeSection = document.getElementById("code-section");

    // var result = "";

    // console.log("Frame width: ", frames[0].width);
    // console.log("frame height: ", frames[0].height);
    // console.log("length: ", frames[0].data.length)

    // let colCount = 0;
    // for (let i = 0; i < frames[0].data.length; i += 4) {
    //     colCount++;
    //     result += getCharacter(frames[0].data[i]);

    //     if (colCount == frames[0].width) {
    //         colCount = 0;
    //         result += "\n";
    //     }
    // }

    // for (let i = 0; i < frames[0].width; i++) {
    //     for (let j = 0; j < frames[0].width; j++) {

    //         const index = (i * frames[0].width) + j;

    //         console.log("index: ", index);
    //         result += getCharacter(frames[0].data[index]);
    //     }
    //     result += "\n";
    // }

    // codeSection.innerHTML += result;

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
    }, 16); // roughly 60 frames per second
}

function doLoad() {
    this.video = document.getElementById("video");
    this.c1 = document.getElementById("canvas");
    this.ctx1 = this.c1.getContext("2d", { willReadFrequently: true});

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
    var codeSection = document.getElementById("code-section");
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    const frame = this.ctx1.getImageData(0, 0, this.width, this.height);

    codeSection.innerHTML = "";

    // on divise par 4 car c'est un 1D array de RGBA values
    const l = frame.data.length / 4;

    for (let i = 0; i < l; i++) {
        
        // ici on set les valeurs RGB
        const grey =
            (frame.data[i * 4 + 0] +
            frame.data[i * 4 + 1] +
            frame.data[i * 4 + 2]) /
            3;

        frame.data[i * 4 + 0] = grey;
        frame.data[i * 4 + 1] = grey;
        frame.data[i * 4 + 2] = grey;
        
        // Ici on set la valeur Alpha (rgbA)
        frame.data[i * 4 + 3] = 255;
    }

    var result = "";

    // console.log("Frame width: ", frames[0].width);
    // console.log("frame height: ", frames[0].height);
    // console.log("length: ", frames[0].data.length)

    let colCount = 0;
    for (let i = 0; i < frame.data.length; i += 4) {
        colCount++;
        result += getCharacter(frame.data[i]);

        if (colCount == frame.width) {
            colCount = 0;
            result += "\n";
        }
    }

    codeSection.innerHTML += result;

    // frames.push(frame);

    this.ctx1.putImageData(frame, 0, 0);
    return;
};

function convertFrameToGrayScale(frame) {
    // frame.data.forEach(element => {
    //     console.log("element: ", element)
    // });
    // for (let i = 0; i < frame.width; i++) {
    //     for (let j = 0; j < frame.height; j++) {
    //         const index = (i * frames[0].width) + j;

    //     }
    // }
}

document.onreadystatechange = () => {
    if (document.readyState == 'complete')
    {
        doLoad();
    }
}