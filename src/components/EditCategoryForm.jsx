import { useState, useEffect } from 'react';
import { Input, Button } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

export const EditCategoryForm = () => {
  const navigate = useNavigate();
  const { cityName, categoryName } = useParams();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');

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
    // Logic to update the category details
    resetFormFields();
    navigate(`/city/${cityName}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input mb="1rem" type="text" required placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input mb="1rem" type="url" required placeholder="URL to image" value={image} onChange={(e) => setImage(e.target.value)} />
      <Button mb="2rem" mr="2rem" type="submit">
        Update Category
      </Button>
      <Button type="button" mb="2rem" onClick={resetFormFields}>
        Reset
      </Button>
    </form>
  );
};
