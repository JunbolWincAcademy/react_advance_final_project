import React from 'react';
import { useState } from 'react';
import { useCitiesContext, useActivitiesContext } from './ActivityContext'; // Adjust import as needed
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
} from '@chakra-ui/react';


const CategoryList = () => {
  const { cityList } = useCitiesContext(); // Assume cityList includes cities with their categories and activities
  const { deleteActivity, setSelectedActivity, editActivity } = useActivitiesContext();
  const { cityName, categoryName } = useParams(); // Use activityTitle or categoryName based on your routing parameter
  const { isOpen, onOpen, onClose } = useDisclosure(); // ✅ useDisclosure hook manages the state for opening and closing the modal
  const [selectedActivityForDelete, setSelectedActivityForDelete] = useState(null); // ✅ Track activity selected for deletion
  console.log('URL cityName:', cityName); // Verifying this matches exactly with your data's city names
  // Find the selected city data

  if (cityList.length === 0) {
    //this was the solution for the asynchronous issue fo cityList been undefined when needed there was a BIG 🐞 here
    // Render a loading indicator or return null while data is being fetched
    return <div>Loading...</div>;
  }

  console.log('cityList:', cityList); // Check the structure and content

  const selectedCity = cityList.find((city) => city.name === cityName);
  console.log('Selected City Categories:', selectedCity.categories);
  console.log('Activity Title from URL:', categoryName);
  console.log('Attempting to Access Categories for Category:', selectedCity.categories[categoryName]);

  // Assuming activityTitle refers to the category name and that categories are objects with activity arrays
  const activities = selectedCity ? selectedCity.categories[categoryName][0].activities || [] : []; //there was a BIG 🐞 here this [0] was missing like saying games[0]

  console.log('Selected City:', selectedCity); // Debugging
  console.log('Activities:', activities); // Debugging

  // ✅ Handle opening the modal and setting the city to be deleted
  const handleDelete = (activityId) => {
    setSelectedActivityForDelete(activityId);
    onOpen();
  };

  return (
    <Flex flexDir="column" mt="1rem" align="center" width="100%" pl="0">
      <UnorderedList listStyleType="none">
        {activities.map((activity, index) => (
          <ListItem key={index} mb="2rem">
            {' '}
            {/* Consider using a more unique key if available */}
            <Link to={`/city/${cityName}/categories/${categoryName}/activity/${activity.id}/${activity.title}`}>
              <Heading size="md" mb="1rem" align="center">
                {activity.title}
              </Heading>
              {activity.image && <Image borderRadius="4" src={activity.image} alt={activity.title} style={{ width: '300px', height: 'auto' }} />}
            </Link>
            <Button
              borderRadius="8"
              size="sm"
              width="100%"
              mt="1rem"
              bg="red.300"
              color="black"
              _hover={{ bg: 'red', color: 'white' }}
              onClick={() => handleDelete(activity.id)} // ✅ Trigger the modal for delete confirmation
            >
              Delete this activity
            </Button>
            <Link to={`/city/${cityName}/categories/${categoryName}/activity/${activity.id}/${activity.title}/editActivityForm`}>
              <Button borderRadius="8" size="sm" width="100%" mt="0.5rem" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
                Edit this activity
              </Button>
            </Link>
            {/*✅ categoryName was missing*/}
          </ListItem>
        ))}
      </UnorderedList>
      {/* ✅ Modal for delete confirmation */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Activity</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete {selectedActivityForDelete}?</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => {
                deleteActivity(cityName, categoryName, selectedActivityForDelete); // 🚩Ensure to pass all the correct arguments to deleteActivity, they all needed. When I call deleteActivity from within the Categories component, you have the context of which city and category I am currently working with. By passing cityName and categoryName along with activityId to the deleteActivity function, you provide a complete path to the specific activity within the nested structure of your data. This way, the deleteActivity in ActivityContext function knows exactly where to look in the data to find and remove the activity. It needs to traverse through the city and category to get to the right activity array. This is why you need to pass these specific parameters from your component where the action is initiated, down to the context where the actual data manipulation happens.
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

export const Categories = () => {
  function capitalizeWords(string) {
    return string
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const { cityName, activityTitle, categoryName } = useParams();

  // Capitalize categoryName
  const capitalizedCategoryName = capitalizeWords(categoryName);

  return (
    <Flex flexDir="column" align="center" width="100%" pl="0">
      <Heading size="lg" mb="2rem">
        {capitalizedCategoryName} to do in {cityName}
      </Heading>

      <Link to={`/city/${cityName}/categories/${categoryName}/activity/activityForm`}>
        <Button borderRadius="8" size="sm" width="100%" mt="0.5rem" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
          Add an activity
        </Button>
      </Link>
      {/*to get the right breadcrumb you nee to use good template literals.*/}
      {<CategoryList />}
    </Flex>
  );
};

///-------
/* <Button size="xs" onClick={() => setSelectedActivity(activity)}>
            Activity Data
          </Button>{' '} 
          {/* <Button size="xs" onClick={() => deleteUser(user.id)}>
            Delete
          </Button> */
