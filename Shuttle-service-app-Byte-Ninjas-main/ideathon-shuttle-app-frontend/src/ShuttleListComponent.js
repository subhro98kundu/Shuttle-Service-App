import {
    Box,
    Button,
    ButtonGroup,
    Center,
    Flex,
    HStack,
    IconButton,
    Input,
    SkeletonText,
    Text,
    Slide,
    useDisclosure,
    VStack,
    StackDivider
  } from '@chakra-ui/react'
  import { FaLocationArrow, FaTaxi, FaTimes } from 'react-icons/fa'

  import { useRef, useState } from 'react'

  function ShuttleListComponent(props){
    const { isOpen, onToggle } = useDisclosure();

    let allShuttlesList = []

    for(let key in props.allShuttles){
        let currShuttle = props.allShuttles[key];
        currShuttle['number'] = key;
        allShuttlesList.push(currShuttle);
    }
    const handleShuttleSelectionChange = (event) => {
        console.log(event.target.value, allShuttlesList[event.target.value].number);
        localStorage.setItem('currSelection', allShuttlesList[event.target.value].number)
        // props.getCurrShuttle(allShuttlesList[event.target.value].number);
        
        localStorage.setItem('currSelection', allShuttlesList[event.target.value].number)
    }
    const shuttleList = allShuttlesList.map((shuttle, index) => {
            return (<Button minWidth={'100%'} value={index} h='40px' p={2} bg='rgb(200, 0, 167)' onClick={handleShuttleSelectionChange} >Shuttle: {shuttle['number']}</Button>);
        });
  
    return (
      <>
        <IconButton icon={<FaTaxi />} position={'absolute'} bottom={'2rem'} right={'1rem'} style={{ zIndex: 1000 }} onClick={onToggle}>Click Me</IconButton>
        <Slide direction='bottom' in={isOpen} style={{ zIndex: 10 }}>
          <Box
            p='40px'
            color='white'
            mt='4'
            bg='pink.500'
            rounded='md'
            shadow='md'
          >
            <VStack
                divider={<StackDivider borderColor='gray.200' />}
                spacing={4}
                align='stretch'
                >
                {shuttleList}
            </VStack>
          </Box>
        </Slide>
      </>
    )
  }
export default ShuttleListComponent;