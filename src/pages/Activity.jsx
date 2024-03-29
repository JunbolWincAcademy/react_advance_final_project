import { useEffect, useState } from 'react';
import { useCitiesContext } from './ActivityContext'; // Adjusted to use a context that includes city data
import { useParams } from 'react-router-dom';
import { Flex, Box, Heading, Text, Image, Button } from '@chakra-ui/react';

export const Activity = () => {
  const { cityName, categoryName, activityTitle } = useParams();
  const { cityList } = useCitiesContext(); // This context now assumed to hold all city data
  const [activityDetails, setActivityDetails] = useState(null);

  useEffect(() => {
    if (cityList.length === 0) {
      return <div>Loading...</div>;
    }

    console.log('URL Params:', { cityName, categoryName, activityTitle });
    console.log('City List:', cityList);

    const city = cityList.find((city) => city.name === cityName);
    console.log('Found City:', city);

    const category = city ? city.categories[categoryName] : null; // Assuming direct access to category by name
    console.log('Found Category:', category);

    // ✅ Correctly find the activity using its title within the activities array of the found category
    const activity = category ? category[0].activities.find((a) => a.title === activityTitle) : null; //🚩here was a BIG 🐞 here this [0] was missing like saying category[0]
    console.log('Found Activity:', activity);

    if (activity) {
      setActivityDetails(activity);
    }
  }, [cityList, cityName, categoryName, activityTitle]);

  if (!activityDetails) return null;

  return (
    <Box border="1px" borderColor="gray.200" p="4" borderRadius="md">
      <Heading mb="2rem" size="md">
        Activity to do in {cityName}
      </Heading>
      <div>
        <Text as='b'>Activity Title:</Text> {activityDetails.title}
      </div>
      <div>
        <Text as='b'>Description:</Text> {activityDetails.description}
      </div>
      <div>
        <Text as='b'>Start time:</Text> {activityDetails.starttime}
      </div>
      <div>
        <Text as='b'>End time:</Text> {activityDetails.endTime}
      </div>
      {activityDetails.image && <Image src={activityDetails.image} alt={activityDetails.title} style={{ width: '300px', height: 'auto' }} />}
      <Flex flexDir="horizontal">
        <Box marginTop="1rem">
          <Button marginLeft="1rem" marginRight="2rem">
            Edit Details
          </Button>{' '}
          <Button>Add Details</Button>
        </Box>
      </Flex>
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
