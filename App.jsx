import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image,
  Pressable,
} from "react-native";

import { Camera } from "expo-camera";
import { useEffect, useState, useRef } from "react";

import { FontAwesome } from "@expo/vector-icons";

export default function App() {
  const camRef = useRef(null);

  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>Acesso Negado</Text>;
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={styles.camera} type={type} ref={camRef}>
        <View style={styles.contentButtons}>
          <TouchableOpacity
            style={styles.buttonFlip}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <FontAwesome name="exchange" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonCamera} onPress={takePicture}>
            <FontAwesome name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
      {capturedPhoto && (
        <Modal animationType="slide" transparent={true} visible={open}>
          <Pressable onPress={() => setOpen(false)} style={styles.contentModal}>
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => setOpen(false)}
            >
              <FontAwesome name="close" size={24} color="#Ff0600" />
            </TouchableOpacity>
            <Image style={styles.imgPhoto} source={{ uri: capturedPhoto }} />
          </Pressable>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  contentButtons: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  buttonFlip: {
    position: "absolute",
    bottom: 50,
    left: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#505050",
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  buttonCamera: {
    position: "absolute",
    bottom: 50,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#505050",
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  contentModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    margin: 20,
  },
  closeModal: {
    position: "absolute",
    top: 10,
    right: 2,
    margin: 10,
  },
  imgPhoto: {
    width: "100%",
    height: 400,
  },
});
