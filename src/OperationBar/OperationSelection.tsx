import * as React from "react";
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Icon } from "../components/Icon";
import { IconButton } from "../components/IconButton";
import { editingModeState, EditingModes } from "../Store";
import { useRecoilState } from "recoil";
import { useContext } from "react";
import {
  AdjustmentOperations,
  EditingOperations,
  EditorContext,
  TransformOperations,
} from "..";
import { useMemo } from "react";

interface Operation<T> {
  title: string;
  iconID: React.ComponentProps<typeof Icon>["iconID"];
  operationID: T;
}

interface Operations {
  transform: Operation<TransformOperations>[];
  adjust: Operation<AdjustmentOperations>[];
}

const operations: Operations = {
  transform: [
    {
      title: "자르기",
      iconID: "crop",
      operationID: "crop",
    },
    {
      title: "회전",
      iconID: "rotate-90-degrees-ccw",
      operationID: "rotate",
    },
  ],
  adjust: [
    {
      title: "Blur",
      iconID: "blur-on",
      operationID: "blur",
    },
  ],
};

export function OperationSelection() {
  //
  const { allowedTransformOperations, allowedAdjustmentOperations } =
    useContext(EditorContext);

  const isTransformOnly =
    allowedTransformOperations && !allowedAdjustmentOperations;
  const isAdjustmentOnly =
    allowedAdjustmentOperations && !allowedTransformOperations;

  const [selectedOperationGroup, setSelectedOperationGroup] = React.useState<
    "transform" | "adjust"
  >(isAdjustmentOnly ? "adjust" : "transform");

  const [, setEditingMode] = useRecoilState(editingModeState);

  const filteredOperations = useMemo(() => {
    // If neither are specified then allow the full range of operations
    if (!allowedTransformOperations && !allowedAdjustmentOperations) {
      return operations;
    }
    const filteredTransforms = allowedTransformOperations
      ? operations.transform.filter((op) =>
          allowedTransformOperations.includes(op.operationID)
        )
      : operations.transform;
    const filteredAdjustments = allowedAdjustmentOperations
      ? operations.adjust.filter((op) =>
          allowedAdjustmentOperations.includes(op.operationID)
        )
      : operations.adjust;
    if (isTransformOnly) {
      return { transform: filteredTransforms, adjust: [] };
    }
    if (isAdjustmentOnly) {
      return { adjust: filteredAdjustments, transform: [] };
    }
    return { transform: filteredTransforms, adjust: filteredAdjustments };
  }, [
    allowedTransformOperations,
    allowedAdjustmentOperations,
    isTransformOnly,
    isAdjustmentOnly,
  ]);

  return (
    <>
      <ScrollView style={styles.opRow} horizontal>
        {
          //@ts-ignore
          filteredOperations[selectedOperationGroup].map(
            (item: Operation<EditingOperations>, index: number) => (
              <View style={styles.opContainer} key={item.title}>
                <IconButton
                  text={item.title}
                  iconID={item.iconID}
                  onPress={() => setEditingMode(item.operationID)}
                />
              </View>
            )
          )
        }
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  opRow: {
    height: 80,
    width: "100%",
    backgroundColor: "#333",
  },
  opContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  modeRow: {
    height: 80,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  modeButton: {
    height: 80,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
});
