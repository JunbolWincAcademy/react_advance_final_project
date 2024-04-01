import { useEffect, useState } from 'react';
import { useCitiesContext } from './ActivityContext';
import { useParams } from 'react-router-dom';
import { Flex, Box, Heading, Image, Button, Text } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

export const Activity = () => {
  const { cityName, categoryName, activityId } = useParams();
  const { cityList } = useCitiesContext();
  const [activityDetails, setActivityDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cityList.length === 0) {
      setIsLoading(true);
      return;
    } else {
      setIsLoading(false);
    }

    console.log('city list: ', cityList);
    const city = cityList.find((city) => city.name === cityName);
    console.log('city: ', city);
    console.log('category name from Params:', categoryName);

    const category = city ? city.categories[categoryName] : null;
    console.log('category: ', category);

    // Ensure that we compare the same type (either both strings or both numbers)
    const activities = category ? category[0].activities : null;
    console.log('activities: ', activities);
    const activity = activities ? activities.find((a) => String(a.id) === activityId) : null; //🐞🚩Converting to string for comparison
    console.log('activity: ', activity);

    if (activity) {
      setActivityDetails(activity);
    }
  }, [cityList, cityName, categoryName, activityId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!activityDetails) return null;

  // function ActivityCard() {
  //   // Assume rating is a new field in your activityDetails
  //   const { rating = 3, reviewCount = 0 } = activityDetails;

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image src={activityDetails.image} alt={activityDetails.title} />

      <Box p="6" flexDir="column">
        <Box display="flex" borderRadius="lg" bg="red" color="white" w="14" h="8" alignItems="center" justifyContent="center">
          <Text as="b" align="center">
            New
          </Text>
        </Box>

        <Heading mt="1" fontWeight="semibold" as="h5" lineHeight="tight" noOfLines={1}>
          {activityDetails.title}
        </Heading>
        <Flex>
          <Text as="b">Description:</Text>
          <Text>{activityDetails.description}</Text>
        </Flex>
        <Flex>
          <Text as="b">Location:</Text>
          <Text>{activityDetails.location}</Text>
        </Flex>
        <Flex>
          <Text as="b">Start Time:</Text>
          <Text>{activityDetails.startTime}</Text>
        </Flex>
        <Flex>
          <Text as="b">End Time:</Text>
          <Text>{activityDetails.endTime}</Text>
        </Flex>
        <Box display="flex" mt="2" mb="6" alignItems="center">
          {Array(5)
            .fill('')
            .map((_, i) => (
              <StarIcon key={i} color={i < activityDetails.rating ? 'red' : 'gray.300'} />
            ))}
          <Box as="span" ml="2" color="gray.600" fontSize="sm">
            {activityDetails.reviewCount} reviews
          </Box>
        </Box>
        <Flex flexDir="column">
          <Text as="b">Edited by:</Text>
          <Box flexDir="row">
            <Text as="b">Name:</Text> {activityDetails.editedBy.userName}
          </Box>
          <Box flexDir="row">
            <Text as="b">Lastname:</Text> {activityDetails.editedBy.userLastName}
          </Box>
        </Flex>

        <Link to={`/city/${cityName}/categories/${categoryName}/activity/${activityDetails.id}/${activityDetails.title}/EditActivityDetailsForm`}>
          <Button mt="2" color="white" bg="red.300" _hover={{ bg: 'red' }}>
            Edit this Activity Details
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
