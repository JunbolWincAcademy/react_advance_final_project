import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Cities } from './pages/Cities';
import { City } from './pages/City';
import { Categories } from './pages/Categories';
// import { Activities } from './pages/Activities';
import { Activity } from './pages/Activity';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './components/Root';
import { ActivityProvider } from './pages/ActivityContext'; // Adjust the import path as needed
import { CityForm } from './components/CityForm';
import { CategoryForm } from './components/CategoryForm';
import { ActivityForm } from './components/ActivityForm';
// import { ActivityForm } from './components/ActivityForm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Cities />,
        // loader: postListLoader,
      },
      {
        path: '/cityForm/', //activity is virtual location set by the router
        element: <CityForm />,
      },
      {
        path: '/city/:cityName',
        element: <City />,
        // loader: postListLoader,
      },
      {
        path: '/city/:cityName/categories/:categoryName',
        element: <Categories />,
        // loader: postListLoader,
      },
      {
        path: '/city/:cityName/categories/categoryForm', // Note: Adjusted to reflect a more appropriate URL structure
        element: <CategoryForm />,
      },
      // {
      //   path: '/city/:cityName/categories/:categoryName/activities/:activityTitle', //activity is virtual location set by the router
      //   element: <Activities />,
      //   // loader: postLoader,
      //   // action: addComment,
      // },
      {
        path: '/city/:cityName/categories/:categoryName/activities/activityForm', //activity is virtual location set by the router
        element: <ActivityForm />,
      },
      {
        path: '/city/:cityName/categories/:categoryName/activity/:activityTitle', //activity is virtual location set by the router
        element: <Activity />,
        // loader: postLoader,
        // action: addComment,
      },
    ],
  },
]);
// @ts-ignore

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <ActivityProvider>
        {/* Wrap RouterProvider with ActivityProvider */}
        <RouterProvider router={router} />
      </ActivityProvider>
    </ChakraProvider>
  </React.StrictMode>
);

//-----it was like this before---- so it wasnt working
/* ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
); */
