import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { postPaymentSuccess } from "../Redux/clientSlices/clientUsers";
import { Box, Button, Spinner, Text, useToast } from "@chakra-ui/react";


const PaymentPage = () => {
  
  const prevId = useRef(null);
  const { id } = useParams(); // Get order ID from URL
  const location = useLocation(); // Access the state passed via navigation
  // const paymentData = location.state || {};
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const paymentData = useMemo(() => {
    const getParam = (key, defaultValue = '') => {
      const value = query.get(key);
      return value !== null ? value : defaultValue;
    };
    return {
      name: getParam('name'),
      phone: getParam('phone'),
      email: getParam('email'),
      seva: getParam('seva', 'Mandir Nirmana Seva'),
      address: getParam('address'),
      pan_number: getParam('pan_number'),
      send_confirmation_message_to_preacher: getParam('send_confirmation_message_to_preacher'),
      campaignsid: getParam('campaignsid'),
      preacher_name: getParam('preacher_name'),
      isanonymous: getParam('isanonymous') === 'true',
      campainerName: getParam('campainerName')
    };
  }, [query]);
  console.log("Order ID, paymentData from url", id, paymentData);
  const [orderConfirmId, setOrderConfirmId] = useState(null)
//   const dispatch = useDispatch();
console.log(orderConfirmId);
  const Toast = useToast();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    if (!id) return; // Ensure ID exists before proceeding
    if (prevId.current !== null && prevId.current === id) {
      return
    }
    prevId.current = id; // Update previous value after state change
    // Function to load Razorpay script dynamically
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js"; // Razorpay script
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const openRazorpay = async () => {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        console.error("Failed to load Razorpay script.");
        return;
      }

      const options = {
        key: process.env.REACT_APP_RZP_KEY,
        currency: "INR",
        name: "Hare Krishna Movement Chennai",
        description: "Mandir Nirmana Seva",
        order_id: id,
        handler: function (response) {
          setOrderConfirmId(response.razorpay_payment_id)
          setPaymentStatus('success');
          // navigate(`/single/${paymentData.campaignsid}`);

          // Commenting the postPaymentSuccess dispatch - as this is handling from Pabbly connect
          //dispatch(postPaymentSuccess({ paymentId: response.razorpay_payment_id, orderid: id, isanonymous: paymentData.isanonymous, campaignid: paymentData.campaignsid  }));
          Toast({
            title: "Payment Successful",
            description: "Your payment was successful. Thank you!",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        },
        prefill: {
          name: paymentData.name || '',
          email: paymentData.email || '',
          contact: paymentData.phone || '',
        },

        notes: {
          name: paymentData.name || '',
          phone: paymentData.phone || '',
          email: paymentData.email || '',
          seva: paymentData.seva || "Mandir Nirmana Seva",
          address: paymentData.address || '',
          pan_number: paymentData.pan_number || '',
          send_confirmation_message_to_preacher: paymentData.send_confirmation_message_to_preacher || '',
          isanonymous: paymentData.isanonymous || false,
          campaignsid: paymentData.campaignsid || ''
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      rzp1.on("payment.failed", function (response) {
        console.error("Payment failed:", response);
        Toast({
          title: "Payment Failed",
          description: "Your payment was unsuccessful",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        // navigate(`/single/${paymentData.campaignsid}`);
        setPaymentStatus('failure');
      });
    };

    openRazorpay();
  }, [id, paymentData, Toast, setOrderConfirmId]);


  if (paymentStatus === 'success') {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="100vh"
        bg="gray.100"
        p={4}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          bg="white"
          p={6}
          borderRadius="md"
          boxShadow="lg"
          w={'350px'}
          animation="borderAnimation 2s infinite"
          position="relative"
          _before={{
            content: '""',
            position: "absolute",
            top: "-2px",
            left: "-2px",
            right: "-2px",
            bottom: "-2px",
            borderRadius: "md",
            border: "2px solid",
            borderColor: "teal.500",
            animation: "borderAnimation 2s infinite",
          }}
          bgGradient="linear(to-r, teal.500, green.500)"
        >
          <Text fontSize="3xl" fontWeight="extrabold" textAlign="center" color="white">
            {`Your payment was successful!`}
          </Text>
          <Text mt={4} fontSize="xl" fontWeight="bold" textAlign="center" color="white">
            {`Your payment has been successfully received. Thank you for your generous support towards ${paymentData?.campainerName? `${paymentData?.campainerName}'s`:''} campaign to build a magnificent Dakshina Dwaraka Dham - The cultural complex to preserve and promote Indian heritage in Chennai, Tamil Nadu.`}
          </Text>
          <Button mt={6} background="#144544" color='white' size="lg" fontWeight="bold" onClick={() => navigate(`/single/${paymentData.campaignsid}`)}>
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }

  if (paymentStatus === 'failure') {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="100vh"
        bg="gray.100"
        p={4}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          bg="white"
          p={6}
          borderRadius="md"
          boxShadow="lg"
          w={'350px'}
          position="relative"
          border="2px solid"
          borderColor="red.500"
          bgGradient="linear(to-r, red.500, orange.500)"
        >
          <Text fontSize="3xl" fontWeight="extrabold" textAlign="center" color="white">
            Payment Failed
          </Text>
          <Text mt={4} fontSize="xl" fontWeight="bold" textAlign="center" color="white">
            Unfortunately, your payment could not be processed. Please try again.
          </Text>
          <Button mt={6} background="red.600" color='white' size="lg" fontWeight="bold" onClick={() => navigate(`/single/${paymentData.campaignsid}`)}>
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }



  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="gray.100"
      p={4}
    >
      <Spinner size="xl" color="blue.500" />
      <Text mt={4} fontSize="xl" fontWeight="bold">
        Processing your payment, please wait...
      </Text>
    </Box>
  );
};

export default PaymentPage;
