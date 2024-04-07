import React from 'react';
import { useState } from 'react';
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
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const CityList = () => {
  const { cityList, deleteCity, selectedCity, setSelectedCity } = useCitiesContext(); // Consuming the context to get the cityList and setSelectedCity
  const { isOpen, onOpen, onClose } = useDisclosure(); // ✅ Track city selected for deletion
  /* `useDisclosure` is a custom hook provided by Chakra UI for handling open-close states of overlays like modals or drawers.
It returns an object with the following properties:
isOpen: A boolean state indicating if the modal/drawer is open or closed.
onOpen: A function that sets `isOpen` to true, used to open the modal/drawer.
 onClose: A function that sets `isOpen` to false, used to close the modal/drawer. */
  const [selectedCityForDelete, setSelectedCityForDelete] = useState(null); // ✅ Track city selected for deletion

  // ✅ Handle opening the modal and setting the city to be deleted
  const handleDelete = (cityName) => {
    // cityName will be replace by city.name down on 54
    setSelectedCityForDelete(cityName);
    onOpen();
  };

  return (
    <UnorderedList listStyleType="none">
      {cityList.map((city) => (
        <ListItem key={city.id} mb="2rem">
          <Link
            to={`/city/${city.name}`}
            onClick={() => {
              setSelectedCity(city.name); // Update the selectedCity state with the clicked city's name
            }}
          >
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
            onClick={() => handleDelete(city.name)} // ✅ Trigger the modal for delete confirmation
          >
            Delete this city
          </Button>
          <Link
            to={`/city/${city.name}/editCityForm`}
            size="sm"
            width="100%"
            mt="0.5rem"
            bg="red.300"
            color="black"
            _hover={{ bg: 'red', color: 'white' }}
          >
            <Button size="sm" width="100%" mt="0.5rem" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
              Edit this City
            </Button>
          </Link>
        </ListItem>
      ))}

      {/* ✅ Modal for delete confirmation */}
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
  return (
    <ActivityProvider>
      <Flex flexDir="column">
        <Flex flexDir="column" className="App" align="center">
          <Link to={`/cityForm/`}>
            <Button borderRadius="8" size="sm" width="100%" mt="2rem" mb="1rem" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
              Add a city
            </Button>
          </Link>
          <Flex flexDir="column" width="100%" align="center">
            <CityList />
          </Flex>
        </Flex>
      </Flex>
    </ActivityProvider>
  );
};
