import React, { useState, useEffect } from 'react';
import { Flex, Heading, Menu, MenuList, MenuItem, MenuButton, IconButton, Text, Fade, Box } from '@chakra-ui/react';
import { faEarthAmericas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { keyframes } from '@emotion/react';
import { Link, useParams } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';

export const Navigation = () => {
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    //the ice on the cake :)
    const timer = setTimeout(() => {
      setShowIcon(true);
    }, 500); // Triggers the fade-in after 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const element = showIcon ? (
    <Box style={{ opacity: 1, transition: 'opacity 3s ease-in-out' }}>
      <FontAwesomeIcon icon={faEarthAmericas} fontSize="100%" />
    </Box>
  ) : (
    <Box style={{ opacity: 0 }}>
      <FontAwesomeIcon icon={faEarthAmericas} fontSize="100%" />
    </Box>
  );

  const { cityName, categoryName } = useParams();
  return (
    <Flex flexDir="row" alignItems="center" justifyContent="space-between" width="100%" bg="red.600" p="2" mb="1rem">
      <Link to="/">
        <Heading display="flex" flexDir="row" fontSize="150%" color="white" alignItems="center">
          W
          <Text display="flex" flexDir="row" alignItems="center" mt="6px" fontSize="55%">
            {element}
          </Text>
          rld's Activities
        </Heading>
      </Link>

      <Menu>
        <MenuButton
          as={IconButton}
          icon={<HamburgerIcon />}
          variant="outline"
          mr="1rem"
          _hover={{ bg: '#FF7074' }}
          _active={{
            bg: 'red.500',
            transform: 'scale(0.98)',
            borderColor: 'white',
            borderWidth: '0.1rem',
          }}
        />
        <MenuList width="100vw" alignItems="center">
          {' '}
          {/* ✅ Adjusted width to auto and set min-width */}
          <MenuItem as={Link} to="/" width="100%" justifyContent="center">
            Home {/* ✅ Centered MenuItem */}
          </MenuItem>
          {cityName && (
            <MenuItem as={Link} to={`/city/${cityName}`} width="100%" justifyContent="center">
              City {/* ✅ Centered MenuItem */}
            </MenuItem>
          )}
          {cityName && categoryName && (
            <MenuItem as={Link} to={`/city/${cityName}/categories/${categoryName}`} width="100%" justifyContent="center">
              Category {/* ✅ Centered MenuItem */}
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
};
