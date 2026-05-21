import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchSingleUser,
  postPaymentFormData,
} from "../Redux/clientSlices/clientUsers";
import image16 from "../assets/images/logo.jpeg";
import avatar from "../assets/images/Avatar-PNG-Image.webp";
import {CountdownTimer} from '../Components/HomePageComponents/countdownConfetti';

import {
  Box,
  HStack,
  IconButton,
} from "@chakra-ui/react";

import DottedAnimation from "../Components/DottedAnimation";
import {
  themeColor,
} from "../Components/utils";
import PageNotFound from "../Components/HomePageComponents/PageNotFound";
import CampaignMoreDetails from "../Components/HomePageComponents/CampaingMoreDetails";
import Funders from "../Components/HomePageComponents/Funders";
import { campaign } from "../constants/homePage";
import CapaignerProgressBox from "../Components/HomePageComponents/CapaignerProgressBox";
import DetailPageHeader from "../Components/HomePageComponents/DetailPageHeader";
import PaymentModal from "../Components/HomePageComponents/PaymentModal";
import PhotoWithDescription from "../Components/HomePageComponents/PhotoWithDescription";
import AdditionalDetails from "../Components/HomePageComponents/AdditionalDetails";
import CampaignTabs from "../Components/HomePageComponents/Tabs";
import { FaArrowUp } from "react-icons/fa6";
import Fotter from "../Components/HomePageComponents/Fotter";
import { IskconBgColor, IskconFontColor } from "../Components/utils";
import ProjectVedio from "../Components/HomePageComponents/ProjectVedio";

const HomeSinglePage = () => {
  const { id } = useParams();

  const [tab, setTab] = useState(1);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { isLoading, getSingleUser } = useSelector(
    (state) => state.clientUsers
  );
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentModel, setPaymentModel] = useState(false);
  const [formToggle, setFormToggle] = useState(false);
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();
  console.log(formToggle);

  const [formData, setFormData] = useState({
    email: "",
    mobileno: "",
    country: "Indian",
    pincode: "",
    panno: "",
    address: "",
    amount: amount,
    username: "",
    campaignsid: id,
    prasadRequired: false,
    taxExemption: false,
    isanonymous: false,
  });

  useEffect(() => {
    dispatch(fetchSingleUser(id));
  }, [dispatch, id]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    if (amount === null) {
      return setErrorMessage("Please enter an amount");
    } else if (amount < 500) {
      return setErrorMessage("Minimum contribution amount is INR 500");
    }

    setErrorMessage("");
    setPaymentModel(true);
    setFormData({
      email: "",
      mobileno: "",
      country: "Indian",
      pincode: "",
      panno: "",
      address: "",
      amount: amount,
      username: "",
      campaignsid: id,
      preachername: ""
    });
    setFormToggle(false);
  };

  const validateForm = () => {
    const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0]?[6789][0-9]{9}$/;
    const pincodeRegex = /^[0-9]{6}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

    // Mobile number validation
    if (!formData.mobileno) {
      newErrors.mobileno = "Mobile number is required";
    } else if (!mobileRegex.test(formData.mobileno)) {
      newErrors.mobileno = "Please enter a valid 10-digit mobile number";
    }

    // PAN number validation
    if (formData.taxExemption) {
      if (!formData.panno) {
        newErrors.panno = "PAN number is required";
      } else if (!panRegex.test(formData.panno)) {
        newErrors.panno = "Please enter a valid PAN number";
      }
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (!amountRegex.test(formData.amount)) {
      newErrors.amount = "Please enter a valid amount (e.g., 123.45)";
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
    }

    if (formData.prasadRequired) {
      // Address validation
      if (!formData.address) {
        newErrors.address = "Address is required";
      }
      // Pincode validation
      if (!formData.pincode) {
        newErrors.pincode = "Pincode is required";
      } else if (!pincodeRegex.test(formData.pincode)) {
        newErrors.pincode = "Please enter a valid 6-digit pincode";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleOnChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log({ name, value, type, checked });
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (name === "email" && value.includes("@")) {
      setFormToggle(true);

      console.log(true);
    }
  };

  const handleSubmit = (e) => {
      e.preventDefault();

      if (validateForm()) {

        dispatch(postPaymentFormData(formData)).then((res) => {
          const orderId = res?.payload?.order?.id;
          if (orderId) {
            // Properly encode all URL parameters to prevent data corruption
            const params = new URLSearchParams({
              name: formData.username || '',
              phone: formData.mobileno || '',
              email: formData.email || '',
              seva: 'Mandir Nirmana Seva',
              address: formData.address || '',
              pan_number: formData.panno || '',
              send_confirmation_message_to_preacher: `${getSingleUser?.campaignDetails?.preacherName || ''} - ${getSingleUser?.campaignDetails?.phoneno || ''}`,
              campaignsid: id || '',
              preacher_name: getSingleUser?.campaignDetails?.preacherName || '',
              isanonymous: formData.isanonymous || false,
              campainerName: getSingleUser?.campaignDetails?.campaignName || ''
            });

              navigate(`/payment/${orderId}?${params.toString()}`);
          }
        });
      }
    };

  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true); // Set the state to indicate the image has failed to load
  };

