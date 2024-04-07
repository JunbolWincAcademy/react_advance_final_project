import React, { useState } from 'react';
import { ActivityProvider, useCitiesContext } from './ActivityContext';
import {
  Flex,
  Heading,
  UnorderedList,
  ListItem,
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
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const CityList = ({ searchQuery }) => {
  // 🟢 Accept searchQuery as prop
  const { cityList, deleteCity, setSelectedCity } = useCitiesContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCityForDelete, setSelectedCityForDelete] = useState(null);

  const handleDelete = (cityName) => {
    setSelectedCityForDelete(cityName);
    onOpen();
  };

  // 🟢 Filter cities based on search query
  const filteredCities = cityList.filter((city) => city.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <UnorderedList listStyleType="none">
      {filteredCities.map(
        (
          city // 🟢 Use filteredCities for mapping
        ) => (
          <ListItem key={city.id} mb="2rem">
            <Link to={`/city/${city.name}`} onClick={() => setSelectedCity(city.name)}>
              <Heading size="md" mb="1rem">
                {city.name}
              </Heading>
              {city.image && <Image src={city.image} alt={city.name} style={{ width: '300px', height: 'auto' }} />}
            </Link>
            <Button
              size="sm"
              width="100%"
              mt="0.5rem"
              bg="red.300"
              color="black"
              _hover={{ bg: 'red', color: 'white' }}
              onClick={() => handleDelete(city.name)}
            >
              Delete this city
            </Button>
            <Link to={`/city/${city.name}/editCityForm`}>
              <Button size="sm" width="100%" mt="0.5rem" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
                Edit this City
              </Button>
            </Link>
          </ListItem>
        )
      )}

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
            <Button ml={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </UnorderedList>
  );
};

export const Cities = () => {
  const [searchQuery, setSearchQuery] = useState(''); // 🟢 State for search query

  return (
    <ActivityProvider>
      <Flex flexDir="column" align="center">
        <label htmlFor="city name">
          <Heading as="b" size="md">
            Search for a city:
          </Heading>
        </label>
        <Input
          width="50%"
          placeholder="Search cities"
          mb="1rem"
          ml="1rem"
          mt="1rem"
          onChange={(e) => setSearchQuery(e.target.value)} // 🟢 Update searchQuery based on user input
        />
        <Link to="/cityForm/">
          <Button borderRadius="8" size="sm" width="100%" mt="2rem" mb="1rem" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
            Add a city
          </Button>
        </Link>
        <CityList searchQuery={searchQuery} /> {/*// 🟢 Pass searchQuery to CityList*/}
      </Flex>
    </ActivityProvider>
  );
};
