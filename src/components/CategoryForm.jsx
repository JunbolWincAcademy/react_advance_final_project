import { useState, useEffect } from 'react';
import { useActivityContext } from '../pages/ActivityContext'; //you need to import the customen hook
import { Flex, FormControl, Input, Button, Box } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

export const CategoryForm = () => {
  const navigate = useNavigate();
  const { cityName } = useParams(); // 🟢 Use useParams to get the cityName from the URL
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  //   const { selectedCity } = useCitiesContext(); // Assuming selectedCity is part of your context
  const { createCategory } = useActivityContext();

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  useEffect(() => {
    if (!cityName) {
      alert('No city selected. Please select a city first.');
      navigate('/'); // Redirect user to home if no city is selected
    }
  }, [cityName, navigate]);

  const resetFormFields = () => {
    setName('');
    setImage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(name)) {
      alert('Please enter a valid name (letters only).');
      return;
    }
    const capitalizedCategoryName = capitalizeFirstLetter(name);
    try {
      await createCategory(cityName, { name: capitalizedCategoryName, image });
      resetFormFields();
      navigate(`/city/${cityName}`); // Navigate to the city's page after creating the category
    } catch (error) {
      console.error('Error creating category:', error);
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
        <Input
          bg="gray.200"
          color="black"
          id="location"
          mb="2rem"
          type="text"
          required
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        />
        <Box display="flex" flexDir="column" alignItems="center" mt="2rem">
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
