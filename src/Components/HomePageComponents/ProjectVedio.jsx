import { AspectRatio, Box, Center } from '@chakra-ui/react';
import React from 'react';

const ProjectVedio = () => {
    return (
      <>
         <Box w={"90%"} h={"auto"} mx={"auto"} mb = {10}>
              <Center mt={6}>
                <AspectRatio ratio={16 / 9} w="100%">
                  <iframe
                  src="https://www.youtube.com/embed/MJD6pT1DLDk"
                  title="Construction Updates | Sri Radha Krishna Temple | ISKCON Mangalore" frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerpolicy="strict-origin-when-cross-origin" 
                  allowfullscreen></iframe>
                  </AspectRatio>
              </Center>
               <Box fontWeight={"semibold"} fontStyle={"italic"}>
                Watch this video to get a better understanding of the ongoing
                project.
              </Box>
            </Box>
          </>
    );
};

export default ProjectVedio;