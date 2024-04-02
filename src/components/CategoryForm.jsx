import { useState } from 'react';
import { ActivityProvider, useCategoriesContext } from '../pages/ActivityContext'; //you need to import the customen hook
import { FormControl, Input, Button, Box } from '@chakra-ui/react';

export const CategoryForm = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  //   const { selectedCity } = useCitiesContext(); // Assuming selectedCity is part of your context
  const { selectedCity, categoryList, setCategoryList, createCategory } = useCategoriesContext(); // Assuming selectedCity is part of your context

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

    if (!selectedCity) {
      alert('No city selected. Please select a city first.');
      return;
    }
    console.log('Selected City at submission:', selectedCity);

    try {
      // Pass both the selected city name and category data to createCategory
      await createCategory(selectedCity, { name, image });
      resetFormFields();
    } catch (error) {
      console.error('Error creating category:', error);
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
      <Input  bg="gray.200"
        color="black"
        id="location"
        mb="2rem"
        type="text"required placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input  bg="gray.200"
        color="black"
        id="location"
        mb="2rem"
        type="url" required placeholder="URL to image" value={image} onChange={(e) => setImage(e.target.value)} />
      <Box display="flex" flexDir="column" alignItems="center" mt="2rem">
        <Button type="submit" width="50%" mb="1rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }}>
          Add Category
        </Button>
        <Button type="button" width="50%" mb="2rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }} onClick={resetFormFields}>
          Reset
        </Button>
      </Box>
    </FormControl>
  );
};
