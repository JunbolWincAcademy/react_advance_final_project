import { useEffect, useState } from 'react';
import { useCitiesContext } from './ActivityContext'; // Adjusted to use a context that includes city data
import { useParams } from 'react-router-dom';
import { Box, Text, Image } from '@chakra-ui/react';

export const Activity = () => {
  const { cityName, activityTitle, eventTitle } = useParams();
  const { cityList } = useCitiesContext(); // This context now assumed to hold all city data
  const [activityDetails, setActivityDetails] = useState(null);

  useEffect(() => {
    if (cityList.length === 0) {
      //this was the solution for the asynchronous issue fo cityList been undefined when needed there was a BIG 🐞 here
      // Render a loading indicator or return null while data is being fetched
      return <div>Loading...</div>;
    }

    console.log('URL Params:', { cityName, activityTitle });
    console.log('City List:', cityList);

    const city = cityList.find((city) => city.name === cityName);
    console.log('Found City:', city);

    const category = city ? city.categories[activityTitle][0] : null; //here was a BIG 🐞 here this [0] was missing like saying games[0]
    console.log('Found Category:', category);

    const activity = category ? category.activities.find((a) => a.title === eventTitle) : null; // If using title as ID, ensure matching is correct
    console.log('Found Activity:', activity);

    if (activity) {
      setActivityDetails(activity);
    }
  }, [cityList, cityName, activityTitle]);

  if (!activityDetails) return null;

  return (
    <Box border="1px" borderColor="gray.200" p="4" borderRadius="md">
      <Text>Activity Title: {activityDetails.title}</Text>
      <Text>Description: {activityDetails.description}</Text>
      <Text>Start Time: {activityDetails.startTime}</Text>
      <Text>End Time: {activityDetails.endTime}</Text>
      {activityDetails.image && <Image src={activityDetails.image} alt={activityDetails.title} style={{ width: '300px', height: 'auto' }} />}
    </Box>
  );
};

////------- backup--------

/*

 </Box> fetchPosts();  ✅ Call to fetch posts */
/*this is to ensure that any asynchronous tasks that were started by the effect do not try to update the component state after the component has unmounted or the effect cleanup has run. This is crucial for avoiding potential bugs and memory leaks where an effect's cleanup might be run (due to the component unmounting or dependencies changing) before an asynchronous operation has completed.  */

/*return () => {
      // this is the clean up function
      ignore = true;} // this will prevent to fetching the data again


  
     /* Display user posts */
/* {userPosts.length > 0 && ( //it was posts.length */
/*  <>
          <Text mt="4" mb="2" fontWeight="bold">
            Posts:
          </Text>
          {userPosts.map(
            (
              post //it was like posts.map(())... here was the big 🐞
            ) => (
              <Box key={post.id} mb="2">
                <Text fontWeight="bold">{post.title}</Text>
                <Text>{post.body}</Text>
                <Button
                  fontWeight="bold"
                  onClick={() => {
                    deletePost(post.id);
                  }}
                >
                  Delete
                </Button>
              </Box>
            )
          )}
        </> */
