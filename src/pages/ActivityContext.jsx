import { createContext, useContext, useState, useEffect } from 'react';

const CityContext = createContext();
const ActivityContext = createContext();
const CategoryContext = createContext();
const SelectedActivityContext = createContext();
const ActivityDetailsContext = createContext();

// This is the useCitiesContext custom HOOK:❗
export const useCitiesContext = () => {
  // this consume 'context' values: cityList, etc...
  const context = useContext(CityContext); // what useContext is doing is like saying: "use this context (CityContext) context object  to provide it values: cityList, setCityList, etc to the entire app components". the context variable will represent all the values you give to CityContext.Provider like cityList, setCityList.
  if (!context) {
    throw new Error('useCitiesContext must be used within an ActivityContext.Provider');
  }
  return context;
};

// This is the useCategoryContext custom HOOK:❗
export const useCategoriesContext = () => {
  // this consume 'context' values: cityList, etc...
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within an CategoryContext.Provider');
  }
  return context;
};

// This is the useActivityContext custom HOOK:❗
export const useActivitiesContext = () => {
  // this consume 'context' values: cityList, etc...
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivityContext must be used within an CategoryContext.Provider');
  }
  return context;
};

// This is the useActivityDetailsContext custom HOOK:❗
export const useActivityDetailsContext = () => {
  // this consume 'context' values: cityList, etc...
  const context = useContext(ActivityDetailsContext);
  if (!context) {
    throw new Error('useActivityDetailsContext must be used within an CategoryContext.Provider');
  }
  return context;
};

