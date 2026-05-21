import { Box, FormLabel, Input, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  useParams } from "react-router-dom";
import { fetchSingleUser } from "../../Redux/clientSlices/clientUsers";
import { adminEditCampaign } from "../../Redux/adminSlice/adminSlice";

const AdminEdit = () => {
  const { id } = useParams();
//   const navigate = useNavigate();

  const [formData, setFormData] = useState({
    campaignname: "",
      targetamount: "",
      enddate:"",
      phoneno:"",
      imgurl: "",
      preachername: ""
  });

  const dispatch = useDispatch();
  const { getSingleUser } = useSelector(
    (state) => state.clientUsers
  );

  useEffect(()=>{
     dispatch(fetchSingleUser(id));
  },[dispatch,id])

  useEffect(()=>{
    if(getSingleUser?.campaignDetails){
        setFormData({
            campaignname:getSingleUser?.campaignDetails?.campaignName,
            targetamount:getSingleUser?.campaignDetails?.targetAmount,
            enddate:getSingleUser?.campaignDetails?.enddate,
            imgurl: getSingleUser?.campaignDetails?.imgurl,
            phoneno: getSingleUser?.campaignDetails?.phoneno,
            preachername:getSingleUser?.campaignDetails?.preachername
         })
    }
  },[getSingleUser])



  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(adminEditCampaign({id,formData}));
    // navigate('/admin/campaignlist')
  };

  return (
      <Box w={"75%"} ml={"25%"} p={"1rem"} h={"100vh"}>
        <Box fontSize={"1.5rem"} fontWeight={"bold"}>
          Edit Campaign
        </Box>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <VStack alignItems={"flex-start"}>
            <FormLabel>Campaign Name:</FormLabel>
            <Input
              border={"2px solid rgb(0,0,0,0.5)"}
              type="text"
              placeholder="Enter Campaign Name"
              name="campaignname"
              value={formData?.campaignname}
              onChange={handleChange}
            />
          </VStack>
          <VStack alignItems={"flex-start"}>
            <FormLabel>Target Amount:</FormLabel>
            <Input
              border={"2px solid rgb(0,0,0,0.5)"}
              type="number"
              placeholder="Enter Target Amount"
              name="targetamount"
              value={formData?.targetamount}
              onChange={handleChange}
            />
          </VStack>
          <VStack alignItems={"flex-start"}>
            <FormLabel>Campaign End Date:</FormLabel>
            <Input
              border={"2px solid rgb(0,0,0,0.5)"}
              type="date"
              placeholder="Enter Date"
              name="enddate"
              value={formData?.enddate}
              onChange={handleChange}
            />
          </VStack>
          <VStack alignItems={"flex-start"}>
            <FormLabel>Campaign Mobile No.:</FormLabel>
            <Input
              border={"2px solid rgb(0,0,0,0.5)"}
              type="tel"
              placeholder="Enter mobile number"
              name="phoneno"
              value={formData?.phoneno}
              onChange={handleChange}
            />
          </VStack>
          <VStack alignItems={"flex-start"}>
          <FormLabel>Campaign Image:</FormLabel>
            <Input
              type="text"
              placeholder="Enter Image Url"
              value={formData?.imgurl}
              name="imgurl"
              onChange={handleChange}
            />
          </VStack>
          <VStack alignItems={"flex-start"}>
          <FormLabel>Preacher Name:</FormLabel>
            <Input
              type="text"
              placeholder="Enter Preacher Name"
              value={formData?.preachername}
              name="preachername"
              onChange={handleChange}
            />
          </VStack>
          <Input
            type="submit"
            value={"Edit Campaign"}
            mx={"auto"}
            w={"auto"}
            bgColor={"green.400"}
            fontWeight={"bold"}
            color={"white"}
            cursor={"pointer"}
          />
        </form>
      </Box>
  );
};

export default AdminEdit;
