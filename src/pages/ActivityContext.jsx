import { createContext, useContext, useState, useEffect } from 'react';

const CityContext = createContext();
const CategoryContext = createContext();
const ActivityContext = createContext();
const SelectedActivityContext = createContext();

export const useCitiesContext = () => {
  // This is the custom HOOK:❗
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCitiesContext must be used within an ActivityContext.Provider');
  }
  return context;
};

export const useCategoriesContext = () => {
  // This is the custom HOOK:❗
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCitiesContext must be used within an ActivityContext.Provider');
  }
  return context;
};

export const useActivitiesContext = () => {
  // This is the custom HOOK:❗
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivitiesContext must be used within an ActivityContext.Provider');
  }
  return context;
};

export const useSelectedActivityContext = () => {
  // This is the custom HOOK:❗
  const context = useContext(SelectedActivityContext);
  if (!context) {
    throw new Error('useActivitiesGamesContext must be used within an ActivityGamesContext.Provider');
  }
  return context;
};

export const ActivityProvider = ({ children }) => {
  const [cityList, setCityList] = useState([]); // this is this the state not the component
  const [categoryList, setCategoryList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  // const [activityGamesList, setActivityGamesList] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedCity, setSelectedCity] = useState('city name');
  // const [userPosts, setUserPosts] = useState([]); // State to hold the posts of the selected user

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://localhost:3000/cities');
        const citiesData = await response.json();
        // console.log(citiesData);
        // Assuming citiesData.cities is the object containing city keys
        const citiesArray = Object.values(citiesData); // Convert city objects to an array
        setCityList(citiesArray);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3000/categories');
  //       const activities = await response.json();
  //       setCategoryList(activities);
  //     } catch (error) {
  //       console.error('Error fetching users:', error);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  useEffect(() => {
    // const fetchActivities = async () => {
    //   try {
    //     const response = await fetch('http://localhost:3000/activities');
    //     const activities = await response.json();
    //     setActivityList(activities);
    //   } catch (error) {
    //     console.error('Error fetching users:', error);
    //   }
    // };
    // fetchActivities();
  }, []);

  const createCategory = async (userData) => {
    let newCategory; /*newUser inside try access the newUser outside  to receive it value or to give back a new value back to newUser so it can return ti. while modern JavaScript practices do encourage the use of const and limiting variable scope, this function requires newUser to be accessible in multiple block scopes within the same function, hence the initial let newUser; declaration. This approach ensures that newUser is accessible wherever it's needed within the function, despite the initial value assignment occurring inside a try block. */
    try {
      const userResponse = await fetch('http://localhost:3000/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          image: userData.image,
        }),
      });
      if (!userResponse.ok) throw new Error('Failed to create user');

      newCategory = await userResponse.json();
      setCategoryList((prevUserList) => [...prevUserList, newCategory]);

      // If the userData includes posts, create them for the new user
      // Checks if the userData object contains a 'posts' property with an array that has one or more elements. This is important to ensure that we only attempt to create posts for users who actually have post data included. It prevents unnecessary processing and potential errors from trying to handle an undefined or empty posts array.It also check if the post has content.
    } catch (error) {
      console.error('Error creating category:', error);
    }
    return newCategory; // Returning the new user object could be useful
  };

  const createActivity = async (userData) => {
    let newActivity; /*newUser inside try access the newUser outside  to receive it value or to give back a new value back to newUser so it can return ti. while modern JavaScript practices do encourage the use of const and limiting variable scope, this function requires newUser to be accessible in multiple block scopes within the same function, hence the initial let newUser; declaration. This approach ensures that newUser is accessible wherever it's needed within the function, despite the initial value assignment occurring inside a try block. */
    try {
      const userResponse = await fetch('http://localhost:3000/activities', {
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
    <CityContext.Provider value={{ cityList, setCityList,selectedCity, setSelectedCity, useCitiesContext }}>
      <CategoryContext.Provider value={{ categoryList, setCategoryList, createCategory }}>
        <ActivityContext.Provider
          value={{ activityList, setActivityList, selectedActivity, setSelectedActivity, createActivity, useActivitiesContext }}
        >
          <SelectedActivityContext.Provider value={{ selectedActivity }}>{children}</SelectedActivityContext.Provider>
        </ActivityContext.Provider>
      </CategoryContext.Provider>
    </CityContext.Provider>
  );
};

//-------------- this is the old return content:---------------

// return (
//   <CityContext.Provider value={{ useCitiesContext,cityList, setCityList, selectedCity, setSelectedCity }}> {/* the is the cities page */}

//     {/* ✅ Correct context provider for cities */}
//     <CategoryContext.Provider value={{ useCitiesContext, useCategoriesContext, categoryList, setCategoryList, createCategory, selectedCity, setSelectedCity }}> {/* the is the city page */}
//       <ActivityContext.Provider
//         value={{ useCitiesContext,  useActivitiesContext,activityList, setActivityList, selectedActivity, setSelectedActivity, createActivity, selectedCity, setSelectedCity }}
//       >{/* this is the activities page like Games*/}
//         <SelectedActivityContext.Provider value={{ selectedActivity, setSelectedActivity }}>{children}</SelectedActivityContext.Provider>{/* this is the selected activity page like Laser Game */}
//       </ActivityContext.Provider>
//     </CategoryContext.Provider>
//   </CityContext.Provider>
// );
