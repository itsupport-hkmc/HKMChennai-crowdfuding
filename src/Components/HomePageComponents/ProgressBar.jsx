import { Box } from '@chakra-ui/react'
 import React, { useEffect, useState } from 'react'

import { IskconProgressColor } from "../utils.jsx";

const ProgressBar = ({ currentAmount, goalAmount }) => {

  const [bar, setBar] = useState(null);
  const [pointerPosition, setPointerPosition] = useState(0);
  console.log(pointerPosition);
  useEffect(() => {
    const proBar = () => {
      if (currentAmount > goalAmount) {
        return setBar("100%");
      }
      if (goalAmount > 0) {
        const percentage = Math.min(((Number(currentAmount) / Number(goalAmount)) * 100), 100);
        setBar(percentage)
        return percentage
      }
      return 0;
    }

    const barPercentage = proBar();
    setPointerPosition(barPercentage); // Set the pointer position dynamically

  }, [currentAmount, goalAmount]);

  return (
    <Box
      w="100%"
      bgColor="gray.200"  // Set background to a lighter gray
      h="15px"  // Increase height for better visibility
      borderRadius="30px"
      my="1rem"
      overflow="hidden"
      position="relative"
      boxShadow="md"  // Add shadow for better visual effect
        >
          <Box
            w={`${bar}%`}
            h="100%"
            bgColor={IskconProgressColor}//"#e3c44e"  // Change progress color to a darker teal
        transition="width 0.5s ease-in-out"
        willChange="width"
        borderRadius="inherit"  // Ensure the progress bar has rounded corners
      >
      </Box>
   
    </Box>
  )
}

export default ProgressBar
