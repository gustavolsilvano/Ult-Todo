import ImageEditor from '@react-native-community/image-editor';
import ImagePicker from 'react-native-image-picker';

const cropSelectedImage = async uri => {
  const cropData = {
    offset: { x: 0, y: 0 },
    size: { width: 1500, height: 1500 }
  };
  return await ImageEditor.cropImage(uri, cropData);
};

// Image picker
export default (setPhoto, setImageToUpload) => {
  if (!setPhoto) return;
  ImagePicker.showImagePicker(
    { noData: true, mediaType: 'photo' },
    async response => {
      console.log('aqui');
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        throw TypeError('Algo deu errado. Escolha um arquivo de foto.');
      } else {
        response.uri = await cropSelectedImage(response.uri);
        if (setImageToUpload) setImageToUpload(response);
        setPhoto(response.uri);
        return;
      }
    }
  );
};