//   const shareUrl = `https://campaigns.iskconmangalore.org/single/${id}`;

//   const handleShare = () => {
//     const message = `Check this out: ${shareUrl}`;
//     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
//     window.open(whatsappUrl, "_blank");
//   };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (getSingleUser.status === 404) {
    return <PageNotFound />
  }

  return (
    <Box
      w={"100%"}
      position={"relative"}
      overflow={paymentModel ? "hidden" : "auto"}
    >
      <Box display='flex' alignItems='center' position={"fixed"}
        zIndex={"10"}
        fontSize={"3rem"}
        cursor={"pointer"}
        bottom={"4%"}
        right={"2%"}>
        {/* Scroll to Top button */}
        {showScrollButton && (
          <IconButton
            icon={<FaArrowUp />}
            background={IskconBgColor}
            color={IskconFontColor}
            // colorScheme="teal"
            onClick={handleScrollToTop}
          />
        )}

        {/* <Box
          color={'green.400'}
          bgColor={"white"}
          borderRadius={"10px"}
          onClick={handleShare}
        >
          <FaSquareWhatsapp />
        </Box> */}
      </Box>


      {/* Loading */}
      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          position={"fixed"}
          w={"100%"}
          bgColor={"rgb(0,0,0,0.6)"}
          zIndex={10}
        >
          <DottedAnimation />
        </Box>
      )}

      {/* Payment Model */}
      {paymentModel && (
        <PaymentModal themeColor={themeColor} amount={amount} setPaymentModel={setPaymentModel} handleSubmit={handleSubmit} handleOnChange={handleOnChange} formData={formData} errors={errors} />
      )}
      {/* Header */}

      <DetailPageHeader
        themeColor={themeColor}
        getSingleUser={getSingleUser}
        image16={image16} />
      {/* Image and Amount Details */}

      <HStack
        w="100%"
        maxW="1200px"
        mx="auto"
        my="2rem"
        alignItems="stretch"
        spacing={["2rem", "2rem", "1rem", "2rem"]}
        flexDirection={["column", "column", "row"]}
        px={["", "", "1rem", "2rem", ""]}
      >
        <PhotoWithDescription getSingleUser={getSingleUser} imageError={imageError} handleImageError={handleImageError} />

        <CapaignerProgressBox
          getSingleUser={getSingleUser}
          setAmount={setAmount}
          handleClick={handleClick}
          errorMessage={errorMessage}
        />
      </HStack>

      <AdditionalDetails getSingleUser={getSingleUser} />


      <CampaignTabs tab={tab} setTab={setTab} />
      {tab === 1 ? (
        <CampaignMoreDetails
          campaign={campaign}
          getSingleUser={getSingleUser}
          themeColor={themeColor}
          handleImageError={handleImageError}
          avatar={avatar}
          imageError={imageError}
        />
      ) : (
        <Funders getSingleUser={getSingleUser} />
      )}
        <ProjectVedio />

      <Fotter />
    </Box>
  );
};

export default HomeSinglePage;
