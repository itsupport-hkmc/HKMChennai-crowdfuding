import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  HStack,
  VStack,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { formatCurrency } from "../utils";
import CountUp from "react-countup";
import { keyframes } from "@emotion/react";


const borderAnimation = keyframes`
  0% {
    border-color: transparent;
  }
  50% {
//     border-color: #6A1B1A;
    border-color: #D4AF37
  }
  100% {
    border-color: transparent;
  }
`;

const CampaignProgressDetails = ({ currentAmount, goalAmount }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (goalAmount > 0) {
      const targetPercentage = Math.min(
        (currentAmount / goalAmount) * 100,
        100
      );
      let start = 0;

      const interval = setInterval(() => {
        if (start >= targetPercentage) {
          setProgress(targetPercentage);
          clearInterval(interval);
        } else {
          start += 1;
          setProgress(start);
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [currentAmount, goalAmount]);

//   const bgColor = useColorModeValue("gray.800", "gray.700");
//   const progressColor = IskconBgColor; //useColorModeValue("green.400", "green.300");
//   const progressStrokeColor = useColorModeValue("#e3c44e");
  const trackColor = useColorModeValue("gray.300", "gray.600");
//   const textColor = useColorModeValue("white", "gray.200");

  return (
    <Box
      w={'100%'}
      mx="auto"
      borderRadius="10px"
      px={'10px'}
      py={'5px'}
      bgColor="#FAF3E0"
      boxShadow="dark-lg"
      marginBottom="10px"
      border="6px solid #D4AF37"
      borderColor="transparent"
      animation={`${borderAnimation} 3s infinite`}
      textTransform='uppercase'
    >
      <Flex direction={["column", "column", "row"]} align="center" justify="space-between">
        <Stack
          direction={["column", "column", "row"]}
          spacing={["0.2rem", "1rem"]}
          align="center"
        >
          <VStack align={["center", "center", "flex-start"]} marginLeft={["0", "0", "3rem"]}>
            <Flex align="center" gap={2} color={'#3B2F2F'} fontSize={["1.5rem", "2rem", "2rem"]}>
              <Box fontWeight="semibold">Goal:</Box>
              <Box fontWeight="semibold">{formatCurrency(goalAmount)}</Box>
            </Flex>

            <HStack alignItems="baseline" color={'#B22222'}>
              <Box fontSize={["2rem", "2.2rem", "2.5rem"]} fontWeight="bold">
                ₹<CountUp end={currentAmount} start={currentAmount / 2} useIndianSeparators={true} />
              </Box>
              <Box fontSize={["1.2rem", "1.3rem", "1.5rem"]} fontWeight="bold">
                Achieved
              </Box>
            </HStack>
          </VStack>
        </Stack>
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress
            value={progress}
            size={["100px", "130px", "150px"]}
            thickness="10px"
            color={'#3B2F2F'}
            trackColor={trackColor}
            capIsRound={true}
          >
            <CircularProgressLabel
              fontSize={["1rem", "1.2rem", "1.5rem"]}
              fontWeight="bold"
              color={'#B22222'}
            >
              {progress.toFixed(2)}%
            </CircularProgressLabel>
          </CircularProgress>
        </Box>

        <VStack align={["center", "center", "flex-start"]} mt={[4, 4, "-1rem"]} marginRight={["0", "0", "3rem"]}>
          <Box fontSize={["1.5rem", "2rem", "2.3rem"]} fontWeight="bold" color={'#B22222'}>
            Mandir Nirmana Seva
          </Box>
          <Box fontSize={["1rem", "1.2rem", "1.5rem"]}   fontWeight="bold" color={'#B22222'} mt={2}>
            Be a Part of This Legacy
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
};

export default CampaignProgressDetails;