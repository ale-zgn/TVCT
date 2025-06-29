import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
	Image,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MapView from "react-native-maps";
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { ArrowDownIcon, PlusIcon } from "../../../assets/svgs/Svg";
import Input from "../../Components/Shared/Input";
import MaintButton from "../../Components/Shared/MaintButton";
import Picker from "../../Components/Shared/Picker";
import useOcrImagePicker from "../../Services/hooks/useOcr";
import { useTranslation } from "../../Services/hooks/useTranslation";


export default function CreateVisitPage() {
  const { translate } = useTranslation();
  const mapRef = useRef<MapView>(null);

  const [scanVisible, setScanVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { firstImage, secondImage, chooseImageSource, processImages } =
    useOcrImagePicker();
  const [pickerValue, setPickerValue] = useState();
  const applyOcrResult = (dataFromApi) => {
    Object.entries(dataFromApi).forEach(([name, value]) => {
      if (value !== undefined && value !== null) {
        setValue(name, value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: 35.8256,
          longitude: 10.6084,
          latitudeDelta: 0.2044,
          longitudeDelta: 0.0842,
        },
        900
      );
    }
  }, [mapRef]);
  const conditionalFields = {
    TU: [
      { name: "serie", label: "Série" },
      { name: "conf_serie", label: "Confirmer Série" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    RS: [
      { name: "rs", label: "RS" },
      { name: "conf_rs", label: "Confirmer RS" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    MOTO: [
      { name: "moto", label: "MOTO" },
      { name: "conf_moto", label: "Confirmer MOTO" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    TRAC: [
      { name: "trac", label: "TRAC" },
      { name: "conf_trac", label: "Confirmer TRAC" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    PAT: [
      { name: "pat", label: "PAT م أ ف" },
      { name: "conf_pat", label: "Confirmer PAT م أ ف" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    CMD: [
      { name: "cmd", label: "CMD ر ب د" },
      { name: "conf_cmd", label: "Confirmer CMD ر ب د" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    CD: [
      { name: "cd", label: "CD س د" },
      { name: "conf_cd", label: "Confirmer CD س د" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    MD: [
      { name: "md", label: "MD ب د" },
      { name: "conf_md", label: "Confirmer MD ب د" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    MC: [
      { name: "mc", label: "MC ث ق" },
      { name: "conf_mc", label: "Confirmer MC ث ق" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    CC: [
      { name: "cc", label: "CC س ق" },
      { name: "conf_cc", label: "Confirmer CC س ق" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    REM: [
      { name: "rem", label: "REM ع م" },
      { name: "conf_rem", label: "Confirmer REM ع م" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    AA: [
      { name: "aa", label: "AA أ ف" },
      { name: "conf_aa", label: "Confirmer AA أ ف" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    ES: [
      { name: "es", label: "ES م خ" },
      { name: "conf_es", label: "Confirmer ES م خ" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    PE: [
      { name: "pe", label: "PE" },
      { name: "conf_pe", label: "Confirmer PE" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    IT: [
      { name: "it", label: "IT ت م" },
      { name: "conf_it", label: "Confirmer IT ت م" },
      { name: "chassis", label: "5 derniers caractères du N° de châssis:" },
    ],
    ETR: [
      { name: "chassis", label: "N° Châssis" },
      { name: "conf_chassis", label: "Confirmer N° Châssis" },
    ], // Add more if needed...
  };

  const registrationTypes = [
    { label: "Série Normale (TU)", value: "TU" },
    { label: "Régime Suspensif (RS)", value: "RS" },
    { label: "Moto (MOTO)", value: "MOTO" },
    { label: "Tracteur (TRAC)", value: "TRAC" },
    { label: "Personnel Administratif et Technique (PAT)", value: "PAT" },
    { label: "Chef de Mission Diplomatique (CMD)", value: "CMD" },
    { label: "Corps Diplomatique (CD)", value: "CD" },
    { label: "Mission Diplomatique (MD)", value: "MD" },
    { label: "Mission Consulaire (MC)", value: "MC" },
    { label: "Corps Consulaire (CC)", value: "CC" },
    { label: "Remorque (REM)", value: "REM" },
    { label: "Appareil Agricole (AA)", value: "AA" },
    { label: "Engin Spécial (ES)", value: "ES" },
    { label: "Propriété de l'État (PE)", value: "PE" },
    { label: "Immatriculation Temporaire (IT)", value: "IT" },
    { label: "Immatriculation Étrangère ou Douanière", value: "ETR" },
  ];

  const handleScan = async () => {
    try {
      const ocrResult = await processImages();
      applyOcrResult(ocrResult.data);
    } catch (e) {
      console.error(e);
      alert("Erreur lors du scan OCR.");
    }
  };

  const onSubmit = async (data: any) => {
    console.log("Car info submitted:", data);
    // handle API call here
  };
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time12h = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
      const time24h = `${hour.toString().padStart(2, "0")}:00`;
      slots.push({
        display: time12h,
        value: time24h,
        id: hour,
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setSelectedTimeSlot(null); // Reset time slot when date changes
    }
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handleConfirm = () => {
    if (selectedTimeSlot) {
      const appointment = {
        date: selectedDate.toDateString(),
        time: selectedTimeSlot.display,
        datetime: new Date(
          selectedDate.toDateString() + " " + selectedTimeSlot.value
        ),
      };
      console.log("Selected appointment:", appointment);
      // Handle your booking logic here
      setPaymentVisible(false);
    }
  };

  const fieldSections = [
    {
      sectionTitle: "Informations du véhicule",
      fields: [
        { name: "matricule", label: "Numéro d'immatriculation" },
        { name: "genre", label: "Genre" },
        { name: "type", label: "Type de véhicule" },
        { name: "construteur", label: "Constructeur" },
        { name: "serie", label: "Numéro de série du type" },
        { name: "typemoteur", label: "Type du moteur" },
        { name: "dpmc", label: "Date de première mise en circulation (DPMC)" },
      ],
    },
    {
      sectionTitle: "Caractéristiques",
      fields: [
        { name: "place", label: "Nombre de places" },
        { name: "porte", label: "Nombre de portes" },
        { name: "inscrit", label: "Date d'inscription" },
      ],
    },
    {
      sectionTitle: "Propriétaire",
      fields: [
        { name: "nom", label: "Nom et prénom" },
        { name: "adresse", label: "Adresse" },
        { name: "cin", label: "CIN" },
      ],
    },
    {
      sectionTitle: "Commercial",
      fields: [{ name: "commercial", label: "Type commercial" }],
    },
  ];

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.sectionContainer}>
          <Picker
            title="type de la série d'immatriculation"
            onValueChange={(value) => setPickerValue(value)}
            items={registrationTypes}
            placeholder={"Filter by"}
            // @ts-ignore
            Icon={() => {
              return <ArrowDownIcon color="#000" />;
            }}
          />

          {pickerValue && conditionalFields[pickerValue] && (
            <View>
              <Text style={styles.sectionTitle}>
                {translate("Informations spécifiques")}
              </Text>

              {conditionalFields[pickerValue].map((field) => {
                const isPrefixField = ["chassis"].includes(field.name);
                const prefixType = [
                  "TU",
                  "PE",
                  "PAT",
                  "CMD",
                  "CD",
                  "MD",
                  "MC",
                  "CC",
                ].includes(pickerValue);

                if (prefixType && !isPrefixField) {
                  return (
                    <View>
                      <Text
                        style={[
                          styles.prefixText,
                          { marginBottom: hp("1%"), color: "grey" },
                        ]}
                      >
                        {field.label}
                      </Text>

                      <View style={styles.inputsContainer} key={field.name}>
                        <Input
                          name={field.name}
                          placeholder="XXXX"
                          control={control}
                          rules={{
                            required: `${translate("This field is required")}`,
                          }}
                          errors={errors}
                          containerStyle={{ width: wp("30%") }}
                        />
                        <View style={styles.prefixBox}>
                          <Text style={styles.prefixText}>{pickerValue}</Text>
                        </View>
                        <Input
                          name={field.name}
                          placeholder="XXXX"
                          control={control}
                          rules={{
                            required: `${translate("This field is required")}`,
                          }}
                          errors={errors}
                          containerStyle={{ width: wp("30%") }}
                        />
                      </View>
                    </View>
                  );
                } else {
                  return (
                    <View style={styles.inputsContainer} key={field.name}>
                      <Input
                        name={field.name}
                        title={translate(field.label)}
                        placeholder={translate(field.label)}
                        control={control}
                        rules={{
                          required: `${translate("This field is required")}`,
                        }}
                        errors={errors}
                        containerStyle={{ width: wp("90%") }}
                      />
                    </View>
                  );
                }
              })}

              <View
                style={{
                  height: 1,
                  width: wp("90%"),
                  backgroundColor: "grey",
                  marginBottom: hp("2%"),
                  alignSelf: "center",
                }}
              />
            </View>
          )}

          {scanVisible && (
            <>
              <Text style={styles.sectionTitle}>
                {translate("Add 2 images")}
              </Text>

              <View
                style={[
                  styles.inputsContainer,
                  { justifyContent: "flex-start", gap: 10 },
                ]}
              >
                <Pressable
                  onPress={() => chooseImageSource("first")}
                  style={{
                    height: hp("20%"),
                    width: hp("20%"),
                    borderColor: "black",
                    borderWidth: 1,
                    borderStyle: "dashed",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {firstImage ? (
                    <Image
                      source={{ uri: firstImage.uri }}
                      style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: "stretch",
                      }}
                    />
                  ) : (
                    <PlusIcon />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => chooseImageSource("second")}
                  style={{
                    height: hp("20%"),
                    width: hp("20%"),
                    borderColor: "black",
                    borderWidth: 1,
                    borderStyle: "dashed",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {secondImage ? (
                    <Image
                      source={{ uri: secondImage.uri }}
                      style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: "stretch",
                      }}
                    />
                  ) : (
                    <PlusIcon />
                  )}
                </Pressable>
              </View>
            </>
          )}
        </View>

        {pickerValue && (
          <>
            <MaintButton
              action={() => {
                scanVisible ? handleScan() : setScanVisible(true);
              }}
              title={translate(scanVisible ? "Scan" : "Quick scan")}
              backgroundColor="grey"
              textColor="white"
            />
            <View
              style={{
                height: 1,
                width: wp("90%"),
                backgroundColor: "grey",
                marginBottom: hp("2%"),
                alignSelf: "center",
              }}
            ></View>

            {fieldSections.map((section) => (
              <View key={section.sectionTitle} style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  {translate(section.sectionTitle)}
                </Text>

                {section.fields.map((field) => (
                  <View style={styles.inputsContainer} key={field.name}>
                    <Input
                      name={field.name}
                      title={translate(field.label)}
                      placeholder={translate(field.label)}
                      control={control}
                      rules={{
                        required: `${translate("This field is required")}`,
                      }}
                      errors={errors}
                      containerStyle={{ width: wp("90%") }}
                      width={90}
                    />
                  </View>
                ))}
              </View>
            ))}
            {/*   <View style={styles.sectionContainer}>
              <Pressable onPress={() => setModalVisible(true)}>
                <Text
                  style={{
                    fontSize: wp("4%"),
                    width: "100%",
                    color: "#121212",	  
                    marginBottom: hp("2%"),
                    textDecorationLine: "underline",
                  }}
                >
                  {translate("Pick location")}
                </Text>
              </Pressable>
            </View> */}

            <MaintButton
              action={() => setModalVisible(true)}
              title={translate("Proceed")}
              backgroundColor="black"
              textColor="white"
            />
          </>
        )}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <MapView
              style={styles.map}
              ref={mapRef}
              initialRegion={{
                latitude: 35.8256,
                longitude: 10.6084,
                latitudeDelta: 0.2044,
                longitudeDelta: 0.0842,
              }}
              showsUserLocation={true}
            ></MapView>
            <Pressable
              onPress={() => {
                setModalVisible(false);
                setPaymentVisible(true);
              }}
              style={{
                position: "absolute",
                height: wp("8%"),
                width: wp("8%"),
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                top: hp("5%"),
                right: wp("6%"),
                borderRadius: 50,
              }}
            >
              <Text>X</Text>
            </Pressable>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={paymentVisible}
          onRequestClose={() => setPaymentVisible(false)}
        >
          <Pressable
            onPress={() => setPaymentVisible(false)}
            style={styles.modalView}
          >
            <View
              onStartShouldSetResponder={() => true}
              style={{
                height: hp("60%"),
                backgroundColor: "white",
                width: "100%",
                position: "absolute",
                bottom: 0,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
				paddingBottom:0,
                zIndex: 10,
              }}
            >
              {/* Header */}
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 20,
                  color: "#333",
                }}
              >
                Select Date & Time
              </Text>

              {/* Date Selection */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 10,
                    color: "#333",
                  }}
                >
                  Select Date
                </Text>
                <Pressable
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: 15,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={{ fontSize: 16, color: "#333" }}>
                    {selectedDate.toDateString()}
                  </Text>
                </Pressable>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}

              {/* Time Slots */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 10,
                    color: "#333",
                  }}
                >
                  Available Time Slots
                </Text>
                <ScrollView
                  style={{ maxHeight: hp("27%") }}
                  showsVerticalScrollIndicator={false}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    {timeSlots.map((slot) => (
                      <Pressable
                        key={slot.id}
                        style={[
                          {
                            width: "48%",
                            backgroundColor:
                              selectedTimeSlot?.id === slot.id
                                ? "#85553A" : "#fff",
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 10,
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor:
                              selectedTimeSlot?.id === slot.id
                                ? "#85553A"
                                : "#e0e0e0",
                          },
                        ]}
                        onPress={() => handleTimeSlotSelect(slot)}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color:
                              selectedTimeSlot?.id === slot.id
                                ? "white"
                                : "#333",
                            fontWeight:
                              selectedTimeSlot?.id === slot.id
                                ? "600"
                                : "normal",
                          }}
                        >
                          {slot.display}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Action Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Pressable
                  style={{
                    flex: 1,
                    backgroundColor: "#f0f0f0",
                    padding: 15,
                    borderRadius: 10,
                    marginRight: 10,
                    alignItems: "center",
                  }}
                  onPress={() => setPaymentVisible(false)}
                >
                  <Text style={{ fontSize: 16, color: "#666" }}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={{
                    flex: 1,
                    backgroundColor: selectedTimeSlot ? "black" : "#ccc",
                    padding: 15,
                    borderRadius: 10,
                    marginLeft: 10,
                    alignItems: "center",
                  }}
                  onPress={handleConfirm}
                  disabled={!selectedTimeSlot}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: selectedTimeSlot ? "white" : "#888",
                      fontWeight: "600",
                    }}
                  >
                    Confirm
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp("100%"),
    backgroundColor: "#fcfcfc",
    paddingBottom: hp("10%"),
  },
  title: {
    fontSize: wp("10%"),
    color: "#121212",
    fontFamily: "regular",
    marginVertical: hp("2%"),
    paddingHorizontal: wp("5%"),
    textAlign: "left",
  },
  subtitle: {
    fontSize: wp("5.75"),
    color: "black",
    marginVertical: hp("2%"),
    marginTop: hp("3%"),
    paddingHorizontal: wp("5%"),
    fontFamily: "medium",
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: wp("90%"),
    height: hp("7.25%"),
    backgroundColor: "#F2F2F2",
    paddingHorizontal: wp("3%"),
  },
  inputLabel: {
    fontFamily: "regular",
    fontSize: wp("5.5%"),
    color: "#121212",
    marginLeft: wp("5%"),
    marginBottom: hp("2%"),
    textAlign: "left",
  },
  input: {
    fontSize: wp("4%"),
    color: "#121212",
    width: wp("74%"),
    height: hp("8%"),
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: wp("90%"),
    marginLeft: wp("5%"),
    marginVertical: hp("4%"),
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  separatorText: {
    fontSize: wp("5%"),
    fontFamily: "regular",
    color: "#121212",
    marginHorizontal: wp("5%"),
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: hp("8%"),
    width: wp("90%"),
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: "#F2F2F2",
    flexDirection: "row",
  },
  buttonText: {
    color: "black",
    fontSize: wp("6%"),
    fontFamily: "medium",
    marginHorizontal: wp("5%"),
  },
  inputsContainer: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
    width: wp("90%"),
    alignSelf: "center",
    marginBottom: hp("2.5%"),
  },
  inputField: {
    width: wp("90%"),
    height: hp("7%"),
    backgroundColor: "#F2F2F2",
    alignSelf: "center",
    paddingHorizontal: wp("4%"),
    borderRadius: 5,
    fontSize: wp("4%"),
    marginBottom: hp("1.5%"),
  },
  errorText: {
    color: "red",
    fontSize: wp("3.5%"),
    marginLeft: wp("5%"),
    marginBottom: hp("1%"),
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: "regular",
    fontSize: wp("6%"),
    width: "100%",
    color: "#121212",
    marginBottom: hp("2%"),
  },

  compositeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  prefixBox: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: wp("3%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    height: hp("4%"),
    alignSelf: "center",
  },
  prefixText: {
    fontSize: wp("4.5%"),
    fontFamily: "medium",
    color: "#000",
  },
  compositeInput: {
    flex: 1,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  modalView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
