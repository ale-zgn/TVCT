import moment from "moment";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import MaintButton from "src/Components/Shared/MaintButton";
import { useLazyGetAddressPredictionsQuery } from "src/Services/API";
import { useTranslation } from "../../Services/hooks/useTranslation";

export default function CreateCenterPage() {
  const { translate } = useTranslation();
  const [getAddress] = useLazyGetAddressPredictionsQuery();
  const [addressSuggestions, setAddressSuggestions] = useState<
    { description: string; place_id: string }[]
  >([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState<"from" | "to" | null>(null);
  const [fromTime, setFromTime] = useState<Date | null>(null);
  const [toTime, setToTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const showTimePicker = (type: "from" | "to") => {
    setPickerType(type);
    setPickerVisible(true);
  };

  const handleConfirm = (date: Date) => {
    if (pickerType === "from") {
      setFromTime(date);
      if (toTime) calculateDuration(date, toTime);
    } else if (pickerType === "to") {
      setToTime(date);
      if (fromTime) calculateDuration(fromTime, date);
    }
    setPickerVisible(false);
  };

  const calculateDuration = (from: Date, to: Date) => {
    const start = moment(from);
    const end = moment(to);

    if (end.isBefore(start)) {
      setDuration(translate("Invalid time range"));
      return;
    }

    const diff = moment.duration(end.diff(start));
    const hours = Math.floor(diff.asHours());
    const minutes = diff.minutes();

    const formatted = `${hours}h ${minutes}min`;
    setDuration(formatted);
  };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: "white" }}
      showsVerticalScrollIndicator={false}
      keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* City input */}
        <View style={styles.inputsContainer}>
          <Text style={styles.label}>{translate("City")}</Text>
          <TextInput
            onChangeText={(value) => {
              setSelectedAddress(value);
              if (value.length > 2) {
                getAddress(value).then((res) => {
                  const predictions = res?.data || [];
                  const mapped = predictions.map((item: any) => ({
                    description: item.description,
                    place_id: item.place_id,
                  }));
                  setAddressSuggestions(mapped);
                });
              } else {
                setAddressSuggestions([]);
              }
            }}
            value={selectedAddress}
            style={styles.textInput}
          />
        </View>

        {/* Address Suggestions */}
        {addressSuggestions.length > 0 && (
          <FlatList
            data={addressSuggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  setValue("city", item.place_id);
                  setSelectedAddress(item.description);
                  setAddressSuggestions([]);
                }}
              >
                <Text style={{ fontSize: wp("4%") }}>{item.description}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
            contentContainerStyle={{ width: wp("90%") }}
          />
        )}

        {/* From Time Picker */}
        <View style={styles.inputsContainer}>
          <Text style={styles.label}>{translate("From Time")}</Text>
          <TouchableOpacity
            onPress={() => showTimePicker("from")}
            style={styles.timePickerBox}
          >
            <Text style={styles.timeText}>
              {fromTime
                ? moment(fromTime).locale("en").format("HH:mm")
                : translate("Select time")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* To Time Picker */}
        <View style={styles.inputsContainer}>
          <Text style={styles.label}>{translate("To Time")}</Text>
          <TouchableOpacity
            onPress={() => showTimePicker("to")}
            style={styles.timePickerBox}
          >
            <Text style={styles.timeText}>
              {toTime
                ? moment(toTime).locale("en").format("HH:mm")
                : translate("Select time")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Duration display */}
        {fromTime && toTime && (
          <View style={styles.inputsContainer}>
            <Text style={styles.label}>{translate("Duration")}</Text>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        )}

        {/* Time Picker Modal */}
        <DateTimePickerModal
          isVisible={isPickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={() => setPickerVisible(false)}
        />

        <MaintButton
          action={() => {}}
          title={translate("Continue")}
          backgroundColor="black"
          textColor="white"
          style={{ marginBottom: hp("10%") }}
          bottom
        />
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp("100%"),
    backgroundColor: "white",
    paddingTop: hp("3%"),
  },
  inputsContainer: {
    justifyContent: "space-between",
    flexDirection: "column",
    width: wp("90%"),
    alignSelf: "center",
    marginBottom: hp("2%"),
  },
  label: {
    fontFamily: "regular",
    fontSize: wp("5%"),
    color: "#666666",
    marginBottom: hp("1%"),
    textAlign: "left",
  },
  textInput: {
    height: hp("7.25%"),
    width: "100%",
    backgroundColor: "#F2F2F2",
    paddingHorizontal: wp("3%"),
    borderRadius: 8,
  },
  timePickerBox: {
    height: hp("6.5%"),
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: wp("3%"),
  },
  timeText: {
    fontSize: wp("4%"),
    color: "#000",
  },
  durationText: {
    fontSize: wp("4.5%"),
    color: "#000",
    fontWeight: "bold",
  },
  suggestionItem: {
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("3%"),
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    backgroundColor: "#F2F2F2",
    width: "100%",
  },
  suggestionsList: {
    backgroundColor: "#fff",
    maxHeight: hp("30%"),
    alignSelf: "center",
    borderRadius: 4,
    elevation: 3,
  },
});
