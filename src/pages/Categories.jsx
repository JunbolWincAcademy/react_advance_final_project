import React from 'react';
import { useCitiesContext, useActivitiesContext } from './ActivityContext'; // Adjust import as needed
import { useParams } from 'react-router-dom';
import { Flex, Heading, UnorderedList, ListItem, Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const CategoryList = () => {
  const { cityList } = useCitiesContext(); // Assume cityList includes cities with their categories and activities
  const { deleteActivity, setSelectedActivity, editActivity } = useActivitiesContext();
  const { cityName, categoryName } = useParams(); // Use activityTitle or categoryName based on your routing parameter
  console.log('URL cityName:', cityName); // Verifying this matches exactly with your data's city names
  // Find the selected city data

  if (cityList.length === 0) {
    //this was the solution for the asynchronous issue fo cityList been undefined when needed there was a BIG 🐞 here
    // Render a loading indicator or return null while data is being fetched
    return <div>Loading...</div>;
  }

  console.log('cityList:', cityList); // Check the structure and content

  const selectedCity = cityList.find((city) => city.name === cityName);
  console.log('Selected City Categories:', selectedCity.categories);
  console.log('Activity Title from URL:', categoryName);
  console.log('Attempting to Access Categories for Category:', selectedCity.categories[categoryName]);

  // Assuming activityTitle refers to the category name and that categories are objects with activity arrays
  const activities = selectedCity ? selectedCity.categories[categoryName][0].activities || [] : []; //there was a BIG 🐞 here this [0] was missing like saying games[0]

  console.log('Selected City:', selectedCity); // Debugging
  console.log('Activities:', activities); // Debugging

  return (
    <Flex flexDir="column" mt="1rem" align="center" width="100%" pl="0">
      <UnorderedList listStyleType="none">
        {activities.map((activity, index) => (
          <ListItem key={index} mb="2rem">
            {' '}
            {/* Consider using a more unique key if available */}
            <Link to={`/city/${cityName}/categories/${categoryName}/activity/${activity.id}/${activity.title}`}>
              <Heading size="md" mb="1rem" align="center">
                {activity.title}
              </Heading>
              {activity.image && <Image borderRadius="4" src={activity.image} alt={activity.title} style={{ width: '300px', height: 'auto' }} />}
            </Link>
            <Button
              borderRadius="8"
              size="sm"
              width="100%"
              mt="1rem"
              bg="red.300"
              color="black"
              _hover={{ bg: 'red', color: 'white' }}
              onClick={() => deleteActivity(cityName, categoryName, activity.id)}
            >
              Delete this activity
            </Button>
            <Link to={`/city/${cityName}/categories/${categoryName}/activity/${activity.id}/${activity.title}/editActivityForm`}>
              <Button borderRadius="8" size="sm" width="100%" mt="0.5rem" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
                Edit this activity
              </Button>
            </Link>
            {/*✅ categoryName was missing*/}
          </ListItem>
        ))}
      </UnorderedList>
    </Flex>
  );
};

export const Categories = () => {
  function capitalizeWords(string) {
    return string
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const { cityName, activityTitle, categoryName } = useParams();

  // Capitalize categoryName
  const capitalizedCategoryName = capitalizeWords(categoryName);

  return (
    <Flex flexDir="column"  align="center" width="100%" pl="0">
      <Heading size="lg" mb="2rem">
        {capitalizedCategoryName} to do in {cityName}
      </Heading>

      <Link to={`/city/${cityName}/categories/${categoryName}/activity/activityForm`}>
        <Button borderRadius="8" size="sm" width="100%" mt="0.5rem" bg="red.300" color="black" _hover={{ bg: 'red', color: 'white' }}>
          Add an activity
        </Button>
      </Link>
      {/*to get the right breadcrumb you nee to use good template literals.*/}
      {<CategoryList />}
    </Flex>
  );
};

///-------
/* <Button size="xs" onClick={() => setSelectedActivity(activity)}>
            Activity Data
          </Button>{' '} 
          {/* <Button size="xs" onClick={() => deleteUser(user.id)}>
            Delete
          </Button> */
