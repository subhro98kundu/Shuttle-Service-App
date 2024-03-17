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
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes, FaTaxi } from 'react-icons/fa'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState } from 'react'

import Register from './Register'
import ShuttleHomePage from './ShuttleHomePage'
import ShuttleListComponent from './ShuttleListComponent'
import TechParkSelection from './TechParkSelection'

let center = localStorage.getItem('center');


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pos, setPosition] = useState({lat: 0, lng: 0});
  const [posRefresher, setPosRefresher] = useState(true);
  const [loggedInShuttle, setLoggedInShuttle] = useState(false);
  const [allActiveShuttles, setAllActiveShuttles] = useState({})
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
    console.log(pos.lat, pos.lng);
    center = pos;
  } else {
    console.log("Geolocation is not available in your browser.");
  }
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  console.log('Re-rendering tracked shuttle number');
  const [trackedShuttleNumber, setTrackedVehicleNumber] = useState(localStorage.getItem('currSelection'));

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

  if(loggedInShuttle){
    return (<ShuttleHomePage  />)
  }
  if(!loggedIn){
    return (<Register loggedin={setLoggedIn} isShuttleLoggedIn={setLoggedInShuttle} />);
  }

  

  
  if (!isLoaded) {
    return <SkeletonText />
  }

  const trackShuttle = async (event) => {
    setInterval(async () => {
      
      let response = await fetch('http://localhost:5000/routes/activeshuttles');
      response = await response.json();
      console.log('Response',response);
      setAllActiveShuttles(response);
      setTrackedVehicleNumber(localStorage.getItem('currSelection'));
      let setTrackedVehicleNumber2 = localStorage.getItem('currSelection');
      console.log('Selected Shuttle: ', setTrackedVehicleNumber2);
      if(trackedShuttleNumber !== null){
        console.log(response);
        center = response[setTrackedVehicleNumber2];
        localStorage.setItem('center', center);
        console.log('Center: ', center)
        calculateRoute();
      }
    }, 5000)
  }

  

  async function calculateRoute() {
    console.log('CALCULATE ROUTE CALLOUT', center);
    // if (originRef.current.value === '' || destiantionRef.current.value === '') {
    //   return
    // }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: center,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white.800'
        shadow='base'
        zIndex='1'
      >
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1} hidden={true}>
            <Autocomplete>
              <Input type='text' placeholder='Origin' ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type='text'
                placeholder='Destination'
                ref={destiantionRef}
              />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={trackShuttle}>
              Find
            </Button>
            {/* <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            /> */}
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </HStack>
        <ShuttleListComponent allShuttles={allActiveShuttles} getCurrShuttle={setTrackedVehicleNumber}  />
        <TechParkSelection />
      </Box>
    </Flex>
  )
}

export default App
