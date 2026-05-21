import { Box, Image, SimpleGrid } from "@chakra-ui/react";
import React from "react";

const images = [
  "https://fadcdn.s3.ap-south-1.amazonaws.com/media/1345/Lead_image_70204.jpg",
  "https://fadcdn.s3.ap-south-1.amazonaws.com/media/1345/Lead_image_70204.jpg",
  "https://fadcdn.s3.ap-south-1.amazonaws.com/media/1345/Lead_image_70204.jpg",
  "https://fadcdn.s3.ap-south-1.amazonaws.com/media/1345/Lead_image_70210.jpg",
  "https://fadcdn.s3.ap-south-1.amazonaws.com/media/1345/Lead_image_70211.jpg",
  "https://fadcdn.s3.ap-south-1.amazonaws.com/media/1345/Lead_image_70212.jpg",
  "https://fadcdn.s3.ap-south-1.amazonaws.com/media/1345/Lead_image_70212.jpg",
  "https://fadcdn.s3.ap-south-1.amazonaws.com/media/1345/Lead_image_70214.jpg",
  "https://fadcdn.s3.ap-south-1.amazonaws.com/media/1345/Lead_image_70216.jpg",
];

const HomeTeams = () => {
  return (
    <Box
      border={"2px solid rgb(0,0,0,0.3)"}
      p={["0.4rem", "0.5rem", "1rem", "1.5rem"]}
      borderRadius={"10px"}
      w={"100%"}
      bg={"white"}
      boxShadow={"lg"}
    >
      <Box fontSize={'2rem'} fontWeight={'bold'} textAlign={'center'} mb={'1rem'} color={"teal.500"}>
        TEAM MEMBERS
      </Box>

      <SimpleGrid columns={[2, 3, 4, 5, 6]} spacing={[4]} py={'1rem'} justifyItems={'center'}>
        {images.map((image, index) => (
          <Box
            key={index}
            w={['100px', '110px']}
            h={['100px', '110px']}
            overflow="hidden"
            borderRadius="50%"
            border="2px solid lightgray"
            boxShadow="md"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.1)" }}
          >
            <Image
              w="100%"
              h="100%"
              src={image}
              alt={`Image ${index + 1}`}
              objectFit="cover"
            />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default HomeTeams;
