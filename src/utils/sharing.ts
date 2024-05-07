const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject();
    };

    img.src = url;
  });
};

export const canvasToFile = (
  canvas: HTMLCanvasElement,
  fileName = 'share.jpg'
): Promise<File> => {
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(new File([blob], fileName, { type: 'image/jpeg' }));
    }, 'image/jpeg');
  });
};

export const compositeImage = async (
  background: string,
  midground: string,
  foreground: string
): Promise<File> => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 1080;
  canvas.height = 1920;

  const image1 = await loadImage(background);
  const image2 = await loadImage(midground);
  const image3 = await loadImage(foreground);

  context.drawImage(image1, 0, 0);
  context.drawImage(image2, 0, 0);
  context.drawImage(image3, 0, 0);

  return canvasToFile(canvas);
};

const download = (file: File) => {
  const element = document.createElement('a');
  element.setAttribute('href', URL.createObjectURL(file));
  element.setAttribute('download', file.name);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const shareImage = async (image: File, url?: string): Promise<void> => {
  try {
    await navigator.share({ files: [image], url });
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.warn('Share API not supported');
      download(image);
    }
  }
};

export const shareText = async (text: string): Promise<void> => {
  try {
    await navigator.share({ text });
  } catch (err) {
    console.error(err);
  }
};
