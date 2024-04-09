import React, { useState, useEffect } from 'react';
import { ActivityProvider, useCitiesContext, useCategoriesContext } from './ActivityContext';
import { useParams, Link } from 'react-router-dom';
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
  Input, // 🟢 Import Input for search field
} from '@chakra-ui/react';

export const City = () => {
  const { cityList, setSelectedCity } = useCitiesContext();
  const { deleteCategory } = useCategoriesContext();
  const { cityName } = useParams(); // Extracting the city name from the URL
  const { isOpen, onOpen, onClose } = useDisclosure(); // ✅ useDisclosure hook manages the state for opening and closing the modal
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState(null); // ✅ Track category selected for deletion
  const [searchQuery, setSearchQuery] = useState(''); // 🟢 State for the search query

  useEffect(() => {
    setSelectedCity(cityName); //🚩this is the right place to this inside a useEffect
    // This will now only run when componentName changes, not on every render
  }, [cityName, setSelectedCity]);

  if (cityList.length === 0) {
    //this was the solution for the asynchronous issue fo cityList been undefined when needed there was a BIG 🐞 here
    // Render a loading indicator or return null while data is being fetched fixed that
    return <div>Loading...</div>;
  }
  // Find the selected city data from the cityList
  //setSelectedCity(cityName); //❌🚩THIS WAS MY SOLUTION but I put in the wrong place causing a SIDE EFFECT???❓
  // Assuming categories is an object with category names as keys

  const selectedCityData = cityList.find((city) => city.name === cityName);

  const categories = selectedCityData ? Object.keys(selectedCityData.categories) : [];
  // 🚩creating the array categories
  /*  Using the ternary operator to check if selectedCityData exists. If it does, extract the keys from selectedCityData.categories (which are the category names) and create an array of these keys. If selectedCityData does not exist, assign an empty array to categories. This ensures categories is always an array, preventing errors during array operations like map. */

  // ✅ Handle opening the modal and setting the city to be deleted
  const handleDelete = (categoryName) => {
    // categoryName will be replace by category.name down on 96
    setSelectedCategoryForDelete(categoryName);
    onOpen();
  };

  // 🟢 Filter categories based on search query
  const filteredCategories = categories.filter((categoryName) => categoryName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Flex flexDir="column" align="center" width="100%">
      <Heading size="xl" mb="2" mt="2">
        Activities to do in {cityName}
      </Heading>
      <Input // 🟢 Search input for categories
        placeholder="Search categories"
        onChange={(e) => setSearchQuery(e.target.value)}
        mb="1rem"
        width="50%"
      />
      <Link to={`/city/${cityName}/categories/categoryForm`}>
        <Button borderRadius="8" size="sm" width="100%" mt="0.5rem" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
          Add an activity
        </Button>
      </Link>
      <UnorderedList display="flex" flexDir="column" listStyleType="none" align="left">
        {filteredCategories.length > 0 && // 🟢 Use filteredCategories for mapping
          filteredCategories.map((categoryName) => {
            const categoryDetailsArray = selectedCityData.categories[categoryName];
            return categoryDetailsArray.map((category, index) => (
              <ListItem key={category.id} mb="2rem" flexDir="column">
                <Link to={`/city/${cityName}/categories/${category.name}`} align="left">
                  <Heading size="lg" mb="1rem">
                    {category.name}
                  </Heading>
                  {category.image && <Image src={category.image} alt={category.name} style={{ width: '300px', height: 'auto' }} />}
                </Link>
                <Flex flexDir="column">
                  <Button
                    size="sm"
                    width="100%"
                    mt="0.5rem"
                    bg="red.300"
                    color="black"
                    _hover={{ bg: 'red', color: 'white' }}
                    onClick={() => handleDelete(category.name)}
                  >
                    Delete this category
                  </Button>
                  <Link to={`/city/${cityName}/categories/${categoryName}/editCategoryForm`}>
                    <Button size="sm" width="100%" mt="0.5rem" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
                      Edit this Category
                    </Button>
                  </Link>
                </Flex>
              </ListItem>
            ));
          })}
      </UnorderedList>
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
            <Button ml={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
//-----NOTE ON   deleteCategory(cityName, selectedCategoryForDelete); //

/* The reason I needed to pass cityName along with selectedCategoryForDelete to the deleteCategory function is that my application structure likely requires both pieces of information to accurately identify and delete a category within a specific city. Here’s the mechanics :

City Context: This  application organize categories within cities. Therefore, to delete a category, I need to know not just the category's name or identifier but also the city it belongs to. This way, the deleteCategory function knows exactly which category to remove from which city.

Uniqueness Across Cities: Categories with the same name could exist in different cities. So, specifying cityName ensures that the function targets the correct category within the correct city context.

Data Structure Navigation: The function likely navigates through a data structure where cities are top-level entities, each containing its own set of categories. Thus, to reach the right category, you must first specify the city.

deleteCategory(cityName, categoryName), it is designed to locate the city first (cityName) and then the specific category within that city (categoryName) to perform the deletion. */

/* <UnorderedList listStyleType="none">
{categories.length > 0 &&
  categories.map((categoryName) => {
    const category = selectedCityData.categories[categoryName];
    return (
      <ListItem key={category.id} mb="2rem">
        <Heading size="md" mb="1rem">
          {category.name}
        </Heading>
        <Link to={`/city/${cityName}/activities/${category.name}`}>
          {category.image && <Image src={category.image} alt={category.name} style={{ width: '300px', height: 'auto' }} />}
  
        </Link>
        <Button onClick={() => deleteCategory(cityName, categoryName)}>Delete this  category</Button>
    
      </ListItem>
    );
  })}
</UnorderedList> */
