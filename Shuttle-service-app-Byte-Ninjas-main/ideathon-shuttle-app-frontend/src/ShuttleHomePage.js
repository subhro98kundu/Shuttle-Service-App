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
    Heading
  } from '@chakra-ui/react'
  import { FaLocationArrow, FaTimes, FaTaxi } from 'react-icons/fa'

  import { useRef, useState } from 'react'

  function ShuttleListComponent(props){
    const { isOpen, onToggle } = useDisclosure();
    const [active, setActive] = useState(false);
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
    const startTrip = ()=>{
        setActive(true);
        setInterval(()=>{
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(function (position) {
                  let currShuttleId = localStorage.getItem('loggedInShuttleNo');
                  let pos = {
                    shuttleid: currShuttleId,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                  if(!active){
                  let response = fetch('http://localhost:5000/routes/updateshuttlelocation', {
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
                    body: JSON.stringify(pos), // body data type must match "Content-Type" header
                  });
                }
                });
              } else {
                console.log("Geolocation is not available in your browser.");
              }
        }, 5000)
    }

    const endTrip = () => {
        setActive(false);
        // window.location.reload();
    }
  
    return (
      <Box>
        <div align='center'>
        <Heading mt={'30vh'} as='h3' size='xl' mb={10} >Shuttle: {localStorage.getItem('loggedInShuttleNo')}</Heading>
        <Box mb={4}>Status:{(active)? 'Live': 'Trip not started.'}</Box>

        <Button onClick={startTrip} disabled={active}>Start Trip</Button>
        <Button onClick={endTrip} disabled={!active}>End Trip</Button>
        </div>
      </Box>
    )
  }
export default ShuttleListComponent;