import { useState } from 'react';
import { ActivityProvider, useCitiesContext } from './ActivityContext';
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
  Box, // ✅ Import Box to use as a grid item container
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const CityList = ({ searchQuery }) => {
  const { cityList, deleteCity, setSelectedCity } = useCitiesContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCityForDelete, setSelectedCityForDelete] = useState(null);

  const handleDelete = (cityName) => {
    setSelectedCityForDelete(cityName);
    onOpen();
  };

  const filteredCities = cityList.filter((city) => city.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="20px">
      {' '}
      {/*✅ Using SimpleGrid for responsive layout*/}
      {filteredCities.map(
        (
          city // 🟢 Use filteredCities for mapping
        ) => (
          <Box key={city.id} mb="2rem" borderWidth="1px" borderRadius="lg" bg="red.800" overflow="hidden">
            {' '}
            {/* ✅ Use Box instead of ListItem for grid items*/}
            <Link to={`/city/${city.name}`} onClick={() => setSelectedCity(city.name)}>
              <Flex direction="column" align="center">
                {' '}
                {/* ✅ Adjusted Flex direction for better layout*/}
                <Heading size="md" mb="1rem" mt="1rem" color="white">
                  {city.name} {city.countryCode}
                </Heading>
                {city.image && <Image src={city.image} alt={city.name} boxSize="300px" objectFit="cover" />}
              </Flex>
            </Link>
            <Flex direction="column" mt="1rem" align="center">
              <Button
                size="sm"
                // width="50%" // ✅ Use a percentage width for responsive sizing
                mt="0.5rem"
                bg="red.600"
                color="black"
                _hover={{ bg: 'red', color: 'white' }}
                onClick={() => handleDelete(city.name)}
              >
                Delete this city
              </Button>
              <Link to={`/city/${city.name}/editCityForm`}>
                <Button
                  size="sm"
                  // width="80%" // ✅ Use a percentage width for responsive sizing
                  mt="0.5rem"
                  mb="2rem"
                  bg="red.600"
                  color="black"
                  _hover={{ bg: 'red', color: 'white' }}
                  paddingX="4" // ✅ Add horizontal padding
                >
                  Edit this City
                </Button>
              </Link>
            </Flex>
          </Box>
        )
      )}
    </SimpleGrid>
  );
};

export const Cities = () => {
  const [searchQuery, setSearchQuery] = useState(''); // 🟢 State for search query

  return (
    <ActivityProvider>
      <Flex flexDir="column" align="center" width="full">
        <label htmlFor="city name">
          <Heading as="b" size="md">
            Search for a city:
          </Heading>
        </label>
        <Input
          width={{ base: '80%', md: '50%' }} // ✅ Responsive width for input
          placeholder="Search cities"
          ml="1rem"
          mt="1rem"
          onChange={(e) => setSearchQuery(e.target.value)} // 🟢 Update searchQuery based on user input
        />
        <Link to="/cityForm/">
          <Button
            borderRadius="8"
            size="md"
            width={{ base: '80%' }} //✅ Match the width with input above for consistency. READ NOTE BELLOW
            mt="2rem" //giving margin top
            mb="1rem"
            padding="1.5rem"
            bg="red.600"
            color="black"
            _hover={{ bg: 'red', color: 'white' }}
          >
            Add a city
          </Button>
        </Link>
        <CityList searchQuery={searchQuery} />
        {/* 🟢 Pass searchQuery to CityList*/}
      </Flex>
    </ActivityProvider>
  );
};

//---------NOTE ON COMMENTS ON JSX
/* In JSX, placing comments inside the curly braces {} works well when the comment is not inline with a prop. However, for inline comments (right after a prop), I should use the // syntax outside of the JSX curly braces to avoid syntax errors. */
