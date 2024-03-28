import { useState } from 'react';
import { ActivityProvider, useCategoriesContext } from '../pages/ActivityContext'; //you need to import the customen hook
import { Input, Button } from '@chakra-ui/react';

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
    <form onSubmit={handleSubmit}>
      <Input mb="1rem" type="text" required placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input mb="1rem" type="url" required placeholder="URL to image" value={image} onChange={(e) => setImage(e.target.value)} />
      <Button mb="2rem" mr="2rem" type="submit">
        Add Category
      </Button>
      <Button type="button" mb="2rem" onClick={resetFormFields}>
        Reset
      </Button>
    </form>
  );
};
