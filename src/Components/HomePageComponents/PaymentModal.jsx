import { Box, Checkbox, HStack, Input, VStack, Spinner } from '@chakra-ui/react';
import React, { useState, useCallback, useRef } from 'react';
import { IskconBgColor } from '../utils';

const PaymentModal = ({
    themeColor,
    amount,
    setPaymentModel,
    handleSubmit,
    handleOnChange,
    formData,
    errors
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const lastSubmitTimeRef = useRef(0);

    const debouncedHandleSubmit = useCallback((e) => {
        e.preventDefault();

        const now = Date.now();
        const timeSinceLastSubmit = now - lastSubmitTimeRef.current;

        // If already submitting or clicked too recently (within 2 seconds), prevent submission
        if (isSubmitting || timeSinceLastSubmit < 2000) {
            return;
        }

        // Update last submit time
        lastSubmitTimeRef.current = now;

        // Set submitting state
        setIsSubmitting(true);

        // Call the original handleSubmit
        handleSubmit(e);

        // Reset submitting state after a delay
        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);

    }, [handleSubmit, isSubmitting]);

    return (
        <Box
            position={"fixed"}
            w={["100%", "77%"]}
            h={"100vh"}
            overflow={"hidden"}
            bgColor={"rgb(0,0,0,0.6)"}
            zIndex={10}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
        >
            <Box
                w={["95%", "95%", "95%", "70%", "45%"]}
                mt={"0rem"}
                borderRadius={"10px"}
                bgColor={"white"}
                h={"auto"}
            >
                <HStack
                    w={"100%"}
                    bgColor={IskconBgColor}
                    borderTopLeftRadius={"10px"}
                    borderTopRightRadius={"10px"}
                    p={"1rem"}
                    justifyContent={"space-between"}
                    fontWeight={"bold"}
                    color={"white"}
                    fontSize={"1.1rem"}
                >
                    <Box >Amount: {amount}</Box>
                    <Box onClick={() => setPaymentModel(false)} cursor={"pointer"}>
                        Close
                    </Box>
                </HStack>


                <Box
                    w={"90%"}
                    mx={"auto"}
                    overflow={"hidden"}
                    transition="height 0.3s ease-in-out"
                >
                    <form onSubmit={debouncedHandleSubmit}>
                        <Input
                            onChange={handleOnChange}
                            name="username"
                            value={formData.username}
                            border={"2px solid #CCCCCC"}
                            type="text"
                            placeholder="Full Name*"
                            marginTop={"1rem"}
                            marginBottom={'0.6rem'}
                        />
                        {errors.username && (
                            <Box color="red.500">{errors.username}</Box>
                        )}

                        <HStack marginBottom={'0.6rem'}>
                            <VStack alignItems={"flex-start"} gap={"1px"} w={"100%"}>

                                <Input
                                    onChange={handleOnChange}
                                    name="mobileno"
                                    value={formData.mobileno}
                                    border={"2px solid #CCCCCC"}
                                    type="tel"
                                    placeholder="Enter Mobile Number*"
                                    w={"100%"}
                                />
                                {errors.mobileno && (
                                    <Box color="red.500">{errors.mobileno}</Box>
                                )}
                            </VStack>
                        </HStack>

                        <Box
                            marginBottom={'0.6rem'}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                border={"2px solid #CCCCCC"}
                                placeholder="Enter Email ID (Optional)"
                                onChange={handleOnChange}
                            />
                            {errors.email && <Box color="red.500">{errors.email}</Box>}
                        </Box>

                        {amount >= 500 && <HStack>
                            <Checkbox
                                onChange={handleOnChange}
                                name="prasadRequired"
                                isChecked={formData.prasadRequired}
                                size={"lg"}
                            >
                                🎁 Would you like to receive Gifts and Mahaprasad?  (Provide correct address for prasad delivery)
                            </Checkbox>
                        </HStack>}
                        {amount < 1 && <HStack>
                            <Checkbox
                                onChange={handleOnChange}
                                name="prasadRequired"
                                isChecked={formData.prasadRequired}
                                size={"lg"}
                                disabled="true"
                            >
                                Would you like to receive Mahaprasad? (Above ₹500 only)
                            </Checkbox>
                        </HStack>}
                        <HStack>
                            <Checkbox
                                onChange={handleOnChange}
                                name="taxExemption"
                                isChecked={formData.taxExemption}
                                size={"lg"}
                            >
                                80G Tax Exemption
                            </Checkbox>
                        </HStack>
                        <HStack>
                            <Checkbox
                                onChange={handleOnChange}
                                name="isanonymous"
                                isChecked={formData.isanonymous}
                                size={"lg"}
                            >
                                Make my donation anonymous
                            </Checkbox>
                        </HStack>


                        {formData.taxExemption && <HStack marginTop={"0.6rem"}>
                            <VStack alignItems={"flex-start"} gap={"1px"} w={"100%"}>

                                <Input
                                    type="text"
                                    onChange={handleOnChange}
                                    name="panno"
                                    value={formData.panno}
                                    border={"2px solid #CCCCCC"}
                                    placeholder="Enter PAN No."
                                    w={"100%"}
                                />
                                {errors.panno && <Box color="red.500">{errors.panno}</Box>}
                            </VStack>
                        </HStack>}



                        {formData.prasadRequired && <>
                            <Input
                                onChange={handleOnChange}
                                name="address"
                                value={formData.address}
                                border={"2px solid #CCCCCC"}
                                type="text"
                                placeholder="Address, House No., Street Address, Area Name, etc*"
                                marginTop={"0.6rem"}
                                marginBottom={"0.6rem"}
                            />
                            {errors.address && <Box color="red.500">{errors.address}</Box>}

                            <Input
                                onChange={handleOnChange}
                                name="pincode"
                                value={formData.pincode}
                                border={"2px solid #CCCCCC"}
                                type="text"
                                placeholder="Pin Code*"
                            />
                            {errors.pincode && <Box color="red.500">{errors.pincode}</Box>}

                        </>
                        }


                        <Input
                            type="submit"
                            value={isSubmitting ? "Processing..." : "Pay Now"}
                            bgColor={isSubmitting ? "gray.400" : IskconBgColor}
                            my={"1rem"}
                            fontWeight={"bold"}
                            color={"white"}
                            w={"auto"}
                            mx={"auto"}
                            display={"block"}
                            cursor={isSubmitting ? "not-allowed" : "pointer"}
                            disabled={isSubmitting}
                            opacity={isSubmitting ? 0.7 : 1}
                        />
                        {isSubmitting && (
                            <Box textAlign="center" mt="0.5rem">
                                <Spinner size="sm" color={IskconBgColor} />
                            </Box>
                        )}
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default PaymentModal;