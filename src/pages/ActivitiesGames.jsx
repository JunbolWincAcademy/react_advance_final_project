import React from 'react';
import { ActivityProvider, useActivitiesGamesContext } from './ActivityContext'; // Adjust the import
// import { UserForm } from '../components/UserForm';
// import { Activity } from './Activity';
import { Heading, UnorderedList, ListItem, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ActivityGamesList = () => {
  const { activityGamesList, setActivityGsamesList } = useActivitiesGamesContext(); // Consuming the context to get the user list

  return (
    <UnorderedList listStyleType="none">
      {activityGamesList.map((activity) => (
        <ListItem key={activity.id} mb="2rem">
          <Heading size="md" mb="1rem">
            {activity.title}
          </Heading>
          <Link to={`/activity/${activity.id}`}>
            {' '}
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

export const ActivitiesGames = () => {
  return (
    <ActivityProvider>
      <div className="App">
        <Heading mb="2rem">Games to do in Amsterdam</Heading>
        {/* <UserForm /> */}
        <ActivityGamesList />
      </div>
    </ActivityProvider>
  );
};
