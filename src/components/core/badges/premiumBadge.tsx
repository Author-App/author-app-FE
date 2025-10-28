import React from "react";
import { LinearGradient } from "@tamagui/linear-gradient";
import UText from "@/src/components/core/text/uText";

const PremiumBadge = () => {
  return (
    <LinearGradient
      colors={["#FFD700", "#FFB700", "#FFA500"]}
      start={[0, 0]}
      end={[1, 0]}
      borderRadius={20}
      px={8}
      py={5}
      mt={8}
      ai="center"
      jc="center"
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.2}
      shadowRadius={3}
    >
      <UText color="$white" variant="text-xs" fontWeight="700">
        Premium
      </UText>
    </LinearGradient>
  );
};

export default PremiumBadge;
