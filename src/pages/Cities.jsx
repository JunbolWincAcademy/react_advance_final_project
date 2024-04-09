import React, { useState } from 'react';
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
  Box, // ✅ Import Box to use as a container
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
    <>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="20px">
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
              <Button size="sm" mt="0.5rem" bg="red.600" color="black" _hover={{ bg: 'red', color: 'white' }} onClick={() => handleDelete(city.name)}>
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
    <ActivityProvider>
      <Flex flexDir="column" align="center" width="full">
        <label htmlFor="city name">
          <Heading as="b" size="md">
            Search for a city:
          </Heading>
        </label>
        <Input width={{ base: '80%', md: '50%' }} placeholder="Search cities" ml="1rem" mt="1rem" onChange={(e) => setSearchQuery(e.target.value)} />
        <Link to="/cityForm/">
          <Button
            borderRadius="8"
            size="md"
            width={{ base: '80%' }}
            mt="2rem"
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
      </Flex>
    </ActivityProvider>
  );
};
