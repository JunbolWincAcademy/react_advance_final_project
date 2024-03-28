import { useState } from 'react';
import { useActivitiesContext } from '../pages/ActivityContext';
import { Input, Button } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

export const ActivityForm = () => {
  // State for each form field
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  // Extract cityName and categoryName from the URL
  const { cityName, categoryName } = useParams();

  const { createActivity } = useActivitiesContext(); // Use context to access createUser

  // Reset form fields
  const resetFormFields = () => {
    setName('');
    setImage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Regex for validating name: allows letters and spaces but not only spaces
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(name)) {
      alert('Please enter a valid name (letters only, first and last name required).');
      return;
    }
    console.log({ cityName, categoryName });

    // Assuming createUser is correctly defined and accessible
    try {
      await createActivity(cityName, categoryName, {
        name,
        image,
      });
      resetFormFields();
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input mb="1rem" type="text" required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />

      <Input mb="1rem" type="url" required placeholder="URL to image" value={image} onChange={(e) => setImage(e.target.value)} />

      <Button mb="2rem" mr="2rem" type="submit">
        Add an event
      </Button>
      <Button type="button" mb="2rem" onClick={resetFormFields}>
        Reset
      </Button>
    </form>
  );
};
