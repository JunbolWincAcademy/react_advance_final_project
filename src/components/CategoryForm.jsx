import { useState, useEffect } from 'react';
import { useActivityContext } from '../pages/ActivityContext'; // Import the custom hook
import { Flex, FormControl, Input, Button, Box, Text } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

export const CategoryForm = () => {
  const navigate = useNavigate();
  const { cityName } = useParams(); // Use useParams to get the cityName from the URL
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const { createCategory } = useActivityContext(); // Import the context function

  useEffect(() => {
    if (!cityName) {
      alert('No city selected. Please select a city first.');
      navigate('/'); // Redirect user to home if no city is selected
    }
  }, [cityName, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the category name
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(name)) {
      alert('Please enter a valid category name (letters only).');
      return;
    }
    const capitalizedCategoryName = name
      .split(' ') // Split the string into an array of words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
      .join(' '); // Join the array back into a single string
    try {
      await createCategory(cityName, { name: capitalizedCategoryName, image });
      resetFormFields();
      navigate(`/city/${cityName}`); // Navigate to the city's page after creating the category
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const resetFormFields = () => {
    setName('');
    setImage('');
  };

  return (
    <Flex as="form" onSubmit={handleSubmit} direction="column" m="1.5rem">
      <FormControl borderRadius="8" p="1rem" bg="red.600" color="white">
        <label htmlFor="title">
          <Text as="b">Category Name:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          mb="2rem"
          type="text"
          required
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="image url">
          <Text as="b">URL to image:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          mb="2rem"
          type="url"
          required
          placeholder="URL to image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <Box display="flex" flexDirection="column" alignItems="center" mt="2rem">
          <Button type="submit" width="50%" mb="1rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }}>
            Add Category
          </Button>
          <Button type="button" width="50%" mb="2rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }} onClick={resetFormFields}>
            Reset
          </Button>
        </Box>
      </FormControl>
    </Flex>
  );
};
