import { Box, VStack } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const AdminNavbar = () => {
  return (
     <Box position={'fixed'} top={0} left={0} w={'20%'}  h={'100vh'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <VStack w={'100%'} gap={'1rem'}>
            <Link to={'admin/createcampaign'}>
             <Box bgColor={'rgba(163, 161, 161, 0.45)'} p={'1rem'} fontWeight={'bold'} borderRadius={'5px'} fontSize={'1.1rem'} cursor={'pointer'}>Create Campagin</Box>
            </Link>
             <Link to={'admin/campaignlist'}>
              <Box bgColor={'rgba(163, 161, 161, 0.45)'} p={'1rem'} fontWeight={'bold'} borderRadius={'5px'} fontSize={'1.1rem'} cursor={'pointer'}>All Campagin List</Box>
             </Link>
             <Link to={'admin/donorsList'}>
              <Box bgColor={'rgba(163, 161, 161, 0.45)'} p={'1rem'} fontWeight={'bold'} borderRadius={'5px'} fontSize={'1.1rem'} cursor={'pointer'}>Donors List</Box>
             </Link>
          </VStack>
     </Box>
  )
}

export default AdminNavbar
