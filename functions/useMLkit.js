import ImagePicker from 'react-native-image-crop-picker';
import MlkitOcr from 'react-native-mlkit-ocr';

const useMLkit = () => {
  const recognizeTextFromImage = async (path, setTextArray) => {
    const recognizedData = await MlkitOcr.detectFromFile(path);
    let recognizedTextArray = new Array();
    recognizedData.map(block => {
      recognizedTextArray.push(block.text);
    });
    setTextArray(recognizedTextArray);
  };

  const recognizeFromPicker = async setTextArray => {
    const image = await ImagePicker.openPicker({});
    await recognizeTextFromImage(image.path, setTextArray);
  };

  const recognizeFromCamera = async setTextArray => {
    const image = await ImagePicker.openCamera({});
    await recognizeTextFromImage(image.path, setTextArray);
  };

  return {recognizeFromCamera, recognizeFromPicker};
};

export default useMLkit;
