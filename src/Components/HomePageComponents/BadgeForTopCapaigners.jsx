import React from 'react';
import { Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBadge = motion(Badge);

const BadgeForTopCampaigners = ({ name }) => {
    return (
        <MotionBadge 
            fontSize='15px'  
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            position="absolute"
            top={2}
            right={1} 
            // colorScheme='red'
            color="#444444"
        >
            {name}
        </MotionBadge>
    );
};

export default BadgeForTopCampaigners;