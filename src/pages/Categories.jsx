import { useState, useEffect } from 'react';
import { useActivityContext } from './ActivityContext';
import { useParams, Link } from 'react-router-dom';
import {
  Flex,
  Box,
  Heading,
  SimpleGrid,
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
import { EditActivityDetailsForm } from '../components/EditActivityDetailsForm';

const CategoryList = ({ searchQuery }) => {
  const { cityList, deleteActivity } = useActivityContext();
  const { cityName, categoryName, activityId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activityForAction, setActivityForAction] = useState(null); // 🟢 For delete or edit
  const [modalType, setModalType] = useState(null); // 🟢 Differentiate between edit and delete modals

  useEffect(() => {
    if (cityList.length > 0) {
      const selectedCity = cityList.find((city) => city.name === cityName);
      const activities = selectedCity?.categories[categoryName]?.[0]?.activities;
      if (activities && activities.length > 0) {
        // Optionally set a default activity or handle no activities logic
      }
    }
  }, [cityList, cityName, categoryName]); // 🟢 Setup initial state based on city list

  // Extract activities from the city and category
  const selectedCity = cityList.find((city) => city.name === cityName);
  const activities = selectedCity?.categories[categoryName]?.[0]?.activities || [];

  // Filter activities based on searchQuery
  const filteredActivities = activities.filter((activity) => activity.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const getColumnCount = () => {
    const activityCount = filteredActivities.length;
    return activityCount <= 1 ? 1 : activityCount === 2 ? 2 : 3;
  };

  // Handle opening the delete confirmation modal
  const handleDeleteActivity = (activity) => {
    setActivityForAction(activity);
    onOpen();
  };

  const confirmDelete = () => {
    if (activityForAction && activityForAction.id) {
      deleteActivity(cityName, categoryName, activityForAction.id);
      onClose();
    }
  };

  const updateActivityDetails = (updatedDetails) => {
    // Optionally, you might want to update something in your state here
    console.log('Updated Activity Details:', updatedDetails);
    onClose(); // Close the modal after update
  };
  console.log('Passing props to form 1:', activityForAction);
  return (
    <Flex direction="column" mt="1rem" justifyContent="center" width="100%" padding="4">
      <SimpleGrid columns={getColumnCount()} spacing="4">
        {' '}
        {cityList
          .find((city) => city.name === cityName)
          ?.categories[categoryName]?.[0]?.activities.map((activity) => (
            <Box key={activity.id} borderWidth="1px" borderRadius="lg" overflow="hidden" bg="red.800" align="center">
              <Link to={`/city/${cityName}/categories/${categoryName}/activity/${activity.id}/${activity.title}`}>
                <Image src={activity.image} alt={activity.title} />
                <Heading size="lg" mt="2" mb="2" color="white">
                  {activity.title}
                </Heading>
              </Link>
              <Flex direction="column" mt="1rem" align="center">
                <Button
                  size="sm"
                  bg="red.600"
                  color="black"
                  _hover={{ bg: 'red', color: 'white' }}
                  mt="1rem"
                  mb="1rem"
                  onClick={() => handleDeleteActivity(activity)}
                >
                  Delete this activity
                </Button>
                <Link to={`/city/${cityName}/categories/${categoryName}/activity/${activity.id}/${activity.title}/editActivityForm`}>
                  <Button size="sm" bg="red.600" mb="2rem" color="black" _hover={{ bg: 'red', color: 'white' }}>
                    Edit this activity
                  </Button>
                </Link>
              </Flex>
            </Box>
          ))}
      </SimpleGrid>

      {/* Modal for Deleting Activity */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Activity</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete {activityForAction ? activityForAction.title : ''}?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={confirmDelete}>
              Delete
            </Button>
            <Button ml={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Editing Activity */}
      <Modal isOpen={isOpen && modalType === 'edit'} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Activity Details</ModalHeader>
          <ModalCloseButton />

          <EditActivityDetailsForm
            cityName={cityName}
            categoryName={categoryName}
            activityId={activityId}
            onClose={onClose}
            onUpdate={updateActivityDetails}
          />
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export const Categories = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { cityName, categoryName } = useParams();

  function capitalizeWords(string) {
    return string
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const capitalizedCategoryName = capitalizeWords(categoryName);

  return (
    <Flex direction="column" mt="1rem" align="center" width="100%" padding="4">
      <Heading size="lg" mb="2rem">
        {capitalizedCategoryName} in {cityName}
      </Heading>
      <label htmlFor="city name">
        <Heading as="b" size="md">
          Search for an activity:
          <Input width={{ base: '80%', md: '50%' }} placeholder="Search categories" onChange={(e) => setSearchQuery(e.target.value)} mb="4" />
        </Heading>
      </label>
      <Link to={`/city/${cityName}/categories/${categoryName}/activity/activityForm`}>
        <Button size="sm" mt="0.5rem" bg="red.600" color="gray.200" _hover={{ bg: 'red', color: 'white' }}>
          Add an activity
        </Button>
      </Link>
      <CategoryList searchQuery={searchQuery} />
    </Flex>
  );
};
