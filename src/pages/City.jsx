import React from 'react';
import { ActivityProvider, useCitiesContext } from './ActivityContext'; // Adjust the import
import { useParams } from 'react-router-dom';
// import { UserForm } from '../components/UserForm';
// import { category } from './category';
import { Heading, UnorderedList, ListItem, Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const City = () => {
  const { cityList } = useCitiesContext(); // Use cityList from context
  const { cityName } = useParams(); // Extracting the city name from the URL

  if (cityList.length === 0) {
    //this was the solution for the asynchronous issue fo cityList been undefined when needed there was a BIG 🐞 here
    // Render a loading indicator or return null while data is being fetched
    return <div>Loading...</div>;
  }
  console.log('here comes the cityList:');
  console.log(cityList);
  // Find the selected city data from the cityList
  const selectedCityData = cityList.find((city) => city.name === cityName);
  console.log(selectedCityData);
  // Assuming categories is an object with category names as keys
  const categories = selectedCityData ? Object.keys(selectedCityData.categories) : [];

  return (
    <>
      <Heading mb="2rem">Activities to do in {cityName}</Heading>
      <Button>
        <Link to={`/activityForm/`}>Add an activity</Link>
      </Button>
      <UnorderedList listStyleType="none">
        {categories.length > 0 &&
          categories.map((categoryName) => {
            const category = selectedCityData.categories[categoryName];
            return category.map((catDetail, index) => (
              <ListItem key={index} mb="2rem">
                <Heading size="md" mb="1rem">
                  {catDetail.name}
                </Heading>
                <Link to={`/city/${cityName}/activities/${catDetail.name}`}>
                  {catDetail.image && <Image src={catDetail.image} alt={catDetail.name} style={{ width: '300px', height: 'auto' }} />}
                </Link>
              </ListItem>
            ));
          })}
      </UnorderedList>
    </>
  );
};
///-------
//{`/category/${category.id}`}
