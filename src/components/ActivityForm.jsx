import { useState } from 'react';
import { useActivitiesContext } from '../pages/ActivityContext';
import { FormControl, Input, Button, Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

export const ActivityForm = () => {
  // State for each form field
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');

  // Extract cityName and categoryName from the URL
  const { cityName, categoryName } = useParams();

  const { createActivity } = useActivitiesContext(); // Use context to access createUser

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
    console.log({ cityName, categoryName });

    // Assuming createUser is correctly defined and accessible
    try {
      await createActivity(cityName, categoryName, {
        //this add the new content inside categoryName
        title,
        image,
      });
      resetFormFields();
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  return (
    <FormControl
      display="flex"
      flexDir="column"
      borderRadius="8"
      p="1rem"
      m="1.5rem"
      bg="red.600"
      color="white"
      width="auto"
      justifyContent="center"
      onSubmit={handleSubmit}
    >
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
          Add an event
        </Button>
        <Button type="button" width="50%" mb="2rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }}  onClick={resetFormFields}>
          Reset
        </Button>
      </Box>
    </FormControl>
  );
};
