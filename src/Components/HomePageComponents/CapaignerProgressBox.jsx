import React, { useState } from 'react';
import { Box, Button, HStack, VStack, Input, Badge, Flex, Select } from '@chakra-ui/react';
import { calculatePercentage, formatCurrency, getDaysDifference } from '../utils';
import ProgressBar from './ProgressBar';

import { IskconBgColor, IskconFontColor } from '../utils';

const CapaignerProgressBox = ({
    getSingleUser,
    amount,
    setAmount,
    handleClick,
    errorMessage
}) => {
    const targetAmount = getSingleUser?.campaignDetails?.targetAmount || 1000000;
    const raisedAmount = getSingleUser?.raisedFund || 0;
    const isTargetReached = raisedAmount >= targetAmount;
    const currentPercentage = calculatePercentage(targetAmount, raisedAmount);
    const sevaOptions = [
            { label: "1 Square ft Seva", value: 5001 },
            { label: "2 Square ft Seva", value: 10001 },
            { label: "4 Square ft Seva", value: 20001 },
            { label: "8 Square ft Seva", value: 40001 },
            { label: "10 Square ft Seva", value: 50001},
            { label: "15 Square ft Seva", value: 75001},
            { label: "20 Square ft Seva", value: 100008}
        ];
    const [showCustomInput, setShowCustomInput] = useState(false);

        // 3. Handle dropdown changes
    const handleDropdownChange = (e) => {
            const selectedValue = e.target.value;

            if (selectedValue === "custom") {
                // If user selects "Custom", show the input and clear the amount
                setShowCustomInput(true);
                setAmount("");
            } else {
                // If user selects a Seva, hide the input and set the amount
                setShowCustomInput(false);
                setAmount(selectedValue);
            }
        };
    return (
        <Box
            w={["97%", "97%", "97%", "50%"]}
            mx={"auto"}
            border="2px solid rgba(0, 0, 0, 0.1)"
            p="1rem"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            boxShadow="lg"
            borderRadius="md"
            bg="white"
        >
            <Box
                bgColor={IskconBgColor}
                color={IskconFontColor}
                py="1.5rem"
                px="2rem"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                borderRadius="md"
            >

                <Flex justifyContent="space-between" alignItems="center">
                    {isTargetReached && <Badge
                        fontSize={["2xs", "xs", "x"]}
                        borderRadius="full"
                        px="4"
                        // py="2"
                        // my={-1}
                        background={"#ffffff"}
                        color={"#eb6a26"}
                        boxShadow="md"
                        // fontWeight="extrabold"
                        position="relative"
                        width={"fit-content"}
                    >
                        Star Campaigner !!
                    </Badge>}
                    <Box color="#d481f0" fontWeight={900} fontSize={"20px"}>{currentPercentage >= 100 ? "Goal Achieved!" : currentPercentage >= 80 ? "One Step to Victory🔥" : ""}</Box>
                </Flex>

                <VStack width="100%" alignItems="flex-start" gap="0.5rem" marginTop={"0.5rem"}>
                    <HStack>
                        <Box fontWeight="semibold" fontSize={["xl", "2xl", "3xl"]}>
                            RAISED
                        </Box>
                        <Box fontSize={["3xl", "4xl", "5xl"]} fontWeight="900">
                            {formatCurrency(getSingleUser?.raisedFund)}
                        </Box>
                    </HStack>

                    <HStack>
                        <Box fontWeight="semibold" fontSize={["xl", "2xl", "3xl"]}>
                            GOAL<span>&nbsp;&nbsp;&nbsp;</span>
                        </Box>
                        <Box fontSize={["2xl", "3xl", "4xl"]}>
                            {formatCurrency(getSingleUser?.campaignDetails?.targetAmount)}
                        </Box>
                    </HStack>

                </VStack>

                <HStack w={"100%"} justifyContent={"space-between"} my={"1rem"}>
                    <VStack
                        fontWeight={"semibold"}
                        fontSize={["md", "lg", "xl"]}
                        gap={"2px"}
                        alignItems={"flex-start"}
                    >
                        <Box>DAYS LEFT</Box>
                        <Box fontSize={["3xl", "4xl", "5xl"]} fontWeight="900">
                            {getDaysDifference(
                                getSingleUser?.campaignDetails?.enddate
                            )}
                        </Box>
                    </VStack>
                    <VStack
                        fontWeight={"semibold"}
                        fontSize={["md", "lg", "xl"]}
                        gap={"2px"}
                        alignItems={"flex-start"}
                    >
                        <Box>FUNDERS</Box>
                        <Box fontSize={["3xl", "4xl", "5xl"]} fontWeight="900">{getSingleUser?.totalFunders}</Box>
                    </VStack>
                </HStack>
                <Box w="100%">
                    <ProgressBar
                        currentAmount={getSingleUser?.raisedFund}
                        goalAmount={getSingleUser?.campaignDetails?.targetAmount}
                    />
                </Box>
            </Box>
            <VStack p="1rem" w={"100%"} alignItems={"flex-start"} gap={"1.5rem"}>
                <Box fontSize={["xs", "sm", "md"]} fontWeight={"semibold"} color="gray.600">
                    Accepts funds from Indian Passport / ID holders only.
                </Box>
                <VStack w={"100%"} gap={"1rem"}>
                    {getDaysDifference(
                        getSingleUser?.campaignDetails?.enddate
                    ) === 100 ? (
                        <Box fontSize={["md", "lg", "xl"]} color={"green.500"}>
                            Successful
                        </Box>
                    ) : (
                        <Box w={"100%"}>
                            {/* --- 4. NEW DROPDOWN ADDED HERE --- */}
                                                        <Select
                                                            placeholder="Choose a Seva option"
                                                            onChange={handleDropdownChange}
                                                            h={"50px"}
                                                            mb={"1rem"}
                                                            focusBorderColor="#d481f0"
                                                            border="2px solid #d481f0"
                                                        >
                                                            {sevaOptions.map((option) => (
                                                                <option key={option.label} value={option.value}>
                                                                    {`${option.label} - ${formatCurrency(option.value)}`}
                                                                </option>
                                                            ))}
                                                         <option value="custom">Enter Your Amount</option>
                                                        </Select>
                            {showCustomInput && (
                                                            <Input
                                                                type="number"
                                                                placeholder="Enter Your Amount here"
                                                                value={amount}
                                                                onChange={(e) => setAmount(e.target.value)}
                                                                h={"50px"}
                                                                focusBorderColor="#d481f0"
                                                                border="4px solid #d481f0"
                                                            />
                                                        )}
                        </Box>
                    )}
                    <Button
                        w={"100%"}
                        h={"50px"}
                        // colorScheme='teal'
                        background={IskconBgColor}
                        color={IskconFontColor}
                        fontWeight={"bold"}
                        fontSize={["md", "lg", "xl"]}
                        onClick={handleClick}
                        isDisabled={
                            getDaysDifference(
                                getSingleUser?.campaignDetails?.enddate
                            ) === 100
                        }
                    >
                        CONTRIBUTE
                    </Button>
                    <Box fontWeight={"bold"} color={"red.500"}>
                        {errorMessage}
                    </Box>
                </VStack>
            </VStack>
        </Box>
    );
};

export default CapaignerProgressBox;