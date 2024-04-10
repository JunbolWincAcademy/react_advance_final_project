import { createContext, useContext, useState, useEffect } from 'react';

const CityContext = createContext();
const CategoryContext = createContext();
const ActivitiesContext = createContext();
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
  const context = useContext(ActivitiesContext);
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
  const [cityList, setCityList] = useState([]);
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
        setCityList(Object.values(citiesData)); // Assuming citiesData is your array or object of cities
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  //LOGIC TO ADD A NEW CITY-------------------------------

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
          countryCode: userData.countryCode,
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

  //lOGIC TO EDIT A CITY-------------------------------

  const editCityDetails = async (cityId, updatedCityData) => {
    // these props come from the form EditCity.jsx
    try {
      const response = await fetch('http://localhost:3000/cities');
      if (!response.ok) throw new Error('Failed to fetch cities');
      const citiesData = await response.json();

      // Finding  the specific city within the cities data
      let cityKey = Object.keys(citiesData).find((key) => citiesData[key].id === cityId); //Object. keys(citiesData) is selecting all the key properties names within the database 'cities' object
      if (!cityKey) {
        throw new Error('City does not exist');
      }

      // ✅Create a new object with the updated city name as the key
      const updatedCitiesData = { ...citiesData };
      delete updatedCitiesData[cityKey]; // Remove the old city key

      const newCityKey = updatedCityData.name; //✅ This  assigns the new city name provided by the user to 'newCityKey'.
      // 'updatedCityData.name' is expected to be the updated name of the city from the form input.

      // T✅his next line creates or updates a key property in 'updatedCitiesData' object with the key as 'newCityKey'.
      // It means it's adding or updating the city entry in our database object with the new city name as the key.
      // whatever
      updatedCitiesData[newCityKey] = {
        //✅🚩In this next line the spread operator copies all existing key properties like its (name and image) are been added to the new key city object.
        // It ensures that any properties not explicitly changed will remain the same in the updated city object.
        //This spread operator includes all the existing properties of the city object that we are updating. It ensures that any properties not explicitly changed in the update (like categories or any other information tied to the city) are carried over to the new object.
        ...citiesData[cityKey],

        // ✅In this next line the spread operator then copies/overwrites properties from 'updatedCityData' into the city object.
        // It ensures that any properties the user wants to update or add are correctly reflected in the updated city object.
        //This spread operator applies the changes or addition (name and url image) specified in updatedCityData to the new city object.
        ...updatedCityData, // Overwrites existing properties with the updated properties from the form

        //✅In this next line it explicitly sets the 'name' property of the city to be the new city name.
        // It ensures that the city's 'name' property inside the object also matches the new key in 'updatedCitiesData'.
        name: newCityKey,
      };

      // Updating the entire cities object back to the server
      await fetch('http://localhost:3000/cities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCitiesData),
      });

      // Updating cityList state to reflect the new city details and key in the UI
      setCityList(Object.values(updatedCitiesData)); // 🟢 Update cityList to reflect changes

      console.log('City details and key updated successfully');
    } catch (error) {
      console.error('Error updating city details:', error);
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
  // console.log('Selected City in ActivityContext before createCategory been called with setSelectedCity in it in Cities:', selectedCity); //to check if setSelectedCity is doing its work in Cities.jsx

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

  //lOGIC TO EDIT A CATEGORY-------------------------------

  const editCategoryDetails = async (cityName, oldCategoryName, updatedCategoryData) => {
    try {
      const response = await fetch('http://localhost:3000/cities');
      if (!response.ok) throw new Error('Failed to fetch cities');
      let citiesData = await response.json();

      // Check if the city exists
      if (!citiesData[cityName]) throw new Error('City does not exist');

      // Find the existing category
      const oldCategory = citiesData[cityName].categories[oldCategoryName];
      if (!oldCategory) throw new Error('Category does not exist');

      // Determine the new category name, either updated or the same as before
      const newCategoryName = updatedCategoryData.name || oldCategoryName;

      // If the category name has changed, we need to update the key in the categories object
      if (newCategoryName !== oldCategoryName) {
        delete citiesData[cityName].categories[oldCategoryName]; // Remove the old category key
        citiesData[cityName].categories[newCategoryName] = oldCategory; // Assign the category to the new key
      }

      // Update the category details
      citiesData[cityName].categories[newCategoryName][0] = {
        ...oldCategory[0],
        ...updatedCategoryData,
        name: newCategoryName, // Ensure the category's name property is also updated
      };

      // Send the updated cities data back to the server
      await fetch('http://localhost:3000/cities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citiesData),
      });

      // Update local state to reflect the changes
      setCityList(Object.values(citiesData));
    } catch (error) {
      console.error('Error updating category details:', error);
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
      // console.log('citiesData log:', citiesData);
      // console.log('cityName log inside citiesData:', citiesData[cityName]);
      // Check if the city exists
      if (!citiesData[cityName]) {
        console.error('City does not exist');
        return; // Exit if city not found
      }
      // console.log('categoryName inside categories inside cityName log:', citiesData[cityName].categories[categoryName]);
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
      // console.log(citiesData);
      // console.log(citiesData[cityName]);
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
      // console.log('Before update - categories:', citiesData[cityName].categories);
      // console.log('Before update - activities in categoryName:', citiesData[cityName].categories[categoryName]?.activities);

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

  //lOGIC TO EDIT AN ACTIVITY-------------------------------

  const editActivityDetails = async (cityName, categoryName, activityId, updatedActivityData) => {
    try {
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
      category.activities[activityIndex] = {
        // 📌 Selects the specific activity to update
        ...category.activities[activityIndex], // 📌 Merges new activity details into the existing activity object
        ...updatedActivityData,
      };

      // Update the entire cities object back to the server
      await fetch('http://localhost:3000/cities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citiesData),
      });

      // Update cityList state to reflect the new activity details in the UI
      setCityList(Object.values(citiesData));

      console.log('Activity details updated successfully');
    } catch (error) {
      console.error('Error updating activity details:', error);
    }
  };

  //lOGIC TO DELETE AN ACTIVITY-------------------------------
  const deleteActivity = async (cityName, categoryName, activityTitle) => {
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
      const activityIndex = category[0].activities.findIndex((activity) => activity.title === activityTitle);
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

      // Finds and updates the specific activity within the city's category
      const updatedActivity = {
        ...category.activities[activityIndex], //this select the activity within the list (...) of categories
        ...detailsData, // detailsData comes from the parameter of the createActivityDetails, which is in fact the object in the form. The spread operator ...detailsData merges these new details into the existing activity object, effectively updating it.
      };

      citiesData[cityName].categories[categoryName][0].activities[activityIndex] = updatedActivity; //🚩❓

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
      const newCityList = Object.values(citiesData); //🚩❓How cityList gets extracted form newCityList if only [cityName] is the value of each city?
      setCityList(newCityList);

      console.log('Activity details added successfully');
      return updatedActivity; // Optionally return the updated activity object
    } catch (error) {
      console.error('Error updating activity details:', error);
    }
  };

  // Pass all state and functions through the context value
  const value = {
    cityList,
    setCityList,
    selectedCity,
    setSelectedCity,
    categoryList,
    setCategoryList,
    activityList,
    setActivityList,
    selectedActivity,
    setSelectedActivity,
    activityDetails,
    setActivityDetails,
    // Adding functions for creating, editing, and deleting here
    createCity,
    editCityDetails,
    deleteCity,
    createCategory,
    editCategoryDetails,
    deleteCategory,
    createActivity,
    editActivityDetails,
    deleteActivity,
    createActivityDetails,
  };

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
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
