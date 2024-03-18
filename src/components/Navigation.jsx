import React from 'react';
import { Flex, Heading, UnorderedList, Button, Box, Image, List } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  return (
    <Flex flexDir="horizontal" width="100" bg="red">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>{' '}
          </li>
          <li>
            <Link to="/Sports">Sports</Link>{' '}
          </li>
          <li>
            <Link to='/games/1'>Games</Link>{' '}  {/*I don't understand how by using '1' it goes to the games page'*/}
          </li>
          <li>
            <Link to="/Relaxation">Relaxation</Link>{' '}
          </li>
        </ul>
      </nav>
    </Flex>
  );
};
