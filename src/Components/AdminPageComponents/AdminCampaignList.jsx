import {
  Box,
  HStack,
  Image,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSingleUser,
  fetchUser,
} from "../../Redux/clientSlices/clientUsers";
import { BiSolidEditAlt } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoCloseCircle } from "react-icons/io5";
import DottedAnimation from "../DottedAnimation";
import { themeColor } from "../utils";

const AdminCampaignList = () => {
  const { isLoading,isError, getUsers, getSingleUser } = useSelector((state) => state.clientUsers);
  const dispatch = useDispatch();
  const [toggleModel, setModel] = useState(false);
  const [search,setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleModel = (id) => {
    if (id) {
      dispatch(fetchSingleUser(id));
      setModel(true);
    }
  };

  const filteredUsers = getUsers.campaignDetails?.filter((user) =>
       user?.campaignDetails ? user?.campaignName?.toLowerCase().includes(search.toLowerCase()) : user
    )


 if(isError){
  alert(isError)
 }

  return (
    <>
      {toggleModel && (
        <Box
          position={"absolute"}
          w={"100%"}
          h={"100vh"}
          bgColor={"rgb(0,0,0,0.8)"}
          zIndex={"10"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          overflow={"hidden"}
        >
         
          <Box
            bgColor={"white"}
            w={"40%"}
            borderRadius={"10px"}
            p={isLoading ? "0" : "1.5rem"}
            position={"relative"}
            boxShadow={"0px 4px 12px rgba(163, 156, 156, 0.1)"}
          >
             {isLoading && (
              <Box position={'absolute'} w={'100%'} h={'100%'} bgColor={'rgb(0,0,0,0.8)'} display={'flex'} justifyContent={'center'} alignItems={'center'} borderRadius={'10px'}>
                 <DottedAnimation />
              </Box>
             )}
            <Box
              fontSize={"2rem"}
              fontWeight={"semibold"}
              p={"1rem"}
              textAlign={"center"}
            >
              Campaign Details
            </Box>
            <Box
              position={"absolute"}
              right={"5"}
              top={"5"}
              fontSize={"1.5rem"}
              cursor={"pointer"}
              onClick={() => setModel(false)}
            >
              <IoCloseCircle />
            </Box>
            <Table variant="simple" width={"95%"} mx={"auto"}>
              <Tbody>
                <Tr>
                  {/* Left side - Heading */}
                  <Th>Campaign Name</Th>
                  {/* Right side - Data */}
                  <Td>{getSingleUser?.campaignDetails?.campaignName}</Td>
                </Tr>
                <Tr>
                  {/* Left side - Heading */}
                  <Th>Target Amount</Th>
                  {/* Right side - Data */}
                  <Td>{getSingleUser?.campaignDetails?.targetAmount}</Td>
                </Tr>
                <Tr>
                  {/* Left side - Heading */}
                  <Th>Start Date</Th>
                  {/* Right side - Data */}
                  <Td>{getSingleUser?.campaignDetails?.startdate.split("T")[0]}</Td>
                </Tr>
                <Tr>
                  {/* Left side - Heading */}
                  <Th>End Date</Th>
                  {/* Right side - Data */}
                  <Td>{getSingleUser?.campaignDetails?.enddate.split("T")[0]}</Td>
                </Tr>
                <Tr>
                  {/* Left side - Heading */}
                  <Th>Image</Th>
                  {/* Right side - Data */}
                  <Td>
                    <Image
                      src={getSingleUser?.campaignDetails?.imgurl}
                      alt="campaign-image"
                      boxSize="50px"
                      objectFit="cover"
                    />
                  </Td>
                </Tr>
                <Tr>
                  {/* Left side - Heading */}
                  <Th>Total Funders</Th>
                  {/* Right side - Data */}
                  <Td>{getSingleUser.totalfunders}</Td>
                </Tr>
                <Tr>
                  {/* Left side - Heading */}
                  <Th>Raise Fund</Th>
                  {/* Right side - Data */}
                  <Td>{getSingleUser?.raisedFund}</Td>
                </Tr>
                <Tr>
                  {/* Left side - Heading */}
                  <Th>Donors</Th>
                  {/* Right side - Data */}

                  <Td h={'150px'} overflow={'auto'}>
                    {getSingleUser?.Userlist?.length > 0 ? (
                      getSingleUser?.Userlist?.map((user) => (
                        <Box mt={'1rem'}>
                          <HStack>
                            <Box fontWeight={'semibold'}>Donor Name: </Box>
                            <Box>{user.username}</Box>
                          </HStack>
                          <HStack>
                            <Box fontWeight={'semibold'}>Amount: </Box>
                            <Box>{user.amount}</Box>
                          </HStack>
                        </Box>
                      ))
                    ) : (
                      <Box color={themeColor} fontWeight={"bold"}>
                        No Donors
                      </Box>
                    )}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Box>
      )}
      <Box w={"80%"} ml={"20%"} p={"1rem"} h={"100vh"}>
        <HStack mb={"1rem"} w={"100%"} justify={"space-between"}>
          <Box fontSize={"1.5rem"} fontWeight={"bold"}>
            All Campagin List
          </Box>
          <Box w={"20%"}>
            <Input
              border={"2px solid rgb(0,0,0,0.5)"}
              placeholder="Search with Campaign name"
              onChange={(e)=>setSearch(e.target.value)}
            />
          </Box>
        </HStack>
        <TableContainer w={"95%"} mx={"auto"}>
          <Table variant="simple" size="md" border={"1px solid black"}>
            <Thead>
              <Tr>
                <Th textAlign={"center"} border={"1px solid gray"}>
                  S.No
                </Th>
                <Th textAlign={"center"} border={"1px solid gray"}>
                  Campaign name
                </Th>
                <Th textAlign={"center"} border={"1px solid gray"}>
                  Target Amount
                </Th>
                <Th textAlign={"center"} border={"1px solid gray"}>
                  Total Funder Count
                </Th>
                <Th textAlign={"center"} border={"1px solid gray"}>
                  Total Raised Amount
                </Th>
                <Th textAlign={"center"} border={"1px solid gray"}>
                  Start Date
                </Th>
                <Th textAlign={"center"} border={"1px solid gray"}>
                  End Date
                </Th>
                <Th textAlign={"center"} border={"1px solid gray"}>
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers?.length > 0 &&
                filteredUsers?.map((user, index) => (
                  <Tr key={user?.campaignId}>
                    <Td textAlign={"center"} border={"1px solid gray"}>
                      {index + 1}.
                    </Td>
                    <Td textAlign={"center"} border={"1px solid gray"}>
                      {user?.campaignName}
                    </Td>
                    <Td textAlign={"center"} border={"1px solid gray"}>
                      {user?.targetamt}
                    </Td>
                    <Td textAlign={"center"} border={"1px solid gray"}>
                      {user?.totalFunderCount}
                    </Td>
                    <Td textAlign={"center"} border={"1px solid gray"}>
                      {user?.totalRaisedAmount}
                    </Td>
                    <Td textAlign={"center"} border={"1px solid gray"}>
                      {user?.startdate.split("T")[0]}
                    </Td>
                    <Td textAlign={"center"} border={"1px solid gray"}>
                      {user?.enddate.split("T")[0]}
                    </Td>
                    <Td textAlign={"center"} border={"1px solid gray"}>
                      <HStack w={"100%"} justifyContent={"space-around"}>
                        <Link to={`/admin/campaignedit/${user?.campaignId}`}>
                          <Box cursor={"pointer"}>
                            <BiSolidEditAlt />
                          </Box>
                        </Link>
                        <Box
                          cursor={"pointer"}
                          onClick={() => handleModel(user?.campaignId)}
                        >
                          <FaEye />
                        </Box>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default AdminCampaignList;
