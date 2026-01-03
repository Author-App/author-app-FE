import { memo } from "react";
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from "react-native";
import UText from "../../text/uText";
import UTextButton from "../../buttons/uTextButton";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import IconLock from "@/assets/icons/iconLock";

interface PaymentModalProps {
    visible: boolean;
    onClose: () => void;
    onPay: () => void;
}

const PaymentModal = ({ visible, onClose, onPay }: PaymentModalProps) => {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    backgroundColor: "rgba(0,0,0,0.5)"
                }}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <SafeAreaView
                            edges={["bottom"]}
                            style={{
                                backgroundColor: "white",
                                paddingHorizontal: 20,
                                paddingTop: 24,
                                paddingBottom: insets.bottom,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            }}
                        >
                            <UText variant="heading-h2" mb={8}>Complete Purchase</UText>
                            <UText variant="text-md" color="$neutral6" mb={20}>
                                You'll be redirected to Stripe's secure checkout to complete your payment.
                            </UText>

                            {/* Secure payment badge */}
                            <View style={{ 
                                flexDirection: "row", 
                                alignItems: "center", 
                                justifyContent: "center",
                                backgroundColor: "#f8f9fa", 
                                borderRadius: 8, 
                                padding: 12,
                                marginBottom: 20,
                            }}>
                                <IconLock dimen={16} color="#6c757d" />
                                <UText variant="text-sm" color="$neutral6" ml={8}>
                                    Secured by Stripe
                                </UText>
                            </View>

                            <UTextButton variant="primary-md" height={50} onPress={onPay}>
                                Continue to Payment
                            </UTextButton>

                            <TouchableOpacity onPress={onClose} style={{ marginTop: 12, paddingVertical: 8 }}>
                                <UText textAlign="center" color="$neutral6">Cancel</UText>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default memo(PaymentModal);
