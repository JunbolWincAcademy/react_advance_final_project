import { useState } from 'react';
import { useCitiesContext, useActivitiesContext } from './ActivityContext';
import { useParams, Link } from 'react-router-dom';
import {
  Flex,
  Box, // ✅ Import Box to use as a container
  Heading,
  SimpleGrid, // ✅ Import SimpleGrid for responsive grid layout
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

const CategoryList = ({ searchQuery }) => {
  const { cityList } = useCitiesContext();
  const { deleteActivity } = useActivitiesContext();
  const { cityName, categoryName } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedActivityForDelete, setSelectedActivityForDelete] = useState(null);

  const selectedCity = cityList.find((city) => city.name === cityName);
  const activities = selectedCity ? selectedCity.categories[categoryName][0].activities || [] : [];

  if (cityList.length === 0) {
    return <div>Loading...</div>;
  }

  const filteredActivities = activities.filter((activity) => activity.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDelete = (activityTitle) => {
    setSelectedActivityForDelete(activityTitle);
    onOpen();
  };

  // ✅Function to determine the number of columns in SimpleGrid based on the number of categories
  const getColumnCount = () => {
    const categoryCount = filteredActivities.length;
    if (categoryCount === 1) return 1;
    if (categoryCount === 2) return 2;
    return 3;
  };

  return (
    <Box width="100%" padding="4" textAlign="center">
      <SimpleGrid columns={getColumnCount()} spacing="4" width="100%">
        {' '}
        {/* ✅ Use SimpleGrid for responsive layout */}
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
                mt="1rem"
                mb="0.5rem"
                onClick={() => handleDelete(activity.title)}
              >
                Delete this activity
              </Button>
              <Link to={`/city/${cityName}/categories/${categoryName}/activity/${activity.id}/${activity.title}/editActivityForm`}>
                <Button size="sm" mt="0.5rem" mb="2rem" bg="red.600" color="black" _hover={{ bg: 'red', color: 'white' }}>
                  Edit this activity
                </Button>
              </Link>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        {' '}
        {/* ✅ Modal logic for delete confirmation */}
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Activity</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete {selectedActivityForDelete}?</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => {
                deleteActivity(cityName, categoryName, selectedActivityForDelete);
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
    <Flex flexDir="column" align="center" width="100%">
      <Heading size="lg" mb="2rem">
        {capitalizedCategoryName} in {cityName}
      </Heading>
      <Input placeholder="Search activities" width="50%" onChange={(e) => setSearchQuery(e.target.value)} mb="1rem" />
      <Link to={`/city/${cityName}/categories/${categoryName}/activity/activityForm`}>
        <Button size="sm" width="100%" mt="0.5rem" bg="red.600" color="black" _hover={{ bg: 'red', color: 'white' }}>
          Add an activity
        </Button>
      </Link>
      <CategoryList searchQuery={searchQuery} />
    </Flex>
  );
};
