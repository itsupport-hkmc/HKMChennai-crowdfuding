import { Box, HStack, Image, VStack, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

import Banner from "../../assets/images/mandir_nirman_seva_banner.png";

import { IskconGradientLight, IskconGradientDark } from '../utils';

const DetailPageHeader = ({ themeColor, getSingleUser, image16 }) => {
  const { colorMode } = useColorMode();
  // const bgGradient = colorMode === 'light' ? 'linear(to-r, teal.500, green.500)' : 'linear(to-r, teal.200, green.200)';
  const bgGradient = colorMode === 'light' ? IskconGradientLight : IskconGradientDark;

  return (
    <>
    <Box w="100%" h="6px" bgGradient="linear(to-r, #D4AF37, #FFD700, #D4AF37)" />
    <Box
      w={"100%"}
      bgGradient={bgGradient}
      bg={'maroon'}
      py={"2rem"}
      px={["1.5rem", "2rem", "3rem"]}
    >
      <Box w={"100%"} maxW={"1200px"} mx={"auto"} color={'white'}>
        <Text
          fontWeight={"bold"}
          fontSize={["1rem", "1rem", "1.5rem"]}
          w={["99%", "85%", "70%"]}
          maxW={"650px"}
          lineHeight={"2.2rem"}
        >
          {getSingleUser?.campaignDetails?.campaignName}'s campaign to build a
          magnificent Dakshina Dwaraka Dham - The cultural complex to preserve and promote Indian heritage in
          Thiruvanmiyur, Chennai, Tamil Nadu.
        </Text>
        <VStack alignItems={"flex-start"} gap={"1rem"} mt={"1rem"} >
          <HStack>
            <Box>
              <FaLocationDot />
            </Box>
            <Text>Thiruvanmiyur, Chennai, Tamil Nadu, India</Text>
          </HStack>


          <Link to={'/'}>
            <HStack>
              <Box
                w={"80px"}
                h={"80px"}
                overflow={"hidden"}
                borderRadius={"50%"}
                border={"2px solid white"}
              >
                <Image
                  h={"100%"}
                  w={"100%"}
                  borderRadius="full"        // Makes the image container round
                  objectFit="contain"        // Ensures entire image fits inside the circle
                  src={image16}
                  alt="Profile"
                />
              </Box>
              <VStack alignItems={"flex-start"} gap={"2px"}>
                <Text fontWeight={"bold"}>Hare Krishna Movement Chennai</Text>
                <Text fontWeight={"bold"} color={"#FFD700"} fontStyle={"italic"}>Go to Homepage</Text>
              </VStack>
            </HStack>
          </Link>

        </VStack>
      </Box>
    </Box>
    <Box w="100%" h="6px" bgGradient="linear(to-r, #D4AF37, #FFD700, #D4AF37)" />
    <Image
      src={Banner}
    />
    </>
  );
};

export default DetailPageHeader;
