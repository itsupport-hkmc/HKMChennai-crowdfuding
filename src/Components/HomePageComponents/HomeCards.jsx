import {
  Badge,
  Box,
  Card,
  CardBody,
  CardFooter,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import ProgressBar from "./ProgressBar";
import { Link } from "react-router-dom";
import DottedAnimation from "../DottedAnimation";
import { calculatePercentage, formatCurrency, getDaysDifference, themeColor } from "../utils";
import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce, fetchAllCampaigners } from "../../utils/apiCall";
import BadgeForTopCampaigners from "./BadgeForTopCapaigners";
import { donorTitles } from "../../constants/homePage";
import { IskconBgColor } from "../utils.jsx";

const HomeCards = ({
  isLoading,
  isError,
  campaigns,
  fetchMoreData,
  hasMore,
  setSearchQuery,
  searchQuery,
  filteredSearch,
  totalCampaigners,
  setAllCampaigners,
  allCampaignersLength,
  setIsLoading
}) => {

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (isError) {
    alert(isError);
  }

  const handleSearchChange = debounce(async (e) => {
    const query = e.target?.value || '';
    setSearchQuery(query.trim());
  }, 300);

  return (
    <Box
      mx="auto"
      minW={'100%'}
      p={["0.3rem", "0.5rem", "1rem", "1.5rem"]}
      borderRadius="10px"
      maxW="1200px"
      bg="white"
      boxShadow="lg"
      mb={'10px'}
      minH={'30vh'}

    >
      <Box w="100%">
        <Box mx="auto" textAlign="center" mb={1} mt={3} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <HStack justifyContent="center" fontWeight="900" color={IskconBgColor} fontSize={["0.7rem", "1rem", "1.6rem", "1.8rem"]}>
            <Box marginLeft={"12px"}>CAMPAIGNERS JOINED:</Box>
            <Box>
              {totalCampaigners}
            </Box>
          </HStack>
          <Input
            w={['150px', '150px', '200px', '250px']}
            h={['30px', '40px', '40px', '40px']}
            type="text"
            marginRight={"12px"}
            placeholder="Search campaigners"
            fontSize={["0.9rem", "1rem", "1.2rem", "1.2em"]}
            style={{
              padding: "0.5rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginTop: ["1rem", "1rem", "0", "0"]
            }}
            onChange={handleSearchChange}
            onFocus={async () => {
              if (allCampaignersLength) return;
              try {
                setIsLoading(true);
                const data = await fetchAllCampaigners();
                setAllCampaigners(data);
              } catch (error) {
                console.error("Error fetching campaigners:", error);
              } finally {
                setIsLoading(false);
              }

            }}
          />
        </Box>
        {campaigns?.length > 0 ? (
          <InfiniteScroll
            dataLength={campaigns.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={searchQuery ? '' :
              <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                <DottedAnimation />
                <Box ml={4} fontSize="1.2rem" color="gray.600">Loading more campaigners...</Box>
              </Box>
            }
          >
            <SimpleGrid
              columns={[1, 1, 2, 2, 3, 4]}
              spacing={[2, 2, 2, 2, 2]}
              w="100%"
              mx="auto"
              p="10px"
            >
              {filteredSearch(campaigns, searchQuery)?.map((user, i) => (
                <Link key={user.campaignId} to={`/single/${user.campaignId}`}>
                  <Card border={'2px solid #444444'} w="100%" overflow="hidden" h="100%" boxShadow="md" borderRadius="14px">
                    <Box w="100%" h={["250px", "250px", "250px", "300px", "250px"]} position='relative' >
                      <Image
                        w="100%"
                        h="100%"
                        src={user?.imgurl}
                        alt={user?.campaignName}
                        objectFit="cover"
                        borderTopRadius="10px"
                      />
                      {!searchQuery && <>
                        <BadgeForTopCampaigners name={donorTitles[i]} />

                        {(i + 1) <= 50 && <Badge
                          colorScheme='green'
                          bg='transparent'
                          fontSize='100px'
                          position='absolute'
                          top={'-22px'}
                          marginLeft={'8px'}
                          left={0}
                          p={0}
                          display='flex'
                          justifyContent='flex-start'
                          alignItems='flex-start'
                          opacity={0.3}
                          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.1, 1] }}
                        >
                          {i + 1}
                        </Badge>}
                      </>}
                    </Box>
                    <CardBody bg="gray.100" px="7px">
                      <Text fontSize="1.1rem"  fontWeight="700" mb={2} color="gray.700">
                        {user.campaignName.toUpperCase()}'S Campaign to build a
                        magnificent {' '}
                        <span style={{ color: '#6A1B9A' }}>
                            Dakshina Dwaraka Dham - The cultural complex to preserve and promote Indian heritage
                          </span>{' '}
                        in Chennai, Tamil Nadu.
                      </Text>
                      <Text fontSize="0.9rem" mb={2} color="gray.600">{user.desc}</Text>
                      <HStack fontSize="0.8rem" py="0.5rem" color="gray.500">
                        <Box color="red.500">Hare Krishna Movement Chennai</Box>{" "}
                        <Box>|</Box>
                        <HStack>
                          <Box color="red.500">
                            <FaLocationDot />
                          </Box>
                          <Box>Thiruvanmiyur</Box>
                        </HStack>
                      </HStack>

                    </CardBody>
                    <CardFooter
                      // bgColor="teal.600"
                      bgColor={IskconBgColor}
                      display="flex"
                      flexDirection="column"
                      py="5px"
                      px="8px"
                      borderBottomRadius="10px"
                    >
                      <HStack
                        color="white"
                        fontWeight="700"
                        justifyContent="space-between"
                        w="100%"
                      >
                        <Box>{formatCurrency(user?.totalRaisedAmount)}</Box>
                        <Box>{formatCurrency(user?.targetamt)}</Box>
                      </HStack>
                      <ProgressBar
                        currentAmount={user?.totalRaisedAmount}
                        goalAmount={user?.targetamt}
                      />
                      <HStack
                        color="white"
                        fontWeight="700"
                        justifyContent="space-between"
                        w="100%"
                      >
                        <Box>{calculatePercentage(user?.targetamt, user?.totalRaisedAmount)}%</Box>
                        <Box color="#d481f0" fontWeight={900} fontSize={"20px"}>{calculatePercentage(user?.targetamt, user?.totalRaisedAmount) >= 100 ? "Goal Achieved!" : (calculatePercentage(user?.targetamt, user?.totalRaisedAmount) >= 80 ? "Almost there!" : "") }</Box>
                        <Box>{getDaysDifference(user?.enddate.split("T")[0])} Days LEFT</Box>
                      </HStack>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </SimpleGrid>
          </InfiniteScroll>
        ) : (
          <Box
            position="absolute"
            top="559px"
            left="50%"
            transform="translate(-50%, -50%)"
            textAlign="center"
            w="100%"
            fontWeight="bold"
            fontSize="1.1rem"
            color={themeColor}
          >
            No Users Found
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomeCards;
