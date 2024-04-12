import { useState, useEffect } from 'react';
import { useActivityContext } from '../pages/ActivityContext';
import { Flex, Input, Button, Box, Textarea, Text, FormControl, Select } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

export const EditActivityDetailsForm = ({ activityDetails, onClose, onUpdate }) => {
  //onUpdate prop = updateActivityDetails function in Activity. Remember: <EditActivityDetailsForm activityDetails={activityDetails} onClose={onClose} onUpdate={updateActivityDetails} /> // const navigate = useNavigate();
  const { cityName, categoryName, activityId } = useParams();

  // Initialize state with empty values; these will be updated by useEffect
  const [title, setTitle] = useState(activityDetails?.title || '');
  const [image, setImage] = useState(activityDetails?.image || '');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [rating, setRating] = useState(3); // ✅ Added field
  const [userName, setUserName] = useState(''); // ✅ For editedBy
  const [userLastName, setUserLastName] = useState(''); // ✅ For editedBy

  const { editActivityDetails } = useActivityContext(); // 🟢 Ensure editActivityDetails is imported correctly

  useEffect(() => {
    const fetchCityData = async () => {
      const url = `http://localhost:3000/cities`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch city data: ${response.status}`);
      }
      const citiesData = await response.json();

      // Assuming citiesData is an object where each key is a city name
      const cityData = citiesData[cityName];

      if (!cityData) {
        throw new Error('City not found');
      }

      const category = cityData.categories[categoryName];
      if (!category) {
        throw new Error('Category not found');
      }

      // Assuming category is an array and finding the activity
      const activity = category[0].activities.find((a) => a.id === Number(activityId)); //🐞Number was necessary because activityId in the params is a string

      if (!activity) {
        throw new Error('Activity not found');
      }

      // Convert ISO date string to local datetime format for form compatibility
      const startDateTime = new Date(activity.startTime).toISOString().slice(0, 16); // ✅
      const endDateTime = new Date(activity.endTime).toISOString().slice(0, 16); // ✅

      // When setting the state, use a fallback value like an empty string if the fetched data might be undefined or null
      setTitle(activity.title || ''); // Fetches existing data for the activity and populates form fields OR give an empty value to prevent errors
      setImage(activity.image || '');
      setDescription(activity.description || '');
      setLocation(activity.location || '');
      setStartTime(startDateTime);
      setEndTime(endDateTime);
      setUserName('');
      setUserLastName('');
    };

    if (activityId) {
      fetchCityData();
    }
  }, [cityName, categoryName, activityId]);

  const resetFormFields = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setStartTime('');
    setEndTime('');
    setImage('');
    setUserName('');
    setUserLastName('');
  };

  const capitalizeActivityTitle = (string) => {
    // Trim the string to remove leading/trailing spaces and replace multiple spaces with a single space
    return string
      .trim()
      .replace(/\s\s+/g, ' ') // Replace multiple whitespaces with a single space
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleTitleBlur = (event) => {
    const { value } = event.target;
    const capitalizedTitle = capitalizeActivityTitle(value);
    setTitle(capitalizedTitle);
  };

  // 🟢 Function to capitalize the first letter of the description
  const handleDescriptionChange = (event) => {
    const { value } = event.target;
    // Capitalize the first letter if there is at least one character
    const capitalizedDescription = value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : ''; //if there is now input returns an empty string
    setDescription(capitalizedDescription);
  };
  // 🟢 Function to capitalize the first letter of the description
  const handleLocationChange = (event) => {
    const { value } = event.target;
    // Capitalize the first letter if there is at least one character
    const capitalizedLocation = value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : ''; //if there is now input returns an empty string
    setLocation(capitalizedLocation);
  };

  const handleUserNameChange = (event) => {
    const { value } = event.target;
    const upperCasedName = value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : ''; // Convert the entire input to uppercase
    setUserName(upperCasedName); // Set the state with the converted value
  };

  const handleUserLastNameChange = (event) => {
    const { value } = event.target;
    const upperCasedLastName = value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : ''; // Convert the entire input to uppercase
    setUserLastName(upperCasedLastName); // Set the state with the converted value
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // 🟢 Validate name and lastname fields to contain only letters
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/; // Regex for validating names (allows spaces between words)

    if (!nameRegex.test(userName) || !nameRegex.test(userLastName)) {
      alert('Name and Lastname must contain only letters.');
      return; // Stop the form submission
    }

    const capitalizedActivityName = capitalizeActivityTitle(title); // 🟢 Capitalize only when submitting

    try {
      await editActivityDetails(cityName, categoryName, activityId, {
        title: capitalizedActivityName,
        image,
      });

      // Convert form datetime to ISO string if necessary for database
      const startDateTimeISO = new Date(startTime).toISOString(); // ✅
      const endDateTimeISO = new Date(endTime).toISOString(); // ✅

      // On form submit, this gather all form fields to update the activity details:
      try {
        const updatedDetails = await editActivityDetails(cityName, categoryName, activityId, {
          title,
          description,
          location,
          startTime: startDateTimeISO,
          endTime: endDateTimeISO,
          image,
          rating,
          editedBy: { userName, userLastName },
        });

        resetFormFields();
        onUpdate(updatedDetails); // Update the updateActivityDetails  function in the Activity component with recent details from the form

        onClose();

        // navigate(`/city/${cityName}/categories/${categoryName}/activity/${activityId}/${title}`); NOT USED ANYMORE BECAUSEIM USING THE MODAL
        //🚩❓navigate is used to programmatically redirect the user, which should force the component to re-render with the updated URL parameters. The { replace: true } option replaces the current entry in the history stack, so it doesn’t create a new history entry.
      } catch (error) {
        console.error('Error updating activity details:', error);
      }
    } catch (error) {
      console.error('Error editing activity details:', error);
    }
  };

  return (
    <Flex //🚩🐞* to fix the issue of not been able to use FormControl I has to wrap it inside Flex and put the onSubmit here instead
      as="form"
      onSubmit={handleSubmit}
    >
      <FormControl display="flex" flexDir="column" border-radius="8" p="1rem" bg="red.600" color="white" width="90%" justifyContent="center">
        <label htmlFor="Title">
          <Text as="b">Title:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          mb="2rem"
          type="text"
          required
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Allow normal typing
          onBlur={handleTitleBlur} // Capitalize when the user exits the field
        />
        <label htmlFor="Image URL">
          <Text as="b">Image URL:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          id="image"
          mb="2rem"
          type="url"
          required
          placeholder="URL to image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          _placeholder={{ color: 'gray.400' }}
        />
        <label htmlFor="Description">
          <Text as="b">Description:</Text>
        </label>
        <Textarea
          bg="gray.200"
          color="black"
          mb="2rem"
          required
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange} // 🟢 Use the new function for handling changes
        />
        <label htmlFor="Location">
          <Text as="b">Location:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          id="location"
          mb="2rem"
          type="text"
          required
          placeholder="Location"
          value={location}
          onChange={handleLocationChange} // 🟢 Use the new function for handling changes
          _placeholder={{ color: 'gray.400' }}
        />
        <label htmlFor="Start Time">
          <Text as="b">Start Time:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          id="startTime"
          mb="2rem"
          type="datetime-local"
          required
          placeholder="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          _placeholder={{ color: 'gray.400' }}
        />
        <label htmlFor="End Time">
          <Text as="b">End Time:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          id="endTime"
          mb="2rem"
          type="datetime-local"
          required
          placeholder="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          _placeholder={{ color: 'gray.400' }}
        />

        <label htmlFor="Rating">
          <Text as="b">Give a rating</Text>
        </label>
        <Select
          bg="gray.200"
          color="black"
          mb="2rem"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          _placeholder={{ color: 'gray.400' }}
        >
          {[1, 2, 3, 4, 5].map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </Select>
        <label htmlFor="Edited by">
          <Text as="b">Edited by:</Text>
        </label>
        <label htmlFor="title">
          <Text as="b">Name:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          mb="1rem"
          type="text"
          required
          placeholder="Name"
          value={userName}
          onChange={handleUserNameChange} // Using the handler here
          _placeholder={{ color: 'gray.400' }}
        />
        <label htmlFor="title">
          <Text as="b">Lastname:</Text>
        </label>
        <Input
          bg="gray.200"
          color="black"
          mb="1rem"
          type="text"
          required
          placeholder="Lastname"
          value={userLastName}
          onChange={handleUserLastNameChange}
          _placeholder={{ color: 'gray.400' }}
        />
        <Box display="flex" flexDir="column" alignItems="center" mt="2rem">
          <Button type="submit" width="50%" mb="1rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }}>
            Update Details
          </Button>
          <Button type="button" width="50%" mb="2rem" color="white" bg="gray" _hover={{ bg: 'white', color: 'black' }} onClick={resetFormFields}>
            Reset Input Fields
          </Button>
        </Box>
      </FormControl>
    </Flex>
  );
};
