import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h1" fontSize="6xl" fontWeight="bold" color="red.500">
        404
      </Heading>
      <Text fontSize="xl" mt={4} color="gray.600">
        Oops! The page you're looking for doesn't exist.
      </Text>
      <VStack mt={6}>
        <Button colorScheme="blue" onClick={() => navigate("/")}>
          Go Back Home
        </Button>
      </VStack>
    </Box>
  );
};

export default PageNotFound;
