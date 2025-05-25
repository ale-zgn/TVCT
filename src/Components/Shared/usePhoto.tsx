import { useState } from 'react';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';

const useImagePicker = ({
  multiple = false
}: {
  multiple?: boolean;
} = {}) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [images, setImages] = useState<ImagePicker.ImagePickerResult[]>([]);

  const chooseImg = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3]
    }).then((result) => {
      if (!result.canceled) {
        if (!multiple) return setImages([result])
        else return setImages([...images, result]);
      }
    });
  };

  const takePhoto = () => {
    ImagePicker.requestCameraPermissionsAsync().then(({ status }) => {
      if (status === 'granted') {
        ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3]
        }).then((result) => {
          if (!result.canceled) {
            if (!multiple) return setImages([result])
            else return setImages([...images, result]);
          }
        });
      }
    });
  };

  const showImagePickerActionSheet = () => {
    showActionSheetWithOptions(
      {
        options: ['Choose from library', 'Take a picture', 'Cancel'],
        cancelButtonIndex: 2,
        title: 'Add a picture'
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          chooseImg();
        } else if (buttonIndex === 1) {
          takePhoto();
        }
      }
    );
  };

  return { images, showImagePickerActionSheet, setImages };
};

export default useImagePicker;
