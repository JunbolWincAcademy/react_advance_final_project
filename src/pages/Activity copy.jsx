import { useEffect, useState } from 'react';
import { useActivityContext } from './ActivityContext';
import { useParams } from 'react-router-dom';
import {
  Flex,
  Box,
  Heading,
  Image,
  Button,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { EditActivityDetailsForm } from '../components/EditActivityDetailsForm'; // Assuming this is the component for editing

export const Activity = () => {
  const { cityName, categoryName, activityId } = useParams();
  const { cityList, deleteCity, setSelectedCity, deleteCategory } = useActivityContext();
  const [activityDetails, setActivityDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose: baseOnClose } = useDisclosure(); // Renaming to avoid naming conflict

  const updateActivityDetails = (updatedDetails) => {
    //updateDetails is coming from the EditActivityForm: const updateDetails = createActivityDetails
    setActivityDetails(updatedDetails);
  };

  useEffect(() => {
    if (cityList.length === 0) {
      setIsLoading(true);
      return;
    } else {
      setIsLoading(false);
    }

    const selectedCity = cityList.find((city) => city.name === cityName);
    const category = selectedCity?.categories[categoryName];
    const activity = category?.[0].activities.find((a) => String(a.id) === activityId);
    //🐞🚩Converting to string for comparison

    if (activity) {
      setActivityDetails(activity);
    } else {
      console.error('Activity not found');
    }
    setIsLoading(false);
  }, [cityList, cityName, categoryName, activityId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!activityDetails) return null;

  // function ActivityCard() {
  //   // Assume rating is a new field in your activityDetails
  //   const { rating = 3, reviewCount = 0 } = activityDetails;
  const onClose = () => {
    console.log('Closing modal'); // This line will log when onClose is triggered
    baseOnClose(); // Call the original onClose function from useDisclosure
  };
  return (
    <Flex justifyContent="center">
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" align="center" bg="red.800" color="white">
        <Image src={activityDetails.image} alt={activityDetails.title} />
        <Flex width="80%">
          <Box
            display="flex"
            borderRadius="50%"
            p="2rem"
            bg="red"
            color="white"
            w="14"
            h="8"
            alignItems="center"
            justifyContent="center"
            mt="1rem"
            mb="1rem"
          >
            <Text as="b">New</Text>
          </Box>
        </Flex>
        <Box flexDir="column" align="center">
          <Heading mt="0.1rem" fontWeight="bold" as="h5" lineHeight="tight" noOfLines="1" mb="1.5rem">
            {activityDetails.title}
          </Heading>
          <Flex flexDir="column" textAlign="left" width="80%">
            <Text as="b">Description:</Text>
            <Text>{activityDetails.description}</Text>
            <Text as="b">Location:</Text>
            <Text>{activityDetails.location}</Text>
            <Text as="b">Start Time:</Text>
            <Text>{activityDetails.startTime}</Text>
            <Text as="b">End Time:</Text>
            <Text>{activityDetails.endTime}</Text>

            <Box display="flex" mt="2" mb="6" alignItems="center">
              {Array(5)
                .fill('')
                .map((_, i) => (
                  <StarIcon key={i} color={i < activityDetails.rating ? 'red' : 'gray.300'} />
                ))}
              <Box as="span" ml="2" color="white" fontSize="sm">
                {activityDetails.reviewCount} reviews
              </Box>
            </Box>
          </Flex>

          <Box display="flex" align="left" width="80%">
            <Flex flexDir="column">
              <Text as="b">Edited by:</Text>
              <Box flexDir="row">
                <Text as="b">Name:</Text> {activityDetails.editedBy.userName}
              </Box>
              <Box flexDir="row">
                <Text as="b">Lastname:</Text> {activityDetails.editedBy.userLastName}
              </Box>
            </Flex>
          </Box>
          <Button
            size="sm"
            width="50%"
            mt="1rem"
            bg="red.600"
            mb="2rem"
            color="black"
            _hover={{ bg: 'red', color: 'white' }}
            onClick={onOpen} // ✅ Open modal on button click
          >
            Edit this Activity Details
          </Button>
        </Box>
      </Box>
      {/* The Modal component uses isOpen and onClose props to control its visibility. isOpen is a boolean that determines if the modal is visible on the screen. onClose is a function that updates the isOpen state to false, closing the modal.These props are typically managed in the parent component's state (Activity.jsx in this case), allowing the modal to open/close based on user interactions. 'These are meant to be use here locally not like prop drilling */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Activity Details</ModalHeader>
          <ModalCloseButton />
          <EditActivityDetailsForm activityDetails={activityDetails} onClose={onClose} onUpdate={updateActivityDetails} />
        </ModalContent>
      </Modal>
    </Flex>
  );
};
