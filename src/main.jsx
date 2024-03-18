import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ActivityDetail } from './pages/Activity';
import { Activities } from './pages/Activities';
import { ActivitiesGames } from './pages/ActivitiesGames';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './components/Root';
import { ActivityProvider } from './pages/ActivityContext'; // Adjust the import path as needed
import { ActivityForm} from './pages/ActivityForm'; 


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Activities />,
        // loader: postListLoader,
      },
      {
        path: '/games/:gamesId',
        element: <ActivitiesGames />,
        // loader: postListLoader,
      },
      {
        path: '/activity/:activityId', //activity is virtual location set by the router
        element: <ActivityDetail />,
        // loader: postLoader,
        // action: addComment,
      },
      {
        path: '/activityForm/', //activity is virtual location set by the router
        element: <ActivityForm />,
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
