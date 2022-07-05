import React from 'react';
import {View, Button, Alert} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const options = {
  title: 'Select Image',
  type: 'library',
  options: {
    maxHeight: 200,
    maxWidth: 200,
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: false,
  },
};

const App = () => {
  const openGallery = async () => {
    const images = await launchImageLibrary(options);
    console.log(images.assets[0].type);
    if (!images.assets[0].type.match('image/png')) {
      if (!images.assets[0].type.match('image/jpeg')) {
        if (!images.assets[0].type.match('image/jpg')) {
          let uploadfail = new createTwoButtonAlert(
            'Upload Failed!',
            'The Image format is not in png/jpg/jpeg format!',
          );
          uploadfail;
          return false;
        }
      }
    }

    const formdata = new FormData();
    formdata.append('file', {
      uri: images.assets[0].uri,
      type: images.assets[0].type,
      name: images.assets[0].fileName,
    });

    let res = await fetch('http://10.0.2.2:8000/api/fileupload', {
      method: 'post',
      body: formdata,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    let buttonalert = new createTwoButtonAlert(
      'Success',
      'Your Payment receipt has been sent for verification',
    );
    buttonalert;
    let responseJson = await res.json();
    console.log(responseJson, 'responseJson');
  };

  const createTwoButtonAlert = (message1, message2) =>
    Alert.alert(message1, message2, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{flex: 20, alignItems: 'center', justifyContent: 'center'}}>
      <Button title="Uploads" onPress={openGallery} />
    </View>
  );
};

export default App;
