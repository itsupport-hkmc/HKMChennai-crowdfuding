import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

const CampaignTabs = ({ tab, setTab }) => {
    return (
        <HStack
            w={"100%"}
            maxW={"1200px"}
            mx={"auto"}
            my={"2.5rem"}
            py={"1.5rem"}
            borderTop={"2px dotted red"}
            borderBottom={"2px dotted red"}
            justifyContent={"space-around"}
        >
            <Box
                fontSize={["1.5rem"]}
                onClick={() => setTab(1)}
                cursor={"pointer"}
                borderBottom={tab === 1 ? "3px solid red" : ""}
                pb={".2rem"}
                borderRadius={"2px"}
            >
                Campaign
            </Box>
            <Box
                fontSize={["1.5rem"]}
                onClick={() => setTab(2)}
                cursor={"pointer"}
                borderBottom={tab === 2 ? "3px solid red" : ""}
            >
                Funders
            </Box>
        </HStack>
    );
};

export default CampaignTabs;