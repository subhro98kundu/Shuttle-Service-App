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
    StackDivider,
    Radio,
    RadioGroup
  } from '@chakra-ui/react'
  import { FaLocationArrow, FaTree, FaTimes } from 'react-icons/fa'

  import { useRef, useState } from 'react'

  function TechParkSelection(props){
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
        <IconButton icon={<FaTree />} position={'absolute'} bottom={'2rem'} left={'1rem'} style={{ zIndex: 2000 }} onClick={onToggle}>Click Me</IconButton>
        <Slide direction='bottom' in={isOpen} style={{ zIndex: 20 }}>
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
                    <RadioGroup>
                    <Box p={10}><Radio mr={5} aria-label={'Manyata Tech Park'} ></Radio>Manyata Tech Park</Box>
                    <Box p={10}><Radio mr={5} aria-label={'Manyata Tech Park'} ></Radio>EGL Tech Park</Box>
                    <Box p={10}><Radio mr={5} aria-label={'Manyata Tech Park'} ></Radio>Bagmane Tech Park</Box>
                    </RadioGroup>
            </VStack>
          </Box>
        </Slide>
      </>
    )
  }
export default TechParkSelection;