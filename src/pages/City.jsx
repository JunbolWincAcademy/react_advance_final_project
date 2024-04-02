import React from 'react';
import { useEffect } from 'react';
import { ActivityProvider, useCitiesContext, useCategoriesContext } from './ActivityContext'; // Adjust the import
import { useParams } from 'react-router-dom';
// import { UserForm } from '../components/UserForm';
// import { category } from './category';
import { Flex, Heading, UnorderedList, ListItem, Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const City = () => {
  const { cityList, selectedCity, setSelectedCity } = useCitiesContext(); // Use cityList from context
  const { deleteCategory } = useCategoriesContext();
  const { cityName, categoryName } = useParams(); // Extracting the city name from the URL

  useEffect(() => {
    setSelectedCity(cityName); //🚩this is the right place to this inside a useEffect
    // This will now only run when componentName changes, not on every render
  }, [cityName, setSelectedCity]);

  if (cityList.length === 0) {
    //this was the solution for the asynchronous issue fo cityList been undefined when needed there was a BIG 🐞 here
    // Render a loading indicator or return null while data is being fetched
    return <div>Loading...</div>;
  }
  console.log('here comes the cityList:');
  console.log(cityList);
  console.log('selectedCity IN CITY after been set in Cities:', selectedCity);
  // Find the selected city data from the cityList
  const selectedCityData = cityList.find((city) => city.name === cityName);
  console.log(selectedCityData);
  //setSelectedCity(cityName); //❌🚩THIS WAS MY SOLUTION but I put in the wrong place causing a SIDE EFFECT???❓
  // Assuming categories is an object with category names as keys
  const categories = selectedCityData ? Object.keys(selectedCityData.categories) : []; // 🚩creating the array categories
  /*  Using the ternary operator to check if selectedCityData exists. If it does, extract the keys from selectedCityData.categories (which are the category names) and create an array of these keys. If selectedCityData does not exist, assign an empty array to categories. This ensures categories is always an array, preventing errors during array operations like map. */
  return (
    <Flex flexDir="column" align="center" width="100%">
      <Heading size="xl" mb="2" mt="2">
        Activities to do in {cityName}
      </Heading>
      <Link to={`/city/${cityName}/categories/categoryForm`}>
        <Button borderRadius="8"size="sm" width="100%" mt="0.5rem"  bg="red.300"  color="black" _hover={{ bg: 'red', color: 'white' }}  size="sm">
          {/* // Assuming cityName and categoryName are variables holding the actual names */}
          Add a category
        </Button>
      </Link>
      <UnorderedList display="flex" flexDir="column"listStyleType="none" align="left">
        {categories.length > 0 &&
          categories.map((categoryName) => {
            const categoryDetailsArray = selectedCityData.categories[categoryName]; //using [] remember categories is an array here
            return categoryDetailsArray.map(
              (
                detail,
                index //❓ ✅ Use map on the array of details
              ) => (
                <ListItem key={detail.id} mb="2rem" flexDir="column" >
                  {' '}
                  {/* ✅ Ensure key is unique by using detail.id*/}
                  <Link to={`/city/${cityName}/categories/${detail.name}`} align="left">
                    <Heading size="lg" mb="1rem">
                      {detail.name}
                    </Heading>
                    {detail.image && <Image src={detail.image} alt={detail.name} style={{ width: '300px', height: 'auto' }} />}
                  </Link>
                  <Flex flexDir="column">
                    <Button borderRadius="8"size="sm" width="100%" mt="0.5rem"  bg="red.300"  color="black" _hover={{ bg: 'red', color: 'white' }} onClick={() => deleteCategory(cityName, categoryName)}>
                      Delete this category
                    </Button>
                    <Link to={`/city/${cityName}/categories/${categoryName}/editCategoryForm`} borderRadius="8"size="sm" width="100%" mt="0.5rem"  bg="red.300"  color="black" _hover={{ bg: 'red', color: 'white' }}>
                      <Button borderRadius="8"size="sm" width="100%" mt="0.5rem"  bg="red.300"  color="black" _hover={{ bg: 'red', color: 'white' }} >
                        Edit this Category
                      </Button>
                    </Link>
                  </Flex>
                </ListItem>
              )
            );
          })}
      </UnorderedList>
    </Flex>
  );
};
///-------
/* <UnorderedList listStyleType="none">
{categories.length > 0 &&
  categories.map((categoryName) => {
    const category = selectedCityData.categories[categoryName];
    return (
      <ListItem key={category.id} mb="2rem">
        <Heading size="md" mb="1rem">
          {category.name}
        </Heading>
        <Link to={`/city/${cityName}/activities/${category.name}`}>
          {category.image && <Image src={category.image} alt={category.name} style={{ width: '300px', height: 'auto' }} />}
  
        </Link>
        <Button onClick={() => deleteCategory(cityName, categoryName)}>Delete this  category</Button>
    
      </ListItem>
    );
  })}
</UnorderedList> */
