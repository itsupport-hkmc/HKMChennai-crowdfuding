import { Box, Image, Text } from '@chakra-ui/react';
import React from 'react';

const PhotoWithDescription = ({ imageError, avatar, getSingleUser, handleImageError }) => {
    return (
        <Box w={["97%", "97%", "97%", "50%"]} mx={"auto"}>
            <Box
                w="100%"
                h={["400px", "450px", "400px", "400px", "500px"]}
                overflow="hidden"
            >
            <Text
                  as="h2"
                  fontSize={["xl", "2xl", "2xl", "3xl"]}
                  fontWeight="bold"
                  textAlign="center"
                  mb="0.5rem"
                  color="#2E2E2E"
                  fontFamily="'Merriweather', serif"
                >
                  Sri {getSingleUser?.campaignDetails?.campaignName}
                </Text>
                <Image
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    src={imageError ? avatar : getSingleUser?.campaignDetails?.imgurl}
                    onError={handleImageError}
                />
            </Box>
            <Box
            textAlign="justify"
                bgColor="#EDEAEA"
                mt="1rem"
                p="1rem"
                fontSize="1.1rem"
                fontFamily="sans-serif"
                color="#777777"
            >
                As a devoted well-wisher, I am leading this sacred campaign to support 
                the creation of a magnificent Dakshina Dwaraka Dham - The cultural complex to preserve and
                promote Indian heritage in Chennai, Tamil Nadu.
            </Box>
        </Box>
    );
};

export default PhotoWithDescription;