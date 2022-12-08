import * as React from "react";
import { StyleSheet, View, Text, Platform, Alert } from "react-native";
import { useRecoilState } from "recoil";
import { IconButton } from "../components/IconButton";
import { editingModeState } from "../Store";
import { usePerformCrop } from "../customHooks/usePerformCrop";

export function Crop() {
  const [, setEditingMode] = useRecoilState(editingModeState);

  const onPerformCrop = usePerformCrop();

  return (
    <View style={styles.container}>
      <IconButton
        iconID="close"
        text="취소"
        onPress={() => setEditingMode("operation-select")}
      />
      <Text style={styles.prompt}>잘라낼 영역을 선택하세요</Text>
      <IconButton iconID="check" text="적용" onPress={onPerformCrop} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "2%",
  },
  prompt: {
    color: "#fff",
    fontSize: 21,
    textAlign: "center",
  },
});
