import { useState, useEffect } from 'react';
import { useCitiesContext } from '../pages/ActivityContext';
import { Flex, FormControl, Input, Button, Box, Text } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

export const EditCityForm = () => {
  const navigate = useNavigate();
  const { cityName } = useParams();
  const { editCityDetails, cityList } = useCitiesContext();

  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [image, setImage] = useState('');
  const [cityId, setCityId] = useState(null);

  function capitalizeCityName(string) {
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
    const cityData = cityList.find((city) => city.name.toLowerCase() === cityName.toLowerCase());
    if (cityData) {
      setName(cityData.name);
      setCountryCode(cityData.countryCode.toUpperCase()); // ✅ Convert countryCode to uppercase
      setImage(cityData.image);
      setCityId(cityData.id);
    } else {
      console.error('City not found in the city list');
    }
  }, [cityName, cityList]);

  const resetFormFields = () => {
    setName('');
    setCountryCode('');
    setImage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const capitalizedCityName = capitalizeCityName(name);

    try {
      await editCityDetails(cityId, {
        name: capitalizedCityName,
        countryCode, // ✅ Use the state value directly as it's already uppercase
        image,
      });
      resetFormFields();
      navigate(`/`);
    } catch (error) {
      console.error('Error updating city details:', error);
    }
  };

  return (
    <Flex as="form" onSubmit={handleSubmit}>
      <FormControl display="flex" flexDir="column" p="1rem" m="1.5rem" bg="red.600" color="white" width="100%">
        <label htmlFor="city name">
          <Text as="b">City Name:</Text>
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
        <label htmlFor="country code">
          <Text as="b">Country Code:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          mb="1rem"
          type="text"
          required
          placeholder="Country Code"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value.toUpperCase())} // ✅ Ensure input is uppercase by force
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
