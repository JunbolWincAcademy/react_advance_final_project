import React from 'react';
import { ActivityProvider, useCitiesContext } from './ActivityContext'; // Adjust the import
import { useParams } from 'react-router-dom';
// import { UserForm } from '../components/UserForm';
// import { category } from './category';
import { Heading, UnorderedList, ListItem, Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const City = () => {
  const { cityList, selectedCity } = useCitiesContext(); // Use cityList from context
  const { cityName } = useParams(); // Extracting the city name from the URL

  // Find the selected city data from the cityList
  const selectedCityData = cityList.find(city => city.name === cityName);

  // Assuming categories is an object with category names as keys
  const categories = selectedCityData ? Object.keys(selectedCityData.categories) : [];

  return (
    <>
    <Heading mb="2rem">
    Activities  to do in {cityName}
        </Heading>
     <UnorderedList listStyleType="none">
      {categories.length > 0 && categories.map((categoryName) => {
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
