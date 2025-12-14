import { Modal, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from "react-native";
import { CardField } from "@stripe/stripe-react-native";
import UText from "../../text/uText";
import UTextButton from "../../buttons/uTextButton";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";


const PaymentModal = ({ visible, onClose, onPay }) => {
    const insets = useSafeAreaInsets();

    const { height: SCREEN_HEIGHT } = Dimensions.get("window");

    console.log("THIS IS SCREEN HEIGHT", SCREEN_HEIGHT);
    
    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={{
                    // height: SCREEN_HEIGHT, width: "100%",
                    flex: 1,
                    justifyContent: "flex-end",
                    backgroundColor: "rgba(0,0,0,0.5)"
                }}>
                    {/* <View style={{
                    // backgroundColor: "white",
                    backgroundColor:'red',
                    padding: 20,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }}> */}
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <SafeAreaView
                            edges={["bottom"]}
                            style={{
                                backgroundColor: "white",
                                paddingHorizontal: 20,
                                paddingTop: 20,
                                // paddingBottom: 0,      // ⛔ remove bottom space
                                paddingBottom: insets.bottom,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            }}
                        >
                            <UText variant="heading-h2" mb={10}>Enter Card Details</UText>

                            <CardField
                                postalCodeEnabled={true}
                                placeholder={{ number: "4242 4242 4242 4242" }}
                                cardStyle={{ backgroundColor: "#f2f2f2" }}
                                style={{ height: 55, marginVertical: 20 }}
                            />

                            <UTextButton variant="primary-md" height={50} onPress={onPay}>
                                Pay Now
                            </UTextButton>

                            <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
                                <UText textAlign="center" color="$red10">Cancel</UText>
                            </TouchableOpacity>
                            {/* </View> */}
                        </SafeAreaView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default PaymentModal;
