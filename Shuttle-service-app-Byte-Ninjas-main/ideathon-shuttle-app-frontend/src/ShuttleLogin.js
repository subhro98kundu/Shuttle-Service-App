import {
    Box,
    Button,
    ButtonGroup,
    Center,
    Flex,
    HStack,
    Heading,
    IconButton,
    Input,
    SkeletonText,
    Text,
    baseStyle,
    useToast
  } from '@chakra-ui/react'
  import { FaLocationArrow, FaTimes } from 'react-icons/fa'
  
  import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
  } from '@react-google-maps/api'
  import { useRef, useState } from 'react'

function ShuttleLogin(props){
    const toast = useToast();
    const [register, setRegister] = useState(true);
    /** @type React.MutableRefObject<HTMLInputElement> */
    const emailRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const passwordRef = useRef();
    const loginRegisterToggle = event => {
        setRegister(!register)
    }
    const updateLogInStatus = async (event) => {
        // props.isloggedin(true);
        // return;
        if(emailRef.current.value.length === 0 || passwordRef.current.value.length === 0)
        {
            toast({
            title: 'All fields are required',
            description: "Please enter valid details to login",
            status: 'error',
            duration: 9000,
            isClosable: true,
            });
            return;
        }
        const userEnteredData = {
            vehiclename: emailRef.current.value,
            password: passwordRef.current.value
        }
        const response = await fetch('http://localhost:5000/routes/loginshuttle/', {
              method: "POST", 
              mode: "cors", 
              cache: "no-cache", 
              credentials: "same-origin", 
              headers: {
                "Content-Type": "application/json",
              },
              redirect: "follow", 
              referrerPolicy: "origin", 
              body: JSON.stringify(userEnteredData), 
            });
        const success = await response.json()
        if(success.success){
            toast({
                title: 'Successfully logged in.',
                description: "Enter Pick-up spot for the shuttle for tracking",
                status: 'success',
                duration: 9000,
                isClosable: true,
                });
                localStorage.setItem('loggedInShuttleNo', emailRef.current.value);
                props.isloggedin(true);
        }else{
            toast({
                title: 'Failed to login',
                description: success.error,
                status: 'error',
                duration: 9000,
                isClosable: true,
                });
        }
    }
    
    return(
        // <Box position='absolute' left={0} right={0}>
        //     Register Screen
        // </Box>
        <div align={'center'} style={{backgroundColor: '#224', minHeight: '100vh', minWidth: '100vw', position: 'absolute', top: 0}} >
          <Box><Heading as='h3' size='xl' mt={20} textColor={'white'} >Transit Pal</Heading></Box>
        <Box
        p={10}
        pt={20}
        borderRadius='lg'
        mt={150}
        bgColor='white'
        shadow='base'
        zIndex='1'
        h={'100vh'}
        w={{base: '100vw', md: '500px', lg: '500px'}}
      >
        <Heading as='h3' size='xl' mb={10} >Shuttle Login</Heading>
        {/* <HStack spacing={2} justifyContent='space-around'> */}
          <Box mb={10} >
              <Input type='text' placeholder='Vehicle No.' ref={emailRef} required={true} />
          </Box>
          <Box mb={10} >
              <Input type='password' placeholder='Password' ref={passwordRef} />
          </Box>

            <Button colorScheme='pink' mb={5} type='submit' style={{'min-width': '100%'}} onClick={updateLogInStatus} >
              Login
            </Button>
            
        {/* </HStack> */}
        <HStack spacing={4} mt={4} justifyContent='space-between'>
        </HStack>
      </Box>
      </div>
    )
}
export default ShuttleLogin;