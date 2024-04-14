import { useState, useEffect } from 'react';
import { useActivityContext } from './ActivityContext';
import {
  Flex,
  Heading,
  Image,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  SimpleGrid, // ✅ Import SimpleGrid for responsive grid layout
  Box, // ✅ Import Box to use as a container
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const CityList = ({ searchQuery }) => {
  const { cityList, deleteCity, setSelectedCity } = useActivityContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCityForDelete, setSelectedCityForDelete] = useState(null);
  const [resizeFlag, setResizeFlag] = useState(false); // State to trigger re-render on window resize

  const handleDelete = (cityName) => {
    setSelectedCityForDelete(cityName);
    onOpen();
  };

  const filteredCities = cityList.filter((city) => city.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // ✅ 🐞FFunction to dynamically adjust column count based on viewport width and number of cities
  const getColumnCount = () => {
    const width = window.innerWidth; // Access viewport width
    const cityCount = filteredCities.length;

    if (width < 480) {
      // For very small devices
      return 1; // Always 1 column on very small screens
    } else if (width >= 480 && width < 768) {
      // For small devices
      return Math.min(2, cityCount); // Max of 2 columns or less if fewer cities
    } else if (width >= 768 && width < 992) {
      // For medium devices
      return Math.min(3, cityCount); // Max of 3 columns or less if fewer cities
    } else {
      return Math.min(4, cityCount); // Max of 4 columns or less if fewer cities on large screens
    }
  };

  // You need to update the component or force a rerender when the window size changes
  // This could be done using a resize event listener or a custom hook
  useEffect(() => {
    const handleResize = () => {
      // Force a rerender on resize
      setResizeFlag((prevFlag) => !prevFlag);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Flex align="center" textAlign="center" justifyContent="center" p="1rem">
        {/* <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="20px"> */}
        <SimpleGrid columns={getColumnCount()} spacing="20px">
          {/* <SimpleGrid columns={{ base: 1, sm:getColumnCount(), md: getColumnCount(), lg: getColumnCount() }} spacing="20px"> */}
          {filteredCities.map((city) => (
            <Box key={city.id} mb="2rem" borderWidth="1px" borderRadius="lg" bg="red.800" overflow="hidden">
              <Link to={`/city/${city.name}`} onClick={() => setSelectedCity(city.name)}>
                <Flex direction="column" align="center">
                  <Heading size="md" mb="1rem" mt="1rem" color="white">
                    {city.name} {city.countryCode}
                  </Heading>
                  {city.image && <Image src={city.image} alt={city.name} boxSize="300px" objectFit="cover" />}
                </Flex>
              </Link>
              <Flex direction="column" mt="1rem" align="center">
                <Button
                  size="sm"
                  mt="0.5rem"
                  bg="red.600"
                  color="black"
                  _hover={{ bg: 'red', color: 'white' }}
                  onClick={() => handleDelete(city.name)}
                >
                  Delete this city
                </Button>
                <Link to={`/city/${city.name}/editCityForm`}>
                  <Button size="sm" mt="0.5rem" mb="2rem" bg="red.600" color="black" _hover={{ bg: 'red', color: 'white' }} paddingX="4">
                    Edit this City
                  </Button>
                </Link>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete City</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete {selectedCityForDelete}?</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => {
                deleteCity(selectedCityForDelete);
                onClose();
              }}
            >
              Delete
            </Button>
            <Button ml="3" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const Cities = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Flex flexDir="column" align="center" justifyContent="center" alignItems="center" alignContent="center">
      <Box align="center" width={{ base: '60%', md: '60%' }} >
        <label htmlFor="city name">
          <Heading as="b" size="md">
            Search for a city:
          </Heading>
          <Input
            width={{ base: '80%', md: '50%' }}
            placeholder="Search cities"
        
            mt="1rem"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>

        <Link to="/cityForm/">
          <Button
            borderRadius="8"
            size="md"
            width={{ base: '70%', md: '50%' }}
            mt="2rem"
            mb="1rem"
            padding="1.5rem"
            bg="red.600"
            color="gray.200"
            _hover={{ bg: 'red', color: 'white' }}
          >
            Add a city
          </Button>
        </Link>
      </Box>

      <CityList searchQuery={searchQuery} />
    </Flex>
  );
};
