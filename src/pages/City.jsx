import React, { useState, useEffect } from 'react';
import { ActivityProvider, useCitiesContext, useCategoriesContext } from './ActivityContext';
import { useParams, Link } from 'react-router-dom';
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
  Box, // ✅ Import Box to use as a container for each category
} from '@chakra-ui/react';

export const City = () => {
  const { cityList, setSelectedCity } = useCitiesContext();
  const { deleteCategory } = useCategoriesContext();
  const { cityName } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedCity(cityName);
  }, [cityName, setSelectedCity]);

  if (cityList.length === 0) {
    return <div>Loading...</div>;
  }

  const selectedCityData = cityList.find((city) => city.name === cityName);
  const categories = selectedCityData ? Object.keys(selectedCityData.categories) : [];
  const filteredCategories = categories.filter((categoryName) => categoryName.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDelete = (categoryName) => {
    setSelectedCategoryForDelete(categoryName);
    onOpen();
  };

  // ✅Function to determine the number of columns in SimpleGrid based on the number of categories
  const getColumnCount = () => {
    const categoryCount = filteredCategories.length;
    if (categoryCount === 1) return 1;
    if (categoryCount === 2) return 2;
    return 3;
  };

  return (
    <ActivityProvider>
      <Box width="100%" padding="4" textAlign="center">
        <Heading size="xl" mb="4">
          Activities to do in {cityName}
        </Heading>
        <Input placeholder="Search categories" onChange={(e) => setSearchQuery(e.target.value)} mb="4" width="50%" />
        <Link to={`/city/${cityName}/categories/categoryForm`}>
          <Button size="sm" mb="4" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
            Add an activity
          </Button>
        </Link>
        <SimpleGrid columns={getColumnCount()} spacing="4" width="100%">
          {' '}
          {/*// ✅🚩 using the getColumnCount function */}
          {filteredCategories.length > 0 &&
            filteredCategories.map((categoryName) => {
              const categoryDetailsArray = selectedCityData.categories[categoryName];
              return categoryDetailsArray.map((category) => (
                <Box key={category.id} borderWidth="1px" borderRadius="lg" overflow="hidden" bg="red.800">
                  <Link to={`/city/${cityName}/categories/${category.name}`}>
                    <Image src={category.image} alt={category.name} />
                    <Heading size="lg" mt="2" mb="2" color="white">
                      {category.name}
                    </Heading>
                  </Link>
                  <Flex direction="column" mt="1rem" align="center">
                    <Button
                      size="sm"
                      bg="red.600"
                      color="black"
                      _hover={{ bg: 'red', color: 'white' }}
                      mb="1rem"
                      onClick={() => handleDelete(category.name)}
                    >
                      Delete this category
                    </Button>
                    <Link to={`/city/${cityName}/categories/${categoryName}/editCategoryForm`}>
                      <Button size="sm" bg="red.600" mb="2rem" color="black" _hover={{ bg: 'red', color: 'white' }}>
                        Edit this Category
                      </Button>
                    </Link>
                  </Flex>
                </Box>
              ));
            })}
        </SimpleGrid>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Category</ModalHeader>
            <ModalCloseButton />
            <ModalBody>Are you sure you want to delete {selectedCategoryForDelete}?</ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteCategory(cityName, selectedCategoryForDelete);
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
      </Box>
    </ActivityProvider>
  );
};
