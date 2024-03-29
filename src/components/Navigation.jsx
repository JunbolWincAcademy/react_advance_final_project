import React from 'react';
import { Flex, Heading, Menu, MenuList, MenuItem, MenuButton, IconButton, Box } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link, useParams } from 'react-router-dom';

export const Navigation = () => {
  const { cityName, categoryName } = useParams();

  return (
    // Ensure the Flex container has width set to 100%
    <Flex flexDir="row" alignItems="center" justifyContent="space-between" width="100%" bg="red.500" p="2">
      <Link to="/">
        <Heading size="lg" color="white">
          Activities around the world {/* ✅ Header title */}
        </Heading>
      </Link>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<HamburgerIcon />}
          variant="outline"
          mr="1rem"
          variant="ghost"
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
