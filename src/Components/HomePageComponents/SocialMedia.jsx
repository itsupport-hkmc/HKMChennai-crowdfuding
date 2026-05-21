import { Box, VStack } from '@chakra-ui/react';
import React from 'react';
import { AiFillInstagram } from 'react-icons/ai';
import { FaSquareFacebook, FaSquareXTwitter } from 'react-icons/fa6';
import { IoLogoYoutube } from 'react-icons/io5';
import { MdEmail } from 'react-icons/md';
import { Link } from 'react-router-dom';

const SocialMedia = () => {
    return (
        <VStack bg='#ffffff' position={'fixed'} right={2} top={'40%'} fontSize={'2rem'} zIndex={20}>
            <Link to={'https://www.facebook.com/ISKCONBangaloreTemple'} target='blank'>
                <Box color={'#1877F2'} position={'relative'} _hover={{ right: '30%' }} transition='right 0.3s ease'>
                    <FaSquareFacebook />
                </Box>
            </Link>

            <Link to={'https://www.instagram.com/IskconBangaloreTemple/'} target='blank'>
                <Box color={'#d93f8f'} position={'relative'} _hover={{ right: '30%' }} transition='right 0.3s ease'>
                    <AiFillInstagram />
                </Box>
            </Link>

            <Link to={'https://twitter.com/iskconbangalore'} target='blank'>
                <Box position={'relative'} _hover={{ right: '30%' }} transition='right 0.3s ease'>
                    <FaSquareXTwitter />
                </Box>
            </Link>

            <Link to={'https://www.youtube.com/user/iskconworld'} target='blank'>
                <Box color={'#FF0000'} position={'relative'} _hover={{ right: '30%' }} transition='right 0.3s ease'>
                    <IoLogoYoutube />
                </Box>
            </Link>

            <a href="">
                <Box color={'#D93025'} position={'relative'} _hover={{ right: '30%' }} transition='right 0.3s ease'>
                    <MdEmail />
                </Box>
            </a>
        </VStack>
    );
};

export default SocialMedia;