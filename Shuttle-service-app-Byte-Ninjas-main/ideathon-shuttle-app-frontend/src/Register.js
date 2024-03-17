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
  import ShuttleLogin from './ShuttleLogin'

function Register(props){
    const toast = useToast();
    const [register, setRegister] = useState(true);
    /** @type React.MutableRefObject<HTMLInputElement> */
    const fNameRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const lNameRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const emailRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const passwordRef = useRef();
    const loginRegisterToggle = event => {
        setRegister(!register)
    }
    const [isShuttleLogin, setIsShuttleLogin] = useState(false)
    const toggleToShuttleLogin = event => {
        setIsShuttleLogin(true);
    }
    const registerUser = async (event) => {
        if(fNameRef.current.value.length === 0 || lNameRef.current.value.length === 0 || emailRef.current.value.length === 0 || passwordRef.current.value.length === 0)
        {
            toast({
            title: 'All fields are required',
            description: "Please enter valid details to register",
            status: 'error',
            duration: 9000,
            isClosable: true,
            });
            return;
        }
        const userEnteredData = {
            fname: fNameRef.current.value,
            lname: lNameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        const response = await fetch('http://localhost:5000/routes/register/', {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              mode: "cors", // no-cors, *cors, same-origin
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              credentials: "same-origin", // include, *same-origin, omit
              headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              redirect: "follow", // manual, *follow, error
              referrerPolicy: "unsafe-url", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              body: JSON.stringify(userEnteredData), // body data type must match "Content-Type" header
            });
        const success = await response.json()
        if(success){
            setRegister(false);
            toast({
                title: 'User Registered. Please Log In to continue.',
                description: "We've created your account for you.",
                status: 'success',
                duration: 9000,
                isClosable: true,
              });
        }
        else
            toast({
                title: 'Failed to Register User. Please try again.',
                description: "We've failed created your account for you.",
                status: 'error',
                duration: 9000,
                isClosable: true,
              });

    }
    const updateLogInStatus = async (event) => {
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
            fname: fNameRef.current.value,
            lname: lNameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        const response = await fetch('http://localhost:5000/routes/login/', {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              mode: "cors", // no-cors, *cors, same-origin
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              credentials: "same-origin", // include, *same-origin, omit
              headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              redirect: "follow", // manual, *follow, error
              referrerPolicy: "origin", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              body: JSON.stringify(userEnteredData), // body data type must match "Content-Type" header
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
                props.loggedin(true);
        }else{
            toast({
                title: 'Failed to login',
                description: "Try again with valid details",
                status: 'error',
                duration: 9000,
                isClosable: true,
                });
        }
    }

    if(isShuttleLogin){
        return (<ShuttleLogin isloggedin={props.isShuttleLoggedIn} />)
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
        <Heading as='h3' size='xl' mb={10} >Register</Heading>
        {/* <HStack spacing={2} justifyContent='space-around'> */}
          <Box mb={10} >
              <Input type='text' placeholder='Email' ref={emailRef} required={true} />
          </Box>
          <Box mb={10} >
              <Input type='text' placeholder='First Name' hidden={!register} ref={fNameRef} required={true} />
          </Box>
          <Box mb={10} >
              <Input type='text' placeholder='Last Name' hidden={!register} ref={lNameRef} />
          </Box>
          <Box mb={10} >
              <Input type='password' placeholder='Password' ref={passwordRef} />
          </Box>


            <Button colorScheme='pink' mb={5} type='submit' style={{'min-width': '100%'}} hidden={!register} onClick={registerUser} >
              Register
            </Button>
            <Button colorScheme='gray' mb={3} type='submit' style={{'min-width': '100%'}} hidden={!register} onClick={loginRegisterToggle} >
              Proceed to Login
            </Button>
            <Button colorScheme='pink' mb={5} type='submit' style={{'min-width': '100%'}} hidden={register} onClick={updateLogInStatus} >
              Login
            </Button>
            <Button colorScheme='gray' mb={3} type='submit' style={{'min-width': '100%'}} hidden={register} onClick={loginRegisterToggle} >
              Proceed to Register
            </Button>
            <Button colorScheme='gray' type='submit' style={{'min-width': '100%'}} onClick={toggleToShuttleLogin} >
              Login as Shuttle
            </Button>
        {/* </HStack> */}
        <HStack spacing={4} mt={4} justifyContent='space-between'>
        </HStack>
      </Box>
      </div>
    )
}
export default Register;