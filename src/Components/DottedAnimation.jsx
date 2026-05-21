import React from "react";
import { Box, HStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { themeColor } from "./utils";

const DottedAnimation = () => {
    const bounce = keyframes`
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  `;

  return (
    <HStack spacing="5px" justify="center" align="center" h="100%">
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        w="10px"
        h="10px"
        bg={themeColor}
        borderRadius="50%"
        animation={`${bounce} 1.4s ease-in-out ${i * 0.2}s infinite`}
      />
    ))}
  </HStack>
  )
}

export default DottedAnimation

