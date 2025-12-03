import React from "react";
import UText from "@/src/components/core/text/uText";
// import { LinearGradient } from "expo-linear-gradient";
import { LinearGradient } from '@tamagui/linear-gradient';

const PremiumBadge = () => {
  return (
    <LinearGradient
      colors={["#FFD700", "#FFB700", "#FFA500"]}
      start={[0, 0]}
      end={[1, 0]}
      style={{ borderRadius: 20, paddingHorizontal: 8, paddingVertical: 5, marginTop: 8, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 }}
    >
      <UText color="$white" variant="text-xs" fontWeight="700">
        Premium
      </UText>
    </LinearGradient>
  );
};

export default PremiumBadge;
