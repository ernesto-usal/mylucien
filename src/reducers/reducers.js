import {combineReducers} from 'redux';
import {REQUEST_BOOKS, RECEIVE_BOOKS, REQUEST_BOOK_BY_ID, RECEIVE_BOOK_BY_ID, POST_BOOK, RECEIVE_RES_POST_BOOK,
        SEARCH_REQUEST_GOOGLE_BOOKS, RECEIVE_RES_GOOGLE_BOOKS, REQUEST_AUTHORS, RECEIVE_AUTHORS, POST_AUTHOR, 
        RECEIVE_RES_POST_AUTHOR, DELETE_BOOK, RECEIVE_RES_DELETE_BOOK, CLEAN_DEL_STATE, SET_STATE_BOOK,
        RECEIVE_RES_SET_STATE_BOOK, CLEAN_CHANGE_STATE} from '../actions/actions';
import {createForms} from 'react-redux-form';


// -------------------------
// ----- BOOKS API
// -------------------------

// Reducer that trasform the state linked to recover a list of books from the API
function booksFromApi(state = {
  isFetching: false,
  books: []
}, action) {
  switch (action.type) {
    case RECEIVE_BOOKS:
      return Object.assign({}, state, {
        isFetching: false,
        books: action.books,
        lastUpdated: action.receivedAt
      });
    case REQUEST_BOOKS:
      return Object.assign({}, state, {isFetching: true});
    default:
      return state;
  }
}

// Reducer that trasform the state linked to recover a book from the API
function bookFromApi(state = {
  isFetching: false,
  book: {}
}, action) {
  switch (action.type) {
    case RECEIVE_BOOK_BY_ID:
      return Object.assign({}, state, {
        isFetching: false,
        book: action.book,
        lastUpdated: action.receivedAt
      });
    case REQUEST_BOOK_BY_ID:
      return Object.assign({}, state, {isFetching: true});
    default:
      return state;
  }
}

// Reducer that trasform the state linked to delete a book from the API
function bookDelApi(state = {
  isDeleting: false,
  response: {}
}, action) {
  switch (action.type) {
    case RECEIVE_RES_DELETE_BOOK:
      return Object.assign({}, state, {
        isDeleting: false,
        response: action.response,
        deletedCorrectly: (action.response.errors) ? false : true
      });
    case DELETE_BOOK:
      return Object.assign({}, state, {isDeleting: true});
    case CLEAN_DEL_STATE:
    return Object.assign({}, state, {
      response: {},
      deletedCorrectly: false,
    });
    default:
      return state;
  }
}

// Reducer that trasform the state linked to change the book's state
function bookChangeState(state = {
  isChangingState: false,
  stateChangedCorrectly: false,
  response: {}
}, action) {
  switch (action.type) {
    case RECEIVE_RES_SET_STATE_BOOK:
      return Object.assign({}, state, {
        isChangingState: false,
        response: action.response,
        stateChangedCorrectly: (action.response.errors) ? false : true
      });
    case SET_STATE_BOOK:
      return Object.assign({}, state, {isChangingState: true});
    case CLEAN_CHANGE_STATE:
      return Object.assign({}, state, {stateChangedCorrectly: false});
    default:
      return state;
  }
}

// Reducer that transforms the state linked to add a book to the DB
function bookToApi(state = {
  isPosting: false,
  postedCorrectly: false
}, action) {
  switch (action.type) {
    case RECEIVE_RES_POST_BOOK:
      return Object.assign({}, state, {
        isPosting: false,
        postedCorrectly: (action.response.errors) ? false : true,
        response: action.response
      });
    case POST_BOOK:
      return Object.assign({}, state, {isPosting: true});
    default:
      return state;
  }
}



// -------------------------
// ----- AUTHORS API
// -------------------------

// Reducer that trasform the state linked to recover a list of authors from the API
function authorsFromApi(state = {
  isFetching: false,
  authors: []
}, action) {
  switch (action.type) {
    case RECEIVE_AUTHORS:
      return Object.assign({}, state, {
        isFetching: false,
        authors: action.authors,
        lastUpdated: action.receivedAt
      });
    case REQUEST_AUTHORS:
      return Object.assign({}, state, {isFetching: true});
    default:
      return state;
  }
}


// Reducer that transforms the state linked to add an author to the DB
function authorToApi(state = {
  isPosting: false,
  postedCorrectly: false
}, action) {
  switch (action.type) {
    case RECEIVE_RES_POST_AUTHOR:
      return Object.assign({}, state, {
        isPosting: false,
        postedCorrectly: true,
        response: action.response
      });
    case POST_AUTHOR:
      return Object.assign({}, state, {isPosting: true});
    default:
      return state;
  }
}



// -------------------------
// ----- GOOGLE BOOKS API
// -------------------------

// Reducer that trasform the state linked to recover a list of books from Google Books API
function booksFromGoogle(state = {
  isFetching: false,
  books: []
}, action) {
  switch (action.type) {
    case RECEIVE_RES_GOOGLE_BOOKS:
      return Object.assign({}, state, {
        isFetching: false,
        books: action.books,
        lastUpdated: action.receivedAt
      });
    case SEARCH_REQUEST_GOOGLE_BOOKS:
      return Object.assign({}, state, {isFetching: true});
    default:
      return state;
  }
}



// Reducers's combination and forms's creation
const rootReducer = combineReducers({
  booksFromApi,
  bookFromApi,
  bookChangeState,
  bookToApi,
  bookDelApi,
  authorToApi,
  booksFromGoogle,
  authorsFromApi,
  ...createForms({
    bookForm: {
      titulo: "",
      autor: ""
    },
    authorForm: {
      nombre: "nombre_autor"
    },
  })
});

export default rootReducer;