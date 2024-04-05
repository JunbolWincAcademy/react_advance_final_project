import { useState, useEffect } from 'react';
import { useActivityDetailsContext } from '../pages/ActivityContext';
import { Flex, Box, Input, Button, Textarea, FormControl, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

export const EditActivityForm = ({ onClose }) => {// ✅ onClose prop is used to close the modal
  //🚩to pass the prop I need to wrap the name with {....}
  // const navigate = useNavigate();
  const { cityName, categoryName, activityId, activityTitle } = useParams();

  // Initialize state with empty values; these will be updated by useEffect
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [image, setImage] = useState('');

  const { editActivityDetails } = useActivityDetailsContext();

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
      console.log('Category data:', category);
      console.log('Activities:', category[0].activities);
      console.log('Looking for activity ID before:', activityId);
      console.log(`activities array:${category[0].activities}`);
      console.log(`activities id before:${category[0].activities[0].id}`);
      // Assuming category is an array and finding the activity
      const activity = category[0].activities.find((a) => a.id === Number(activityId)); //🐞Number was necessary because activityId in the params is a string
      console.log(`this is the activity variable${activity}`);
      if (!activity) {
        throw new Error('Activity not found');
      }

      console.log(`activities id  after:${category[0].activities[0].id}`);

      // When setting the state, use a fallback value like an empty string if the fetched data might be undefined or null
      setTitle(activity.title || '');
      setImage(activity.image || '');
      setDescription(activity.description || '');
      setLocation(activity.location || '');
      setStartTime(activity.startTime || '');
      setEndTime(activity.endTime || '');
    };

    if (activityId) {
      fetchCityData();
    }
  }, [cityName, categoryName, activityId]);

  const resetFormFields = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setStartTime('');
    setEndTime('');
    setImage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await editActivityDetails(cityName, categoryName, activityId, {//🛠❗❗❗ I might have to delete some states that are unesesaay hfee
        title,
        description,
        location,
        startTime,
        endTime,
        image,
      });

      resetFormFields();
      onClose(); // ✅ Close the modal on successful form submission
      // navigate(`/city/${cityName}/categories/${categoryName}`);
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
