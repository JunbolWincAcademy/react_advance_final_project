import { useState } from 'react';
import { useCitiesContext, useActivitiesContext } from './ActivityContext';
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
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
} from '@chakra-ui/react';
import { EditActivityDetailsForm } from '../components/EditActivityDetailsForm';

const CategoryList = ({ searchQuery }) => {
  const { cityList, deleteActivity, updateActivityDetails } = useActivitiesContext();
  const { cityName, categoryName } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedActivityForAction, setSelectedActivityForAction] = useState(null);
  const [isEditModal, setIsEditModal] = useState(false);

  const selectedCity = cityList.find((city) => city.name === cityName);
  const activities = selectedCity ? selectedCity.categories[categoryName][0].activities || [] : [];

  const filteredActivities = activities.filter((activity) => activity.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDeleteClick = (activity) => {
    setSelectedActivityForAction(activity);
    setIsEditModal(false);
    onOpen();
  };

  const handleEditDetailsClick = (activity) => {
    setSelectedActivityForAction(activity);
    setIsEditModal(true);
    onOpen();
  };

  const handleDelete = () => {
    deleteActivity(cityName, categoryName, selectedActivityForAction.id);
    onClose();
  };

  const getColumnCount = () => {
    const activityCount = filteredActivities.length;
    return activityCount <= 1 ? 1 : activityCount === 2 ? 2 : 3;
  };

  return (
    <Flex direction="column" mt="1rem" justifyContent="center" width="100%" padding="4">
      <SimpleGrid columns={getColumnCount()} spacing="4">
        {filteredActivities.map((activity) => (
          <Box key={activity.id} borderWidth="1px" borderRadius="lg" overflow="hidden" bg="red.800">
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
                onClick={() => handleDeleteClick(activity)}
              >
                Delete this activity
              </Button>
              <Button
                size="sm"
                mt="0.5rem"
                bg="red.600"
                color="black"
                _hover={{ bg: 'red', color: 'white' }}
                onClick={() => handleEditDetailsClick(activity)}
              >
                Edit this activity
              </Button>
              {!activity.details && (
                <Button
                  size="sm"
                  mt="0.5rem"
                  mb="2rem"
                  bg="blue.600"
                  color="white"
                  _hover={{ bg: 'blue', color: 'white' }}
                  onClick={() => handleEditDetailsClick(activity)}
                >
                  Add this Activity Details
                </Button>
              )}
            </Flex>
          </Box>
        ))}
      </SimpleGrid>

      {selectedActivityForAction && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            {isEditModal ? (
              <>
                <ModalHeader>Edit Activity Details</ModalHeader>
                <ModalCloseButton />
                <EditActivityDetailsForm activityDetails={selectedActivityForAction} onClose={onClose} onUpdate={updateActivityDetails} />
              </>
            ) : (
              <>
                <ModalHeader>Delete Activity</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  Are you sure you want to delete {selectedActivityForAction.title}?
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="red" onClick={handleDelete}>
                    Delete
                  </Button>
                  <Button ml="3" onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </Flex
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
