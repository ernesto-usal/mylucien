import React from 'react';
import BookList from '../components/BookList';
import AddBook from '../components/AddBook';
import MenuLateral from '../components/MenuLateral';
import SearchBookGoogle from '../components/SearchBookGoogle';
import AddAuthor from '../components/AddAuthor';

const routes = [
  {
    path: '/',
    exact: true,
    sidebar: () => <MenuLateral/>,
    main: () => <BookList/>
  }, {
    path: '/search-libro-google',
    sidebar: () => <MenuLateral/>,
    main: () => <SearchBookGoogle/>
  }, {
    path: '/add-libro',
    sidebar: () => <MenuLateral/>,
    main: () => <AddBook/>
  }, {
    path: '/add-author',
    sidebar: () => <MenuLateral/>,
    main: () => <AddAuthor/>
  }  
];

export default routes;