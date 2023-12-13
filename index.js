
const fileInput = document.querySelector('#file-input');

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    //convert to canvas image
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const aspect = img.width / img.height;
            const height = 100 / aspect;
            canvas.width = 100;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, 100, height);

            //get image data
            const imageData = ctx.getImageData(0, 0, 100, height);
            let result = '';
            for(let y=0; y<imageData.height; y++) {
                let prevRgbHex = '';
                let prevLength = 0;
                for(let x=0; x<imageData.width; x++) {
                    const index = (y * imageData.width + x) * 4;
                    const r = imageData.data[index + 0];
                    const g = imageData.data[index + 1];
                    const b = imageData.data[index + 2];
                    const a = imageData.data[index + 3];
                    const rgbhex = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
                    if(prevRgbHex === rgbhex) {
                        prevLength++;
                        continue;
                    }
                    else{
                        let string = '';
                        for(let i=0; i<prevLength; i++) {
                            string += '■';
                        }
                        result += `<span style="color:${prevRgbHex}">${string}</span>`
                        prevRgbHex = rgbhex;
                        prevLength = 1;
                    }
                }
                let string = '';
                for(let i=0; i<prevLength; i++) {
                    string += '■';
                }
                result += `<span style="color:${prevRgbHex}">${string}</span>`
                result += '<br>';
            }
            result = `<div style="font-size: 4px; line-height: 4px; letter-spacing: 0px">${result}</div>`
            document.querySelector('#result').innerHTML = result;
            const textOutput = document.querySelector('#text-output');
            textOutput.value = result;
            textOutput.disabled = false;
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
})