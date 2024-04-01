import { useEffect, useState } from 'react';
import { useCitiesContext } from './ActivityContext';
import { Box, Image, Badge, Heading, Text, Button, Flex } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';

export const Activity = () => {
  const { cityName, categoryName, activityId, activityTitle } = useParams();
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

    const city = cityList.find((city) => city.name === cityName);
    const category = city ? city.categories[categoryName] : null;
    const activity = category ? category[0].activities.find((a) => a.title === activityTitle) : null;

    if (activity) {
      setActivityDetails(activity);
    }
  }, [cityList, cityName, categoryName, activityTitle]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!activityDetails) return null;

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" m="4">
      <Image src={activityDetails.image || 'https://bit.ly/2Z4KKcF'} alt={activityDetails.title || 'Activity Image'} />
      <Box p="6">
        <Heading mb="2" size="xl">
          {activityDetails.title}
        </Heading>
        <Text fontSize="sm">{`Category: ${categoryName}`}</Text>
        <Text mt="2">{activityDetails.description}</Text>
        <Text mt="2">{`Location: ${activityDetails.location}`}</Text>
        <Text mt="2">{`Start time: ${activityDetails.startTime}`}</Text>
        <Text mt="2">{`End time: ${activityDetails.endTime}`}</Text>
        <Flex mt="4" alignItems="center">
          <Link to={`/city/${cityName}/categories/${categoryName}/activity/${activityDetails.id}/${activityDetails.title}/EditActivityDetailsForm`}>
            <Button bg="red.300" color="white" _hover={{ bg: 'red' }}>
              Edit this Activity Details
            </Button>
          </Link>
        </Flex>
      </Box>
    </Box>
  );
};
