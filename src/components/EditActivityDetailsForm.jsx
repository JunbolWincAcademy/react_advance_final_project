import { useState, useEffect } from 'react';
import { useActivityDetailsContext } from '../pages/ActivityContext';
import { Input, Button, Box, Textarea, Text, FormControl, Select } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

export const EditActivityDetailsForm = () => {
  const navigate = useNavigate();
  const { cityName, categoryName, activityId, activityTitle } = useParams();

  // Initialize state with empty values; these will be updated by useEffect
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [image, setImage] = useState('');
  const [rating, setRating] = useState(3); // ✅ Added field
  const [userName, setUserName] = useState(''); // ✅ For editedBy
  const [userLastName, setUserLastName] = useState(''); // ✅ For editedBy

  const { createActivityDetails } = useActivityDetailsContext();

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
      console.log('Looking for activity ID:', activityId);
      console.log(`activities array:${category[0].activities}`);
      console.log(`activities id:${category[0].activities[0].id}`);
      // Assuming category is an array and finding the activity
      const activity = category[0].activities.find((a) => a.id === Number(activityId)); //🐞Number was necessary because activityId in the params is a string
      console.log(`activities:${activity}`);
      if (!activity) {
        throw new Error('Activity not found');
      }
      console.log(`activities id:${activity}`);
      console.log(`activities id:${category[0].activities[0].id}`);

      // Convert ISO date string to local datetime format for form compatibility
      const startDateTime = new Date(activity.startTime).toISOString().slice(0, 16); // ✅
      const endDateTime = new Date(activity.endTime).toISOString().slice(0, 16); // ✅

      // When setting the state, use a fallback value like an empty string if the fetched data might be undefined or null
      setTitle(activity.title || '');
      setImage(activity.image || '');
      setDescription(activity.description || '');
      setLocation(activity.location || '');
      setStartTime(startDateTime);
      setEndTime(endDateTime);
      setUserName('');
      setUserLastName('');
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
    setUserName('');
    setUserLastName('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Convert form datetime to ISO string if necessary for database
    const startDateTimeISO = new Date(startTime).toISOString(); // ✅
    const endDateTimeISO = new Date(endTime).toISOString(); // ✅

    try {
      await createActivityDetails(cityName, categoryName, activityId, {
        title,
        description,
        location,
        startTime: startDateTimeISO,
        endTime: endDateTimeISO,
        image,
        rating,
        editedBy: { userName, userLastName },
      });

      resetFormFields();
      navigate(`/city/${cityName}/categories/${categoryName}/activity/${activityId}/${title}`);
      //🚩❓navigate is used to programmatically redirect the user, which should force the component to re-render with the updated URL parameters. The { replace: true } option replaces the current entry in the history stack, so it doesn’t create a new history entry.
    } catch (error) {
      console.error('Error updating activity details:', error);
    }
  };

  return (
    <FormControl
      display="flex"
      flexDir="column"
      borderRadius="10"
      p="1rem"
      m="1.5rem"
      bg="red.600"
      color="white"
      width="auto"
      onSubmit={handleSubmit}
    >
      <label htmlFor="location">
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
      <label htmlFor="location">
        <Text as="b">Description:</Text>
      </label>
      <Textarea
        bg="gray.200"
        color="black"
        mb="1rem"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label htmlFor="location">
        <Text as="b">Location:</Text>
      </label>
      <Input
        bg="gray.200"
        color="black"
        id="location"
        mb="1rem"
        type="text"
        required
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        _placeholder={{ color: 'gray.400' }}
      />
      <label htmlFor="location">
        <Text as="b">Start Time:</Text>
      </label>
      <Input
        bg="gray.200"
        color="black"
        id="startTime"
        mb="1rem"
        type="datetime-local"
        required
        placeholder="Start Time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        _placeholder={{ color: 'gray.400' }}
      />
      <label htmlFor="location">
        <Text as="b">End Time:</Text>
      </label>
      <Input
        bg="gray.200"
        color="black"
        id="endTime"
        mb="1rem"
        type="datetime-local"
        required
        placeholder="End Time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        _placeholder={{ color: 'gray.400' }}
      />
      <label htmlFor="location">
        <Text as="b">Image URL:</Text>
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
        onChange={(e) => setImage(e.target.value)}
        _placeholder={{ color: 'gray.400' }}
      />
      <label htmlFor="location">
        <Text as="b">Give a rating</Text>
      </label>
      <Select
        bg="gray.200"
        color="black"
        mb="1rem"
        placeholder="Rating"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        _placeholder={{ color: 'gray.400' }}
      >
        {[1, 2, 3, 4, 5].map((number) => (
          <option key={number} value={number}>
            {number}
          </option>
        ))}
      </Select>
      <label htmlFor="location">
        <Text as="b">Edited by:</Text>
      </label>
      <Input
        bg="gray.200"
        color="black"
        mb="1rem"
        type="text"
        placeholder="Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        _placeholder={{ color: 'gray.400' }}
      />
      <Input
        bg="gray.200"
        color="black"
        mb="1rem"
        type="text"
        placeholder="Lastname"
        value={userLastName}
        onChange={(e) => setUserLastName(e.target.value)}
        _placeholder={{ color: 'gray.400' }}
      />
      <Box align="center" mt="2rem">
        <Button type="submit" width="80%" mb="2rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }}>
          Update Details
        </Button>
        <Button type="button" width="80%" mb="2rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }} onClick={resetFormFields}>
          Reset Input Fields
        </Button>
      </Box>
    </FormControl>
  );
};