//LOGIC TO CREATE THE GLOBAL ACTIVITY PROVIDER -------------------------------
export const ActivityProvider = ({ children }) => {
  const [cityList, setCityList] = useState([]); // this is this the state not the component
  const [selectedCity, setSelectedCity] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityDetails, setActivityDetails] = useState([]);

  // const [activityGamesList, setActivityGamesList] = useState([]);
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

  //LOGIC TO CREATE A NEW CITY-------------------------------

  //https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D

  const createCity = async (userData) => {
    try {
      // First, fetch the current state of the cities object
      const response = await fetch('http://localhost:3000/cities');
      const citiesData = await response.json();

      // Calculate the new ID based on the number of existing cities
      const newId = Object.keys(citiesData).length + 1;

      // Modify citiesData to include the new city
      const updatedCities = {
        ...citiesData,
        [userData.name]: {
          // Add the new city using its name as the key
          id: newId,
          name: userData.name,
          image: userData.image,
          categories: {}, // Assuming new cities start with no categories. This is important to add in order to add new categories
        },
      };

      // Use PUT to update the entire cities object
      await fetch('http://localhost:3000/cities', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCities),
      });

      // ✅ Update cityList state to include the new city and trigger UI update
      const newCityList = Object.values(updatedCities);
      setCityList(newCityList);
    } catch (error) {
      console.error('Failed to create city:', error);
    }
  };

  //lOGIC TO DELETE A CITY -------------------------------
  const deleteCity = async (cityName) => {
    try {
      const citiesResponse = await fetch('http://localhost:3000/cities');
      if (!citiesResponse.ok) throw new Error('Failed to fetch cities');
      let citiesData = await citiesResponse.json();

      if (citiesData.length === 0) {
        //this was the solution for the asynchronous issue fo cityList been undefined when needed there was a BIG 🐞 here
        // Render a loading indicator or return null while data is being fetched
        return <div>Loading...</div>;
      }

      // Directly modify the cities object within citiesData
      delete citiesData[cityName];

      // Send the updated cities object back to the server
      const updateResponse = await fetch('http://localhost:3000/cities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citiesData),
      });

      // const cities = updateResponse;

      if (!updateResponse.ok) throw new Error('Failed to update cities after deletion');

      // Correctly update the local state
      setCityList(Object.values(citiesData)); //(citiesData.cities)
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  };
  console.log('Selected City in ActivityContext before createCategory been called with setSelectedCity in it in Cities:', selectedCity); //to check if setSelectedCity is doing its work in Cities.jsx

  //LOGIC TO CREATE A NEW CATEGORY -----------------------------
  //https://images.unsplash.com/photo-1633545491399-54a16aa6a871?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D

  const createCategory = async (cityName, categoryData) => {
    try {
      const response = await fetch('http://localhost:3000/cities');
      if (!response.ok) throw new Error('Failed to fetch cities');
      const citiesData = await response.json();

      if (!citiesData[cityName]) throw new Error('City does not exist');

      // ✅ Create a new category object as an item within an array
      const newCategoryArray = [
        {
          id: Date.now(),
          name: categoryData.name,
          image: categoryData.image,
          activities: [], // Initializing an empty array for activities
        },
      ];

      // ✅ Ensure the category is added as an array containing the new category object
      if (!citiesData[cityName].categories) {
        citiesData[cityName].categories = {};
      }
      citiesData[cityName].categories[categoryData.name] = newCategoryArray;

      await fetch('http://localhost:3000/cities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citiesData),
      });

      // ✅ Update cityList state to reflect the new category in the UI
      const updatedCityList = Object.values(citiesData);
      setCityList(updatedCityList);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  //lOGIC TO DELETE A CATEGORY-------------------------------

  const deleteCategory = async (cityName, categoryName) => {
    try {
      const citiesResponse = await fetch('http://localhost:3000/cities');
      if (!citiesResponse.ok) throw new Error('Failed to fetch cities');
      let citiesData = await citiesResponse.json();

      if (citiesData.length === 0) {
        //this was the solution for the asynchronous issue fo cityList been undefined when needed there was a BIG 🐞 here
        // Render a loading indicator or return null while data is being fetched
        return <div>Loading...</div>;
      }
      console.log('citiesData log:', citiesData);
      console.log('cityName log inside citiesData:', citiesData[cityName]);
      // Check if the city exists
      if (!citiesData[cityName]) {
        console.error('City does not exist');
        return; // Exit if city not found
      }
      console.log('categoryName inside categories inside cityName log:', citiesData[cityName].categories[categoryName]);
      // Check if the category exists within the city
      if (!citiesData[cityName].categories[categoryName]) {
        console.error('Category does not exist within the city');
        return; // Exit if category not found
      }

      // ✅ Delete the specific category from the city
      delete citiesData[cityName].categories[categoryName]; // using nesting access

      //  this the updated cities object back to the server
      const updateResponse = await fetch('http://localhost:3000/cities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citiesData),
      });

      if (!updateResponse.ok) throw new Error('Failed to update cities after category deletion');

      // ✅ Optionally, update local state to reflect the change if applicable
      // Note: This part might need adjustments based on how you're managing state in your application.
      // This step is crucial if you're displaying categories from a local state that needs immediate updating.
      // ✅ Update local state to trigger re-render. 🚩This is what resolved the issue of React not reacting to the deleting
      const updatedCityList = Object.values(citiesData);
      setCityList(updatedCityList);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  //LOGIC TO CREATE A NEW ACTIVITY------------------------------
  // ✅ Updated logic for creating an activity within a specific category and city
  const createActivity = async (cityName, categoryName, activityData) => {
    //activityData= name and image
    try {
      // Fetch the current state of cities from your database
      const response = await fetch('http://localhost:3000/cities');
      if (!response.ok) throw new Error('Failed to fetch cities');
      const citiesData = await response.json();
      console.log(citiesData);
      console.log(citiesData[cityName]);
      // Ensure the city exists
      if (!citiesData[cityName]) throw new Error('City does not exist');
      // ✅ Ensure the category exists within the city
      if (!citiesData[cityName].categories[categoryName]) throw new Error('Category does not exist');

      // Prepare the new activity with a unique ID
      const newActivity = {
        ...activityData,
        id: Date.now(), // Unique ID for the new activity
      };

      // Add the new activity to the selected category of the selected city
      console.log('Before update - categories:', citiesData[cityName].categories);
      console.log('Before update - activities in categoryName:', citiesData[cityName].categories[categoryName]?.activities);

      // Correctly calculate updated activities with the new activity added.here was the big 🐞🚩 the addition of the [0] to tell the system to enter the only array that categoryName has. This was the s
      const updatedActivities = citiesData[cityName].categories[categoryName][0].activities
        ? [...citiesData[cityName].categories[categoryName][0].activities, newActivity] // ✅ Correctly access and update activities
        : [newActivity]; // ✅ Handle case where no activities exist yet

      // Now, correctly update the 'activities' array for the 'games' category
      citiesData[cityName].categories[categoryName][0].activities = updatedActivities; // ✅ Update the activities array correctly.// [0] added to fix the 🐞

      // Update the entire cities object back to the server
      await fetch('http://localhost:3000/cities', {
        //here is the 🐞
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citiesData),
      });

      console.log('After update - categories:', citiesData[cityName]);
      // ✅ Update cityList state to reflect the new activity in the UI
      const newCityList = Object.values(citiesData);
      setCityList(newCityList);

      console.log('Activity created successfully');
      return newActivity; // Optionally return the new activity object
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  //lOGIC TO DELETE AN ACTIVITY-------------------------------
  const deleteActivity = async (cityName, categoryName, activityId) => {
    try {
      const citiesResponse = await fetch('http://localhost:3000/cities');
      if (!citiesResponse.ok) throw new Error('Failed to fetch cities');
      let citiesData = await citiesResponse.json();

      if (!citiesData[cityName]) {
        console.error('City does not exist');
        return; // Exit if city not found
      }

      // Accessing the specific category within the city
      const category = citiesData[cityName].categories[categoryName];
      if (!category || !category[0] || !category[0].activities) {
        console.error('Category or activities not found');
        return; // Exit if category or activities not found
      }

      // Finding the activity by ID and removing it
      const activityIndex = category[0].activities.findIndex((activity) => activity.id === activityId);
      if (activityIndex !== -1) {
        // Activity found, now remove it
        category[0].activities.splice(activityIndex, 1); // 🛠 Remove the activity
      } else {
        console.error('Activity does not exist within the category');
        return; // Exit if activity not found
      }

      // Update the cities object back to the server
      await fetch('http://localhost:3000/cities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citiesData),
      });

      // Optionally, update local state to reflect the change
      const updatedCityList = Object.values(citiesData);
      setCityList(updatedCityList); // 🛠 Update local state to reflect the activity deletion
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  // LOGIC TO ADD DETAILS TO AN EXISTING ACTIVITY
  const createActivityDetails = async (cityName, categoryName, activityId, detailsData) => {
    try {
      // Fetch the current state of cities from your database
      const response = await fetch('http://localhost:3000/cities');
      if (!response.ok) throw new Error('Failed to fetch cities');
      const citiesData = await response.json();

      // Ensure the city and category exist
      if (!citiesData[cityName] || !citiesData[cityName].categories[categoryName]) {
        throw new Error('City or category does not exist');
      }

      // Find the specific activity within the category
      const category = citiesData[cityName].categories[categoryName][0];
      const activityIndex = category.activities.findIndex((activity) => activity.id.toString() === activityId);

      if (activityIndex === -1) {
        throw new Error('Activity does not exist');
      }

      // Update the activity with new details
      const updatedActivity = {
        ...category.activities[activityIndex],
        ...detailsData,
      };

      citiesData[cityName].categories[categoryName][0].activities[activityIndex] = updatedActivity;//🚩❓

      // Update the entire cities object back to the server
      await fetch('http://localhost:3000/cities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citiesData),
      });

      //   if (updatedActivity) {
      //     setActivityDetails(updatedActivity);
      // }

      // ✅ Update cityList state to reflect the new activity details in the UI
      const newCityList = Object.values(citiesData);//🚩❓How cityList gets extracted form newCityList if only [cityName] is the value of each city?
      setCityList(newCityList);

      console.log('Activity details added successfully');
      return updatedActivity; // Optionally return the updated activity object
    } catch (error) {
      console.error('Error updating activity details:', error);
    }
  };

  return (
    <ActivityContext.Provider value={{ selectedCity, activityList, deleteCity, setActivityList, selectedActivity, setSelectedActivity, createActivity }}>
      <CityContext.Provider value={{ cityList, setCityList, selectedCity, setSelectedCity, createCity, deleteCity }}>
        <CategoryContext.Provider value={{ selectedCity, deleteCategory, categoryList, setCategoryList, createCategory }}>
          <ActivityContext.Provider value={{ createActivity, deleteActivity, setSelectedActivity }}>
            <SelectedActivityContext.Provider value={{ selectedActivity }}>
              <ActivityDetailsContext.Provider value={{ createActivityDetails }}>{children}</ActivityDetailsContext.Provider>
            </SelectedActivityContext.Provider>
          </ActivityContext.Provider>
        </CategoryContext.Provider>
      </CityContext.Provider>
    </ActivityContext.Provider>
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
