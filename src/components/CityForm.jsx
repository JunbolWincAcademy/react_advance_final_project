import { useState } from 'react';
import { useActivityContext } from '../pages/ActivityContext';
import { Flex, FormControl, Box, Input, Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const CityForm = () => {
  const navigate = useNavigate();
  // State for each form field
  const [name, setName] = useState(''); //this is to have a controlled component.Remember to add value={name} and the onChange event handler in the input element.
  const [image, setImage] = useState('');
  const [countryCode, setCountryCode] = useState('');

  const { createCity } = useActivityContext(); // Use context to access createCity

  // Reset form fields
  const resetFormFields = () => {
    setName('');
    setCountryCode('');
    setImage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    function capitalizeCityName(string) {
      return string
        .split(' ') // Split the string into an array of words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
        .join(' '); // Join the array back into a single string, then append a comma
    }

    // Function to capitalize the first letter of the city name
    const capitalizeCountryLetters = (name) => {
      return name.toUpperCase();
    };

   // Validate and then capitalize the city name
const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
if (!nameRegex.test(name)) {
    alert('Please enter a valid city name (letters only).');
    return;
}



// Assuming country code should be 2 or 3 letters, case insensitive
const countryCodeRegex = /^[A-Za-z]{2,3}$/;
if (!countryCodeRegex.test(countryCode)) {
    alert('Please enter a valid country code (2 or 3 letters).');
    return;
}


    const capitalizedCityName = capitalizeCityName(name);
    const capitalizeCountryCode = capitalizeCountryLetters  (countryCode);

    // Assuming createCity is correctly defined and accessible
    try {
      await createCity({
        name: capitalizedCityName,
        countryCode: capitalizeCountryCode,
        image,
      });

      resetFormFields();

      navigate(`/`); // ✅ Navigate to the homepage
    } catch (error) {
      console.error('Error creating city:', error);
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
        <label htmlFor="city name">
          <Text as="b">City Name:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          id="location"
          mb="2rem"
          type="text"
          required
          placeholder="City Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="city name">
          <Text as="b">Country Code:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          mb="2rem"
          type="text"
          required
          placeholder="Country Code "
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        />
        <label htmlFor="city name">
          <Text as="b">Image URL:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          id="Image URL"
          mb="2rem"
          type="url"
          required
          placeholder="URL to image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <Box display="flex" flexDir="column" alignItems="center" mt="2rem">
          <Button type="submit" width="50%" mb="1rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }}>
            Add City
          </Button>
          <Button type="button" width="50%" mb="2rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }} onClick={resetFormFields}>
            Reset
          </Button>
        </Box>
      </FormControl>
    </Flex>
  );
};
