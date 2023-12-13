
const fileInput = document.querySelector('#file-input');
const textOutput = document.querySelector('#text-output');
const resultDiv = document.querySelector('#result');
const qualityInput = document.querySelector('#quality');
const sizeInput = document.querySelector('#size');

const draw = () => {
    const file = fileInput.files[0];
    if(!file){
        return;
    }
    const maxSimularity = 1000 - (qualityInput.value * 10);
    //convert to canvas image
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const aspect = img.width / img.height;
            const width = sizeInput.value;
            const height = width / aspect;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            //get image data
            const imageData = ctx.getImageData(0, 0, width, height);
            let result = '';
            for(let y=0; y<imageData.height; y++) {
                let prevRgb = [0, 0, 0];
                let prevLength = 0;
                for(let x=0; x<imageData.width; x++) {
                    const index = (y * imageData.width + x) * 4;
                    const r = imageData.data[index + 0];
                    const g = imageData.data[index + 1];
                    const b = imageData.data[index + 2];
                    const rgb = [r, g, b];
                    const simularity = Math.abs(r - prevRgb[0]) + Math.abs(g - prevRgb[1]) + Math.abs(b - prevRgb[2]);
                    if(maxSimularity >= simularity) {
                        prevLength++;
                        continue;
                    }
                    else{
                        let string = '';
                        for(let i=0; i<prevLength; i++) {
                            string += '■';
                        }
                        const rgbhex = '#'  + prevRgb[0].toString(16).padStart(2, '0')
                                            + prevRgb[1].toString(16).padStart(2, '0')
                                            + prevRgb[2].toString(16).padStart(2, '0');
                        result += `<span style="color:${rgbhex}">${string}</span>`
                        prevRgb = rgb;
                        prevLength = 1;
                    }
                }
                let string = '';
                for(let i=0; i<prevLength; i++) {
                    string += '■';
                }
                const rgbhex = '#'  + prevRgb[0].toString(16).padStart(2, '0')
                    + prevRgb[1].toString(16).padStart(2, '0')
                    + prevRgb[2].toString(16).padStart(2, '0');
                result += `<span style="color:${rgbhex}">${string}</span>`
                result += '<br>';
            }
            result = `<div style="font-size: 4px; line-height: 4px; letter-spacing: 0px">${result}</div>`
            result += `<div style="margin-top: 5px; margin-bottom: 5px">${result.length} characters</div>`
            resultDiv.innerHTML = result;
            textOutput.value = result;
            textOutput.disabled = false;
            canvas.remove();
            img.remove();
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
}

qualityInput.value = 97;
sizeInput.value = 100;
fileInput.addEventListener('change', draw)
qualityInput.addEventListener('change', draw)
sizeInput.addEventListener('change', draw)