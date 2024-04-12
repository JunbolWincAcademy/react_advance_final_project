import { useState } from 'react';
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
import { EditActivityDetailsForm } from '../components/EditActivityDetailsForm'; // Import the form component

const CategoryList = ({ searchQuery }) => {
  const { cityList, deleteActivity, updateActivityDetails } = useActivityContext();
  // const { deleteActivity, updateActivityDetails } = useActivitiesContext();
  const { cityName, categoryName } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedActivityForAction, setSelectedActivityForAction] = useState(null); // For delete or edit
  const [isEditingDetails, setIsEditingDetails] = useState(false); // To toggle between delete and edit modal

  if (!cityList || cityList.length === 0) {
    return <div>Loading...</div>; // Show loading or a message until cityList is available
  }

  console.log('list of cities:', cityList);
  const selectedCity = cityList.find((city) => city.name === cityName);
  if (!selectedCity) {
    console.error('Selected city not found');
    return <div>City not found</div>; // Handle the case where the city is not found
  }

  const activities = selectedCity ? selectedCity.categories[categoryName][0].activities || [] : [];

  const filteredActivities = activities.filter((activity) => activity.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDeleteClick = (activity) => {
    setSelectedActivityForAction(activity);
    setIsEditingDetails(false);
    onOpen();
  };

  const confirmDelete = () => {
    if (selectedActivityForAction && selectedActivityForAction.id) {
      deleteActivity(cityName, categoryName, selectedActivityForAction.id); // ✅ Ensure the correct ID is used here
      onClose();
    } else {
      console.error('Error: No activity selected for deletion.');
    }
  };

  const handleEditDetailsClick = (activity) => {
    setSelectedActivityForAction(activity);
    setIsEditingDetails(true);
    onOpen();
  };

  const getColumnCount = () => {
    const activityCount = filteredActivities.length;
    return activityCount <= 1 ? 1 : activityCount === 2 ? 2 : 3;
  };

  return (
    <Flex direction="column" mt="1rem" justifyContent="center" width="100%" padding="4">
      <SimpleGrid columns={getColumnCount()} spacing="4">
        {filteredActivities.map((activity) => (
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
                onClick={() => handleDeleteClick(activity)}
              >
                Delete this activity
              </Button>
              <Link to={`/city/${cityName}/categories/${categoryName}/activity/${activity.id}/${activity.title}/editActivityForm`}>
                <Button size="sm" bg="red.600" mb="2rem" color="black" _hover={{ bg: 'red', color: 'white' }}>
                  Edit this activity
                </Button>
              </Link>

              <Button
                size="sm"
                bg="blue.600"
                color="white"
                _hover={{ bg: 'blue', color: 'white' }}
                mb="2rem"
                onClick={() => handleEditDetailsClick(activity)}
              >
                Add details to this activity
              </Button>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen && !isEditingDetails} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete activity</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete {selectedActivityForAction ? selectedActivityForAction.title : ''}?</ModalBody>
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

      <Modal isOpen={isOpen && isEditingDetails} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add activity details</ModalHeader>
          <ModalCloseButton />
          <EditActivityDetailsForm activityDetails={selectedActivityForAction} onClose={onClose} onUpdate={updateActivityDetails} />
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
