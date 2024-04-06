import { useState, useEffect } from 'react';
import { useCategoriesContext } from '../pages/ActivityContext';
import { Flex, FormControl, Input, Button, Box, Text } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

export const EditCategoryForm = () => {
  const navigate = useNavigate();
  const { cityName, categoryName } = useParams();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  const { editCategoryDetails } = useCategoriesContext();

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  useEffect(() => {
    const fetchCategoryData = async () => {
      const url = `http://localhost:3000/cities`; //only fetch always cites nothing else.The server does not have a route handler set up for /cities/Amsterdam.
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch city data: ${response.status}`);
      }
      const citiesData = await response.json();

      console.log('City Name:', cityName);
      console.log('Category Name:', categoryName);
      console.log('Fetching data from URL:', url);
      console.log('Response from fetch:', response);

      // Convert citiesData object to an array if necessary
      // Assuming citiesData is an object where each key is a city name
      const cityData = citiesData[cityName];
      if (!cityData) {
        throw new Error('City not found');
      }
      console.log('Name in CityData:', cityData);
      // Access the category object directly
      /*  const category = cityData.categories[categoryName];
      if (!category) {
        throw new Error('Category not found');
      } */

      // Assuming category details are directly accessible in the category object
      setName(cityData.categories[categoryName][0].name || ''); //🚩🐞ONCE AGAIN [0] was the missing code
      setImage(cityData.categories[categoryName][0].image || '');
    };

    console.log('name:', name);
    console.log('image:', image);

    if (cityName && categoryName) {
      fetchCategoryData();
    }
  }, [cityName, categoryName]);

  const resetFormFields = () => {
    setName('');
    setImage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const capitalizedCategoryName = capitalizeFirstLetter(name);

    try {
      await editCategoryDetails(cityName, categoryName, {
        name: capitalizedCategoryName,
        image,
      });

      // Logic to update the category details
      resetFormFields();
      navigate(`/city/${cityName}`);
    } catch (error) {
      console.error('Error updating activity details:', error);
    }
  };

  return (
    <Flex //🚩🐞to fix the issue of not been able to use FormControl I has to wrap it inside Flex and put the onSubmit here instead
      as="form"
      onSubmit={handleSubmit}
    >
      <FormControl display="flex" flexDir="column" p="1rem" m="1.5rem" bg="red.600" color="white" width="100%">
        <label htmlFor="title">
          <Text as="b">Name:</Text>
        </label>

        <Input
          bg="gray.200"
          color="black"
          mb="1rem"
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
          mb="1rem"
          type="url"
          required
          placeholder="URL to image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <Box display="flex" flexDir="column" alignItems="center" mt="2rem">
          <Button type="submit" width="50%" mb="1rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }}>
            Update Category
          </Button>
          <Button type="button" width="50%" mb="2rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }} onClick={resetFormFields}>
            Reset
          </Button>
        </Box>
      </FormControl>
    </Flex>
  );
};
