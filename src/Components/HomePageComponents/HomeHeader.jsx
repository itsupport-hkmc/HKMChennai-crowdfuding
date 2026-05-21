import React from 'react'
import { Box, Img, VStack } from "@chakra-ui/react"

const HomeHeader = () => {
  return (
    <Box style={{backgroundImage:"url(https://fadcdn.s3.amazonaws.com/assets/img/prof-bg.png)"}} w={'98%'} mt={'10px'} borderRadius={'xl'} overflow={'hidden'} mx={'auto'} h={['400px','450px']} bgSize={'cover'} bgPosition={'center'} bgRepeat={'no-repeat'} display={"flex"} alignItems={'center'} justifyContent={'center'}>
        <VStack gap={'1rem'}>
             <Box w={'200px'} h={'200px'} overflow={'hidden'} borderRadius={"50%"}>
                <Img w={'100%'} h={'100%'} objectFit={'cover'}  src='https://fadcdn.s3.ap-south-1.amazonaws.com/media/organization/logo_ISKCON.png' alt='icon' />
             </Box>
             <Box fontWeight={'extrabold'} textColor={'white'}>ISKCON Mangalore - Govardhan Hills</Box>
        </VStack>
    </Box>
  )
}

export default HomeHeader
