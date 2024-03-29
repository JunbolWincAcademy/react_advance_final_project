import React from 'react';
import { ActivityProvider, useCitiesContext } from './ActivityContext'; // Adjust the import
// import { UserForm } from '../components/UserForm';
// import { city } from './city';
import { Heading, UnorderedList, ListItem, Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const CityList = () => {
  //this is the component not the useSate
  const { cityList, deleteCity, selectedCity, setSelectedCity } = useCitiesContext(); // Consuming the context to get the cityList and setSelectedCity
  console.log('selectedCity before  been set in Cities:', selectedCity); //city name
  return (
    <UnorderedList listStyleType="none">
      {cityList.map((city) => (
        <ListItem key={city.id} mb="2rem">
          <Link
            to={`/city/${city.name}`}
            onClick={() => {
              setSelectedCity(city.name); // Update the selectedCity state with the clicked city's name
              console.log('selectedCity after click:', city.name);
              console.log('selectedCity after been set in Cities:', selectedCity); //this should return Paris
            }}
          >
            {/*// this link will take you to the city or image you click. The city HTML page is */}

            <Heading size="md" mb="1rem">
              {city.name}
            </Heading>
            {city.image && <Image src={city.image} alt={city.name} style={{ width: '300px', height: 'auto' }} />}
          </Link>
          <Button size="sm" onClick={() => deleteCity(city.name)}>
            {/*it was city.id before*/}
            Delete this city
          </Button>

          {/* <Button size="xs" onClick={() => setSelectedCity(city)}>
            city Data
          </Button>{' '} */}
          {/* <Button size="xs" onClick={() => deleteUser(user.id)}>
            Delete
          </Button> */}
        </ListItem> // Simple rendering, adjust as needed
      ))}
    </UnorderedList>
  );
};

//-------This the part of the Homegpage-------------

export const Cities = () => {
  return (
    <ActivityProvider>
      <div className="App">
        {/* <Heading mb="1rem">Activities to do around the world</Heading> */}
        <Button mb="1rem">
          <Link to={`/cityForm/`}> Add a city</Link>
        </Button>
        {/* <UserForm /> */}
        <CityList />
        {/* this is showing all the cities*/}
      </div>
    </ActivityProvider>
  );
};

///-------
