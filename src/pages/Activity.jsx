import React, { useEffect, useState } from 'react';
import { useActivitiesContext } from './ActivityContext'; // Ensure this import is correct
import { useParams } from 'react-router-dom'; // ✅ Import useParams
import { Box, Text, Image } from '@chakra-ui/react';

export const ActivityDetail = () => {
  const { activityId } = useParams(); // ✅ Use useParams to get activityId from the route. I need to study this❗🚩
  const [activityDetails, setActivityDetails] = useState(null);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        const activityDetailsResponse = await fetch(`http://localhost:3000/events/${activityId}`); // ✅ Use activityId from useParams
        const activityDetailsData = await activityDetailsResponse.json();
        console.log(activityDetailsData); // Add this line
        setActivityDetails(activityDetailsData);
      } catch (error) {
        console.error('Failed to fetch activity details:', error);
      }
    };

    if (activityId) {
      // ✅ Ensure there's an id to fetch
      fetchActivityDetails();
    }
  }, [activityId]); // ✅ Depend on activityId from the route

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
