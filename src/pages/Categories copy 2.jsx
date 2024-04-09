import { useState } from 'react';
import { useCitiesContext, useActivitiesContext } from './ActivityContext';
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

const CategoryList = ({ searchQuery }) => {
  // 🟢 Accept searchQuery as prop
  const { cityList } = useCitiesContext(); // cityList includes cities with their categories and activities
  const { deleteActivity } = useActivitiesContext();
  const { cityName, categoryName } = useParams(); // Use activityTitle or categoryName based on your routing parameter
  const { isOpen, onOpen, onClose } = useDisclosure(); // ✅ useDisclosure hook manages the state for opening and closing the modal
  const [selectedActivityForDelete, setSelectedActivityForDelete] = useState(null); // ✅ Track activity selected for deletion

  const selectedCity = cityList.find((city) => city.name === cityName);
  const activities = selectedCity ? selectedCity.categories[categoryName][0].activities || [] : [];

  if (cityList.length === 0) {
    //this was the solution for the asynchronous issue fo cityList been undefined when needed there was a BIG 🐞 here
    // Render a loading indicator or return null while data is being fetched
    return <div>Loading...</div>;
  }

  // 🟢 Filter activities based on search query
  const filteredActivities = activities.filter((activity) => activity.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // ✅ Handle opening the modal and setting the city to be deleted
  const handleDelete = (activityId) => {
    setSelectedActivityForDelete(activityId);
    onOpen();
  };

  return (
    <Flex flexDir="column" mt="1rem" align="center" width="100%">
      <UnorderedList listStyleType="none">
        {filteredActivities.map(
          (
            activity // 🟢 Use filteredActivities for mapping
          ) => (
            <ListItem key={activity.id} mb="2rem">
              <Link to={`/city/${cityName}/categories/${categoryName}/activity/${activity.id}/${activity.title}`}>
                <Heading size="md" mb="1rem">
                  {activity.title}
                </Heading>
                {activity.image && <Image src={activity.image} alt={activity.title} style={{ width: '300px', height: 'auto' }} />}
              </Link>
              <Button
                size="sm"
                width="100%"
                mt="1rem"
                bg="red.300"
                color="black"
                _hover={{ bg: 'red', color: 'white' }}
                onClick={() => handleDelete(activity.id)}
              >
                Delete this activity
              </Button>
              <Link to={`/city/${cityName}/categories/${categoryName}/activity/${activity.id}/${activity.title}/editActivityForm`}>
                <Button borderRadius="8" size="sm" width="100%" mt="0.5rem" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
                  Edit this activity
                </Button>
              </Link>
            </ListItem>
          )
        )}
      </UnorderedList>

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
                onClose(); // This line closes the modal after the action
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

export const Categories = () => {
  const [searchQuery, setSearchQuery] = useState(''); // 🟢 State for the search query
  const { cityName, categoryName } = useParams();

  function capitalizeWords(string) {
    return string
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const capitalizedCategoryName = capitalizeWords(categoryName);

  return (
    <Flex flexDir="column" align="center" width="100%">
      <Heading size="lg" mb="2rem">
        {capitalizedCategoryName} in {cityName}
      </Heading>
      <Input // 🟢 Search input for activities
        placeholder="Search activities"
        width="50%"
        onChange={(e) => setSearchQuery(e.target.value)}
        mb="1rem"
      />
      {/*to get the right breadcrumb you nee to use good template literals syntax.*/}
      <Link to={`/city/${cityName}/categories/${categoryName}/activity/activityForm`}>
        <Button size="sm" width="100%" mt="0.5rem" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
          Add an activity
        </Button>
      </Link>
      <CategoryList searchQuery={searchQuery} /> {/* 🟢 Pass searchQuery to CategoryList */}
    </Flex>
  );
};
