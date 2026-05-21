import {
    Box,
    HStack,
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
//   import DottedAnimation from "../DottedAnimation";
import { fetchDonorsList } from "../../Redux/adminSlice/adminSlice";
  
  const AdminDonorsList = () => {
    const { isError, donorsList } = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    const [search,setSearch] = useState("");
  
    useEffect(() => {
      dispatch(fetchDonorsList());
    }, [dispatch]);
  

  
    const filteredUsers = search
    ? donorsList?.filter((user) =>
        user?.username?.toLowerCase().includes(search.toLowerCase()) ||
        user?.mobileno?.toLowerCase().includes(search.toLowerCase())
      )
    : donorsList;
  
  if(isError){
    alert(isError)
  }
  
    return (
      <>
     
        <Box w={"80%"} ml={"20%"} p={"1rem"} h={"100vh"}>
          <HStack mb={"1rem"} w={"100%"} justify={"space-between"}>
            <Box fontSize={"1.5rem"} fontWeight={"bold"}>
              All Donors List
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
                    User Name
                  </Th>
                  <Th textAlign={"center"} border={"1px solid gray"}>
                    Nationality
                  </Th>
                  <Th textAlign={"center"} border={"1px solid gray"}>
                    Country
                  </Th>
                  <Th textAlign={"center"} border={"1px solid gray"}>
                    State
                  </Th>
                  <Th textAlign={"center"} border={"1px solid gray"}>
                    City
                  </Th>
                  <Th textAlign={"center"} border={"1px solid gray"}>
                    Address
                  </Th>
                  <Th textAlign={"center"} border={"1px solid gray"}>
                    Pincode
                  </Th>
                  <Th textAlign={"center"} border={"1px solid gray"}>
                    Email
                  </Th>
                  <Th textAlign={"center"} border={"1px solid gray"}>
                    Phone No
                  </Th>
                  <Th textAlign={"center"} border={"1px solid gray"}>
                    Pan No
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
                        {user?.username}
                      </Td>
                      <Td textAlign={"center"} border={"1px solid gray"}>
                        {user?.nationality}
                      </Td>
                      <Td textAlign={"center"} border={"1px solid gray"}>
                        {user?.country}
                      </Td>
                      <Td textAlign={"center"} border={"1px solid gray"}>
                        {user?.state}
                      </Td>
                      <Td textAlign={"center"} border={"1px solid gray"}>
                        {user?.city}
                      </Td>
                      <Td textAlign={"center"} border={"1px solid gray"}>
                        {user?.address}
                      </Td>
                      <Td textAlign={"center"} border={"1px solid gray"}>
                        {user?.pincode}
                      </Td>
                      <Td textAlign={"center"} border={"1px solid gray"}>
                        {user?.email}
                      </Td>
                      <Td textAlign={"center"} border={"1px solid gray"}>
                        {user?.mobileno}
                      </Td>
                      <Td textAlign={"center"} border={"1px solid gray"}>
                        {user?.panno}
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
  
  export default AdminDonorsList;
  