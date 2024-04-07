import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';

import { ActivityProvider } from './pages/ActivityContext';
import { Navigation } from './components/Navigation';
import { Cities } from './pages/Cities';
import { City } from './pages/City';
import { Categories } from './pages/Categories';
import { Activity } from './pages/Activity';
import { CityForm } from './components/CityForm';
import { CategoryForm } from './components/CategoryForm';
import { ActivityForm } from './components/ActivityForm';
import { EditCityForm } from './components/EditCityForm';
import { EditCategoryForm } from './components/EditCategoryForm';
import { EditActivityForm } from './components/EditActivityForm';
import { EditActivityDetailsForm } from './components/EditActivityDetailsForm';

export const App = () => {
  return (
    <ChakraProvider>
      <ActivityProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Cities />} />
          <Route path="/cityForm" element={<CityForm />} />
          <Route path="/city/:cityName" element={<City />} />
          <Route path="/city/:cityName/editCityForm" element={<EditCityForm />} />
          <Route path="/city/:cityName/categories/categoryForm" element={<CategoryForm />} />
          <Route path="/city/:cityName/categories/:categoryName" element={<Categories />} />
          <Route path="/city/:cityName/categories/:categoryName/editCategoryForm" element={<EditCategoryForm />} />
          <Route path="/city/:cityName/categories/:categoryName/activity/activityForm" element={<ActivityForm />} />
          <Route path="/city/:cityName/categories/:categoryName/activity/:activityId/:activityTitle" element={<Activity />} />
          <Route path="/city/:cityName/categories/:categoryName/activity/:activityId/:activityTitle/editActivityForm" element={<EditActivityForm />} />
          <Route path="/city/:cityName/categories/:categoryName/activity/:activityId/:activityTitle/editActivityDetailsForm" element={<EditActivityDetailsForm />} />
        </Routes>
      </ActivityProvider>
    </ChakraProvider>
  );
};
