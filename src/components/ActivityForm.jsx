import { useState, useEffect } from 'react';
import { useActivitiesContext } from '../pages/ActivityContext';
import { Flex, FormControl, Input, Button, Box, Text } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

export const ActivityForm = () => {
  // State for each form field
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');

  // Extract cityName and categoryName from the URL
  const { cityName, categoryName } = useParams();
  const navigate = useNavigate();

  const { createActivity } = useActivitiesContext(); // Use context to access createUser

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  useEffect(() => {
    // 🟢 Using useEffect to handle any initial setup if needed
    // This is where you would fetch existing data if this were an edit form
    // For now, we don't need to fetch anything, but it's here for consistency and future expansion
    console.log(`Preparing to add activity for ${categoryName} in ${cityName}`);
  }, [cityName, categoryName]); // Depend on cityName and categoryName to re-run if these change

  // Reset form fields
  const resetFormFields = () => {
    setTitle('');
    setImage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Regex for validating name: allows letters and spaces but not only spaces
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(title)) {
      alert('Please enter a valid name (letters only, first and last name required).');
      return;
    }
    const capitalizedActivityTitle = capitalizeFirstLetter(title);
    try {
      await createActivity(cityName, categoryName, { title: capitalizedActivityTitle, image });
      resetFormFields();
      navigate(`/city/${cityName}/categories/${categoryName}`); // Navigate to the category page after creating the activity
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  return (
    <Flex //🚩🐞to fix the issue of not been able to use FormControl I has to wrap it inside Flex and put the onSubmit here instead
      as="form"
      onSubmit={handleSubmit}
    >
      <FormControl
        display="flex"
        flexDir="column"
        borderRadius="8"
        p="1rem"
        m="1.5rem"
        bg="red.600"
        color="white"
        width="100%"
        justifyContent="center"
      >
        <label htmlFor="title">
          <Text as="b">Title:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          id="location"
          mb="2rem"
          type="text"
          required
          placeholder="Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          _placeholder={{ color: 'gray.400' }}
        />
         <label htmlFor="image url">
          <Text as="b">URL to image:</Text>
        </label>

        <Input
          bg="gray.200"
          color="black"
          id="location"
          mb="2rem"
          type="url"
          required
          placeholder="URL to image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          _placeholder={{ color: 'gray.400' }}
        />
        <Box display="flex" flexDir="column" alignItems="center" mt="2rem">
          <Button type="submit" width="50%" mb="1rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }}>
            Add an activity
          </Button>
          <Button type="button" width="50%" mb="2rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }} onClick={resetFormFields}>
            Reset
          </Button>
        </Box>
      </FormControl>
    </Flex>
  );
};
