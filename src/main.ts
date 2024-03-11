import '~/main.css';
import wasmUrl from '@imagemagick/magick-wasm/magick.wasm?url';
import { initializeImageMagick, ImageMagick, MagickFormat } from '@imagemagick/magick-wasm';

const wasmResponse = await fetch(wasmUrl);
const wasmBuffer = await wasmResponse.arrayBuffer();
const wasmUint8Array = new Uint8Array(wasmBuffer);
await initializeImageMagick(wasmUint8Array);

const inputFile: HTMLInputElement = document.querySelector('#input-file');
const convertButton: HTMLButtonElement = document.querySelector('#convert-button');
const progress: HTMLProgressElement = document.querySelector('#progress');
const progressValue: HTMLParagraphElement = document.querySelector('#progress-value');

const convert = async (file: File) => {
	progressValue.textContent = '0%';
	progress.value = 0;
	const buffer = await file.arrayBuffer();
	const imageUint8Array = new Uint8Array(buffer);

	ImageMagick.read(imageUint8Array, image => {
		let prevProgress = 0;
		image.onProgress = event => {
			const currentProgress = +event.progress.multiply(1000000).toFixed(0);
			if (currentProgress > prevProgress) {
				progress.value = currentProgress;
				progressValue.textContent = `${currentProgress}%`;
				prevProgress = currentProgress;
				console.log(currentProgress);
			}
		};

		image.write(MagickFormat.Png, data => {
			const blob = new Blob([data], { type: 'image/png' });
			const downloadLink = document.createElement('a');
			downloadLink.href = URL.createObjectURL(blob);
			downloadLink.download = 'output.png';
			downloadLink.textContent = 'Download output.png';
			document.body.appendChild(downloadLink);
		});
	});
};

convertButton.addEventListener('click', () => {
	convert(inputFile.files[0]);
});
