import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { getTokenValue } from 'tamagui';

// Custom Success Toast
const SuccessToast = (props: any) => {
    const { top } = useSafeAreaInsets();

    return (
        <View style={[styles.container, { marginTop: top }]}>
            <BaseToast
                {...props}
                style={styles.successToast}
                contentContainerStyle={styles.contentContainer}
                text1Style={styles.title}
                text2Style={styles.message}
                text1NumberOfLines={1}
                text2NumberOfLines={2}
                renderLeadingIcon={() => (
                    <View style={styles.iconContainer}>
                        <View style={[styles.iconCircle, styles.successIcon]}>
                            <View style={styles.checkmark} />
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

// Custom Error Toast
const CustomErrorToast = (props: any) => {
    const { top } = useSafeAreaInsets();

    return (
        <View style={[styles.container, { marginTop: top }]}>
            <ErrorToast
                {...props}
                style={styles.errorToast}
                contentContainerStyle={styles.contentContainer}
                text1Style={styles.title}
                text2Style={styles.message}
                text1NumberOfLines={1}
                text2NumberOfLines={2}
                renderLeadingIcon={() => (
                    <View style={styles.iconContainer}>
                        <View style={[styles.iconCircle, styles.errorIcon]}>
                            <View style={styles.crossIcon}>
                                <View style={[styles.crossLine, styles.crossLine1]} />
                                <View style={[styles.crossLine, styles.crossLine2]} />
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

// Custom Info Toast
const InfoToast = (props: any) => {
    const { top } = useSafeAreaInsets();

    return (
        <View style={[styles.container, { marginTop: top }]}>
            <BaseToast
                {...props}
                style={styles.infoToast}
                contentContainerStyle={styles.contentContainer}
                text1Style={styles.title}
                text2Style={styles.message}
                text1NumberOfLines={1}
                text2NumberOfLines={2}
                renderLeadingIcon={() => (
                    <View style={styles.iconContainer}>
                        <View style={[styles.iconCircle, styles.infoIcon]}>
                            <View style={styles.infoSymbol}>
                                <View style={styles.infoDot} />
                                <View style={styles.infoLine} />
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export const toastConfig: ToastConfig = {
    success: (props) => <SuccessToast {...props} />,
    error: (props) => <CustomErrorToast {...props} />,
    info: (props) => <InfoToast {...props} />,
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
    },
    successToast: {
        backgroundColor: '#1a1a2e',
        borderLeftWidth: 0,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2d5a3d',
        height: 'auto',
        minHeight: 70,
        paddingVertical: 12,
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    errorToast: {
        backgroundColor: '#1a1a2e',
        borderLeftWidth: 0,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#5a2d2d',
        height: 'auto',
        minHeight: 70,
        paddingVertical: 12,
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    infoToast: {
        backgroundColor: '#1a1a2e',
        borderLeftWidth: 0,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2d4a5a',
        height: 'auto',
        minHeight: 70,
        paddingVertical: 12,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    contentContainer: {
        paddingHorizontal: 12,
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#ffffff',
        fontFamily: 'System',
        letterSpacing: 0.3,
    },
    message: {
        fontSize: 13,
        fontWeight: '400',
        color: '#a0a0a0',
        fontFamily: 'System',
        marginTop: 2,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 16,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successIcon: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        borderWidth: 1.5,
        borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    errorIcon: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderWidth: 1.5,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    infoIcon: {
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        borderWidth: 1.5,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    checkmark: {
        width: 12,
        height: 6,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#22c55e',
        transform: [{ rotate: '-45deg' }],
        marginTop: -2,
    },
    crossIcon: {
        width: 14,
        height: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    crossLine: {
        position: 'absolute',
        width: 14,
        height: 2,
        backgroundColor: '#ef4444',
        borderRadius: 1,
    },
    crossLine1: {
        transform: [{ rotate: '45deg' }],
    },
    crossLine2: {
        transform: [{ rotate: '-45deg' }],
    },
    infoSymbol: {
        alignItems: 'center',
    },
    infoDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#3b82f6',
        marginBottom: 2,
    },
    infoLine: {
        width: 2,
        height: 10,
        backgroundColor: '#3b82f6',
        borderRadius: 1,
    },
});

export default toastConfig;
