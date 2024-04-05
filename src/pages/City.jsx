import React from 'react';
import { useEffect, useState } from 'react';
import { ActivityProvider, useCitiesContext, useCategoriesContext } from './ActivityContext'; // Adjust the import
import { useParams, Link } from 'react-router-dom';
// import { UserForm } from '../components/UserForm';
// import { category } from './category';
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


export const City = () => {
  const { cityList, selectedCity, setSelectedCity } = useCitiesContext(); // Use cityList from context
  const { deleteCategory,  editCategoryDetails  } = useCategoriesContext();
  const { cityName, categoryName } = useParams(); // Extracting the city name from the URL
  const { isOpen, onOpen, onClose } = useDisclosure(); // ✅ useDisclosure hook manages the state for opening and closing the modal
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState(null); // ✅ Track category selected for deletion
  useEffect(() => {
    setSelectedCity(cityName); //🚩this is the right place to this inside a useEffect
    // This will now only run when componentName changes, not on every render
  }, [cityName, setSelectedCity]);

  if (cityList.length === 0) {
    //this was the solution for the asynchronous issue fo cityList been undefined when needed there was a BIG 🐞 here
    // Render a loading indicator or return null while data is being fetched fixed that
    return <div>Loading...</div>;
  }
  console.log('here comes the cityList:');
  console.log(cityList);
  console.log('selectedCity IN CITY after been set in Cities:', selectedCity);
  // Find the selected city data from the cityList
  const selectedCityData = cityList.find((city) => city.name === cityName);
  console.log(selectedCityData);
  //setSelectedCity(cityName); //❌🚩THIS WAS MY SOLUTION but I put in the wrong place causing a SIDE EFFECT???❓
  // Assuming categories is an object with category names as keys
  const categories = selectedCityData ? Object.keys(selectedCityData.categories) : []; // 🚩creating the array categories
  /*  Using the ternary operator to check if selectedCityData exists. If it does, extract the keys from selectedCityData.categories (which are the category names) and create an array of these keys. If selectedCityData does not exist, assign an empty array to categories. This ensures categories is always an array, preventing errors during array operations like map. */

  // ✅ Handle opening the modal and setting the city to be deleted
  const handleDelete = (categoryName) => {
    // categoryName will be replace by category.name down on 96
    setSelectedCategoryForDelete(categoryName);
    onOpen();
  };

  return (
    <Flex flexDir="column" align="center" width="100%">
      <Heading size="xl" mb="2" mt="2">
        Activities to do in {cityName}
      </Heading>
      <Link to={`/city/${cityName}/categories/categoryForm`}>
        <Button borderRadius="8" size="sm" width="100%" mt="0.5rem" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
          {/* // Assuming cityName and categoryName are variables holding the actual names */}
          Add a category
        </Button>
      </Link>
      <UnorderedList display="flex" flexDir="column" listStyleType="none" align="left">
        {categories.length > 0 &&
          categories.map((categoryName) => {
            const categoryDetailsArray = selectedCityData.categories[categoryName]; //using [] remember categories is an array here
            return categoryDetailsArray.map(
              (
                category,
                index //❓ ✅ Use map on the array of details
              ) => (
                <ListItem key={category.id} mb="2rem" flexDir="column">
                  {' '}
                  {/* ✅ Ensure key is unique by using category.id*/}
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
                      onClick={() => handleDelete(category.name)} // ✅ Trigger the modal for delete confirmation
                    >
                      Delete this category
                    </Button>

                    <Link
                      to={`/city/${cityName}/categories/${categoryName}/editCategoryForm`}
                      size="sm"
                      width="100%"
                      mt="0.5rem"
                      bg="red.300"
                      color="black"
                      _hover={{ bg: 'red', color: 'white' }}
                    >
                      <Button size="sm" width="100%" mt="0.5rem" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
                        Edit this Category
                      </Button>
                    </Link>
                  </Flex>
                </ListItem>
              )
            );
          })}
      </UnorderedList>
      {/* ✅ Modal for delete confirmation */}
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
                deleteCategory(cityName, selectedCategoryForDelete); // 🚩Ensure to pass correct parameters to deleteCategory. \i added a full length note bellow explaining why cityName is needed here
                onClose(); // This line closes the modal after the action
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
///-------

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
