import { useState, useEffect } from 'react';
import { useCitiesContext } from '../pages/ActivityContext';
import { Flex, FormControl, Input, Button, Box, Text } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

export const EditCityForm = () => {
  const navigate = useNavigate();
  const { cityName } = useParams();
  const { editCityDetails, cityList } = useCitiesContext();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [cityId, setCityId] = useState(null);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  useEffect(() => {
    const cityData = cityList.find((city) => city.name.toLowerCase() === cityName.toLowerCase());
    if (cityData) {
      setName(capitalizeFirstLetter(cityData.name));
      setImage(cityData.image);
      setCityId(cityData.id);
    } else {
      console.error('City not found in the city list');
    }
  }, [cityName, cityList]); // 🟢 Ensure dependencies are correct for useEffect

  const resetFormFields = () => {
    setName('');
    setImage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const capitalizedCityName = capitalizeFirstLetter(name);

    try {
      await editCityDetails(cityId, { name: capitalizedCityName, image });
      resetFormFields();
      navigate(`/`);
    } catch (error) {
      console.error('Error updating city details:', error);
    }
  };

  return (
    <Flex //🚩🐞to fix the issue of not been able to use FormControl I has to wrap it inside Flex and put the onSubmit here instead
      as="form"
      onSubmit={handleSubmit}
    >
      <FormControl display="flex" flexDir="column" p="1rem" m="1.5rem" bg="red.600" color="white" width="100%">
        <label htmlFor="city name">
          <Text as="b">City name:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          mb="1rem"
          type="text"
          required
          placeholder="City Name"
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
            Update City
          </Button>
          <Button type="button" width="50%" mb="2rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }} onClick={resetFormFields}>
            Reset
          </Button>
        </Box>
      </FormControl>
    </Flex>
  );
};
