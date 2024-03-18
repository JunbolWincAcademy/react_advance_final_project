import React, { createContext, useContext, useState, useEffect } from 'react';

const ActivityContext = createContext();

export const useActivitiesContext = () => {
  // This is the custom HOOK:❗
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivitiesContext must be used within an ActivityContext.Provider');
  }
  return context;
};

const ActivityGamesContext = createContext();

export const useActivitiesGamesContext = () => {
  // This is the custom HOOK:❗
  const context = useContext(ActivityGamesContext);
  if (!context) {
    throw new Error('useActivitiesGamesContext must be used within an ActivityGamesContext.Provider');
  }
  return context;
};

export const ActivityProvider = ({ children }) => {
  const [activityList, setActivityList] = useState([]);
  const [activityGamesList, setActivityGamesList] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  // const [userPosts, setUserPosts] = useState([]); // State to hold the posts of the selected user

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:3000/categories');
        const activities = await response.json();
        setActivityList(activities);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchActivitiesGames = async () => {
      try {
        const response = await fetch('http://localhost:3000/events');
        const activitiesGames = await response.json();
        setActivityGamesList(activitiesGames);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchActivitiesGames();
  }, []);


  const createActivity = async (userData) => {
    let newActivity; /*newUser inside try access the newUser outside  to receive it value or to give back a new value back to newUser so it can return ti. while modern JavaScript practices do encourage the use of const and limiting variable scope, this function requires newUser to be accessible in multiple block scopes within the same function, hence the initial let newUser; declaration. This approach ensures that newUser is accessible wherever it's needed within the function, despite the initial value assignment occurring inside a try block. */
    try {
      const userResponse = await fetch('http://localhost:3000/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          image: userData.image,
        }),
      });
      if (!userResponse.ok) throw new Error('Failed to create user');

      newActivity = await userResponse.json();
      setActivityList((prevUserList) => [...prevUserList, newActivity]);

      // If the userData includes posts, create them for the new user
      // Checks if the userData object contains a 'posts' property with an array that has one or more elements. This is important to ensure that we only attempt to create posts for users who actually have post data included. It prevents unnecessary processing and potential errors from trying to handle an undefined or empty posts array.It also check if the post has content.

    } catch (error) {
      console.error('Error creating activity:', error);
    }
    return newActivity; // Returning the new user object could be useful
  };


  return (
    <ActivityContext.Provider
      value={{
        activityList,
        setActivityList,
        selectedActivity,
        setSelectedActivity,
        createActivity,
        // deleteUser,
        // createUser,
        // userPosts,
        // setUserPosts,
        // fetchPostsForSelectedUser,
        // createPostForUser,
        // deletePost,
      }}
    >
      <ActivityGamesContext.Provider
        value={{
          activityGamesList,
          setActivityGamesList,
        }}
      >
        {children}
      </ActivityGamesContext.Provider>
    </ActivityContext.Provider>
  );
};
