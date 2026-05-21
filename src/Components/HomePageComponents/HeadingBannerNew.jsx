import { Flex, Image, Box, Text } from "@chakra-ui/react";
import logo from "../../assets/images/logo.png";

// import { IskconFontColor, IskconBgColor, banner } from "../utils.jsx";

const HeadingBanner = () => {
    // const bgColor = '#54956e';
    // const textColor = useColorModeValue("white", "gray.200");
    const bgColor = '#4B0000';  //'#f4c430'; //'#f4c430';
    const textColor = '#FFFFFF'; //useColorModeValue("#444444", "gray.200")

    return (
        <>
        <Box w="100%" h="6px" bgGradient="linear(to-r, #D4AF37, #FFD700, #D4AF37)" />
        <Flex
            maxW="1200px"
            justifyContent='space-between'
            align="center"
            bg={bgColor}
            h={["150px", "160px", "180px"]}
            direction="row"
            p='0px'
            px={'20px'}
            boxShadow="lg"
        >
            <Image
                src={logo}
                alt="Left Banner"
                boxSize={["100px", "120px", "140px"]}
                width={["150px", "170px", "190px"]}
                border="2px"
                _hover={{ transform: "scale(1.1)", transition: "0.3s" }}
            />
            <Box
                width={'4px'}
                height={["100px", "120px", "140px"]}
                bg="black"
                marginRight="10px"
                marginLeft="10px"
            />
            <Box textAlign="left" flex="1" >
                <Text fontSize={["xs", "sm", "lg"]} fontWeight="bold" color={textColor} >
                    IF YOU BUILD A TEMPLE OF LORD KRISHNA IN THIS WORLD, KRISHNA WILL BUILD A PALACE FOR YOU IN THE SPIRITUAL WORLD - VAIKUNTHA
                </Text>
            </Box>
            
        </Flex>
        <Box w="100%" h="6px" bgGradient="linear(to-r, #D4AF37, #FFD700, #D4AF37)" />
        <Box display={"block"} marginBottom='5px' maxW="1200px" w="100%" mt="-1px" mb="8px" textAlign={"end"}>
            <Text fontSize={["xs", "sm", "lg"]} color={textColor} bg={bgColor}>
{/*                 <i>If you build a temple of Krishna, you will be liberated. <span>&nbsp;&nbsp;</span><br/><b>- Srila Prabhupada </b><span>&nbsp;&nbsp;</span></i> */}
            </Text>
        </Box>
       
        </>
    );
};

export default HeadingBanner;
