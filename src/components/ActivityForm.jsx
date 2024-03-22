import { useState } from 'react';
import { useActivitiesContext } from '../pages/ActivityContext';
import { Input, Button } from '@chakra-ui/react';

export const ActivityForm = () => {
  // State for each form field
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

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

    // Assuming createUser is correctly defined and accessible
    try {
      await createActivity({
        name,
        image,
      });
      resetFormFields();
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle the error appropriately
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input mb="1rem" type="text" required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />

      <Input mb="1rem" type="url" required placeholder="URL to image" value={image} onChange={(e) => setImage(e.target.value)} />

      <Button mb="2rem" mr="2rem" type="submit">
        Add Activity
      </Button>
      <Button type="button" mb="2rem" onClick={resetFormFields}>
        Reset
      </Button>
    </form>
  );
};
