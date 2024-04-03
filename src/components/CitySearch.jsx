import { useState, useEffect } from 'react';
import { Center, Heading } from '@chakra-ui/react';
import { Cities } from './pages/cities';
import { TextInput } from '../components/ui/TextInput';

export const CitySearch = ({ clickFn }) => {
  const [searchField, setSearchField] = useState('');
  const [cities, setRecipes] = useState([]); // State to store the fetched recipes

  useEffect(() => {
    fetch('http://localhost:3000/cities')
      .then((response) => response.json())
      .then((cities) => {
        setRecipes(cities); // Adjust based on your JSON structure
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (event) => {
    setSearchField(event.target.value);
  };

  const matchedCity = cities.filter((hit) => hit.city.label.toLowerCase().includes(searchField.toLowerCase()));

  return (
    <>
      <Center display="flex" flexDir="column">
        <Heading size="lg" marginBottom="1rem">
          Search for recipes
        </Heading>
        <TextInput changeFn={handleChange} mb={8} />
        <Cities clickFn={clickFn} city={matchedCity} />
      </Center>
    </>
  );
};
