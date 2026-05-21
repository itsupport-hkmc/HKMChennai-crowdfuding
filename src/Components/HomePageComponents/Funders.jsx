import { Box, HStack, VStack, Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import { formatCurrency } from '../utils';

const Funders = ({ getSingleUser }) => {
  const [showAll, setShowAll] = useState(false);

  const handleShowAll = () => {
    setShowAll(true);
  };

  const fundersToShow = showAll ? getSingleUser?.userList : getSingleUser?.userList?.slice(0, 20);

  return (
    <Box w={"95%"} maxW={"1200px"} mx={"auto"}>
      {fundersToShow?.length > 0 ? (
        fundersToShow.map((funder) => (
          <HStack
            key={funder.id}
            borderBottom={"2px dotted red"}
            py={"2rem"}
            gap={"1rem"}
          >
          
            <Box
              borderRadius={"50%"}
              bgColor={"white"}
              w={"50px"}
              h={"50px"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              fontSize={"1.5rem"}
              fontWeight={"bold"}
              bg='#c89a9a'
            >
              {(funder?.isanonymous ? 'Anonymous' : funder?.username)[0]}
            </Box>
            <VStack
              alignItems={["center"]}
              flexDirection={["row"]}
              w={"100%"}
              justifyContent={"space-between"}
            >
              <Box
                fontWeight={"bold"}
                fontSize={"1.5rem"}
                whiteSpace={"normal"}
                overflowWrap={"break-word"}
                wordBreak={"break-word"}
                w={'70%'}
              >
                {funder?.isanonymous ? 'Anonymous' : funder?.username}
              </Box>
              <Box fontSize={"1.5rem"} fontWeight={"bold"}>
                {formatCurrency(funder?.amount)}
              </Box>
            </VStack>
          </HStack>
        ))
      ) : (
        <Box
          textAlign={"center"}
          w={"100%"}
          fontWeight={"bold"}
          fontSize={"1.1rem"}
          color={"red.500"}
        >
          No Funders Found
        </Box>
      )}
      {!showAll && getSingleUser?.userList?.length > 20 && (
        <Box textAlign={"center"} mt={"2rem"}>
          <Button onClick={handleShowAll}>Show All</Button>
        </Box>
      )}
    </Box>
  );
};

export default Funders;