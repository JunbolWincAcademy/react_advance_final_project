import React from 'react';
import { useCitiesContext } from './ActivityContext'; // Adjust import as needed
import { useParams } from 'react-router-dom';
import { Heading, UnorderedList, ListItem, Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ActivityList = () => {
  const { cityList } = useCitiesContext(); // Assume cityList includes cities with their categories and activities

  const { cityName, activityTitle } = useParams(); // Use activityTitle or categoryName based on your routing parameter
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
  console.log('Activity Title from URL:', activityTitle);
  console.log('Attempting to Access Activities for Category:', selectedCity.categories[activityTitle]);

  // Assuming activityTitle refers to the category name and that categories are objects with activity arrays
  const activities = selectedCity ? selectedCity.categories[activityTitle][0].activities || [] : []; //there was a BIG 🐞 here this [0] was missing like saying games[0]

  console.log('Selected City:', selectedCity); // Debugging
  console.log('Activities:', activities); // Debugging

  return (
    <UnorderedList listStyleType="none">
      {activities.map((activity, index) => (
        <ListItem key={index} mb="2rem">
          {' '}
          {/* Consider using a more unique key if available */}
          <Link to={`/city/${cityName}/activities/${activityTitle}/activity/${activity.title}`}>
            <Heading size="md" mb="1rem">
              {activity.title}
            </Heading>
            {activity.image && <Image src={activity.image} alt={activity.title} style={{ width: '300px', height: 'auto' }} />}
          </Link>
        </ListItem>
      ))}
    </UnorderedList>
  );
};

export const Activities = () => {
  const { cityName, activityTitle } = useParams();

  return (
    <div className="App">
      <Heading mb="2rem">
        {activityTitle} to do in {cityName}
      </Heading>
      <Button>
        <Link to={`/activityForm/`}>Add an activity</Link>
      </Button>
      {<ActivityList />}
    </div>
  );
};

///-------
/* <Button size="xs" onClick={() => setSelectedActivity(activity)}>
            Activity Data
          </Button>{' '} 
          {/* <Button size="xs" onClick={() => deleteUser(user.id)}>
            Delete
          </Button> */
