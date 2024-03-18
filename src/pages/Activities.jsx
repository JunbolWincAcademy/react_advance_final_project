import React from 'react';
import { ActivityProvider, useActivitiesContext } from './ActivityContext'; // Adjust the import
// import { UserForm } from '../components/UserForm';
// import { Activity } from './Activity';
import { Heading, UnorderedList, ListItem, Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ActivityList = () => {
  const { activityList, setSelectedActivity } = useActivitiesContext(); // Consuming the context to get the user list

  return (
    <UnorderedList listStyleType="none">
      {activityList.map((activity) => (
        <ListItem key={activity.id} mb="2rem">
          <Heading size="md" mb="1rem">
            {activity.name}
          </Heading>
          <Link to={`/games/${activity.id}`}>
            {activity.image && <Image src={activity.image} alt={activity.name} style={{ width: '300px', height: 'auto' }} />}
          </Link>

          {/* <Button size="xs" onClick={() => setSelectedActivity(activity)}>
            Activity Data
          </Button>{' '} */}
          {/* <Button size="xs" onClick={() => deleteUser(user.id)}>
            Delete
          </Button> */}
        </ListItem> // Simple rendering, adjust as needed
      ))}
    </UnorderedList>
  );
};

export const Activities = () => {
  return (
    <ActivityProvider>
      <div className="App">
        <Heading mb="2rem">Activities to do in Amsterdam</Heading>
        <Button>
          <Link to={`/activityForm/`}> Add an activity</Link>
        </Button>
        {/* <UserForm /> */}
        <ActivityList />
      </div>
    </ActivityProvider>
  );
};
///-------
//{`/activity/${activity.id}`}
