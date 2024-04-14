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
  ModalCloseButton,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { EditActivityDetailsForm } from '../components/EditActivityDetailsForm';

export const Activity = () => {
  const { cityName, categoryName, activityId } = useParams();
  const { cityList } = useActivityContext();
  const [activityDetails, setActivityDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose: baseOnClose } = useDisclosure();

  const updateActivityDetails = (updatedDetails) => {
    //This updateDetails parameter will receive all the content from the updatedDetails variable in the EditActivityDetailsForm using prop lifting onUpdate(updatedDetails)
    setActivityDetails(updatedDetails);
  };

  useEffect(() => {
    if (cityList.length === 0) {
      setIsLoading(true);
      return;
    }

    const selectedCity = cityList.find((city) => city.name === cityName);
    const category = selectedCity?.categories[categoryName];
    const activity = category?.[0].activities.find((a) => String(a.id) === activityId);

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

  if (!activityDetails) return <div>Activity not found</div>;

  // 🟢 Extracting userName and userLastName safely. To handle this situation , I can use optional chaining (?.) and nullish coalescing operator (??) to provide default values when properties are not present otherwise I will get a🐞. This approach is more streamlined and avoids the need for extra state variables for userName and lastName.I'm using "?" because I want to prevent immediately an error if editedBy is undefined so it returns an empty string. By using "??" the System stops if the first "?" evaluation  returns undefined,and  continues straight till the end to the "??" which it will return whatever is on the right side of it and in this case is an  empty string
  const userName = activityDetails.editedBy?.userName ?? ''; // 🟢 Safely extract userName. If `editedBy` is undefined, or if `userName` is not present, default to an empty string.
  const userLastName = activityDetails.editedBy?.userLastName ?? '';

  const onClose = () => {
    baseOnClose();
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
          <Heading mt="0.1rem" fontWeight="bold" fontSize="3xl" lineHeight="tight" noOfLines="1" mb="1.5rem">
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
                <Text as="b">Name:</Text> {userName} {/* 🟢 Use the safe userName */}
              </Box>
              <Box flexDir="row">
                <Text as="b">Lastname:</Text> {userLastName} {/* 🟢 Use the safe userLastName */}
              </Box>
            </Flex>
          </Box>
          <Button
            size="sm"
            width="50%"
            mt="1rem"
            bg="red.600"
            mb="2rem"
            color="gray.200"
            _hover={{ bg: 'red', color: 'white' }}
            onClick={onOpen} // ✅ Open modal on click
          >
            Edit this activity details
          </Button>
        </Box>
      </Box>
      {/* The Modal component uses isOpen and onClose props to control its visibility. isOpen is a boolean that determines if the modal is visible on the screen. onClose is a function that updates the isOpen state to false, closing the modal.These props are typically managed in the parent component's state (Activity.jsx in this case), allowing the modal to open/close based on user interactions. 'These are meant to be use here locally not like prop drilling */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit activity details</ModalHeader>
          <ModalCloseButton />
          <EditActivityDetailsForm activityDetails={activityDetails} onClose={onClose} onUpdate={updateActivityDetails} />
        </ModalContent>
      </Modal>
    </Flex>
  );
};
