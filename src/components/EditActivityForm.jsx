import { useState, useEffect } from 'react';
import { useActivityContext } from '../pages/ActivityContext';
import { Flex, Box, Input, Button, Textarea, FormControl, Text } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

export const EditActivityForm = () => {
  const navigate = useNavigate();
  const { cityName, categoryName, activityId, activityTitle } = useParams();

  // Initialize state with empty values; these will be updated by useEffect
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');

  const { editActivityDetails } = useActivityContext();

  // ✅ Updated function to capitalize the first letter of each word
  function capitalizeTitle(string) {
    return string
      .split(' ') // Split the string into an array of words. For each word
      .map(
        (
          word // The map() function is used to iterate over each word in the array. For each word, the following operations are performed:
        ) =>
          word.charAt(0).toUpperCase() + // Capitalize the first letter of each word
          word.slice(1).toLowerCase() // Convert the rest of the word to lowercase
      )
      .join(' '); // Join the array of words back into a single string
  }

  useEffect(() => {
    const fetchCityData = async () => {
      const url = `http://localhost:3000/cities`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch city data: ${response.status}`);
      }
      const citiesData = await response.json();

      // Assuming citiesData is an object where each key is a city name
      const cityData = citiesData[cityName];

      if (!cityData) {
        throw new Error('City not found');
      }

      const category = cityData.categories[categoryName];
      if (!category) {
        throw new Error('Category not found');
      }

      // Assuming category is an array and finding the activity
      const activity = category[0].activities.find((a) => a.id === Number(activityId)); //🐞Number was necessary because activityId in the params is a string

      if (!activity) {
        throw new Error('Activity not found');
      }
      // When setting the state, use a fallback value like an empty string if the fetched data might be undefined or null
      setTitle(activity.title || '');
      setImage(activity.image || '');
    };

    if (activityId) {
      fetchCityData();
    }
  }, [cityName, categoryName, activityId]);

  const resetFormFields = () => {
    setTitle('');
    setImage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const capitalizedActivityName = capitalizeTitle(title);

    try {
      await editActivityDetails(cityName, categoryName, activityId, {
        title: capitalizedActivityName,
        image,
      });

      resetFormFields();
      navigate(`/city/${cityName}/categories/${categoryName}`);
      // navigate(`/city/${cityName}/categories/${categoryName}/activity/${activityId}/${title}`);
      //🚩❓navigate is used to programmatically redirect the user, which should force the component to re-render with the updated URL parameters. The { replace: true } option replaces the current entry in the history stack, so it doesn’t create a new history entry.
    } catch (error) {
      console.error('Error updating activity details:', error);
    }
  };

  return (
    <Flex //🚩🐞*to fix the issue of not been able to use FormControl I has to wrap it inside Flex and put the onSubmit here instead
      as="form"
      onSubmit={handleSubmit}
    >
      <FormControl display="flex" flexDir="column" borderRadius="8" p="1rem" m="1.5rem" bg="red.600" color="white" width="100%">
        <label htmlFor="title">
          <Text as="b">Title:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          mb="1rem"
          type="text"
          required
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="image url">
          <Text as="b">URL to image:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          id="image"
          mb="1rem"
          type="url"
          required
          placeholder="URL to image"
          value={image}
          borderRadius="4"
          onChange={(e) => setImage(e.target.value)}
          _placeholder={{ color: 'gray.400' }}
        />

        <Box display="flex" flexDir="column" alignItems="center" mt="2rem">
          <Button type="submit" width="50%" mb="1rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }}>
            Update Details
          </Button>
          <Button type="button" width="50%" mb="2rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }} onClick={resetFormFields}>
            Reset Input Fields
          </Button>
        </Box>
      </FormControl>
    </Flex>
  );
};
