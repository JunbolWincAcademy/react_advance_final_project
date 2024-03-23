import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Cities } from './pages/Cities';
import { City } from './pages/City';
import { Activities } from './pages/Activities';
import { ActivitiesGames } from './pages/ActivitiesGames';
import { Activity } from './pages/Activity';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './components/Root';
import { ActivityProvider } from './pages/ActivityContext'; // Adjust the import path as needed
import { CityForm } from './components/CityForm';
// import { ActivityForm } from './components/ActivityForm';
// import { CategoryForm } from './components/CategoryForm';

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
      // {
      //   path: '/categoryForm/', //activity is virtual location set by the router
      //   element: <CategoryForm />,
      // },
      {
        path: '/city/:cityName/activities/:activityTitle',
        element: <Activities />,
        // loader: postListLoader,
      },
      {
        path: '/city/:cityName/activities/:activityTitle/activity/:eventTitle', //activity is virtual location set by the router
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
