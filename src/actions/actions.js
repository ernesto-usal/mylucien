import fetch from 'isomorphic-fetch';

/* eslint-disable guard-for-in */

//-------------------------
//-----  UTILS ----
//-------------------------


// Function that converts the properties of an object to x-www-form-urlencoded
// format
function object_to_x_www_form_urlencode(data_object) {
  let formBody = [];
  for (let property in data_object) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(data_object[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return formBody;
}

let default_POST_headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded'
};


//-------------------------
//----- ACTION TYPES ------
//-------------------------

export const REQUEST_BOOKS = 'REQUEST_BOOKS';
export const RECEIVE_BOOKS = 'RECEIVE_BOOKS';

export const REQUEST_AUTHORS = 'REQUEST_AUTHORS';
export const RECEIVE_AUTHORS = 'RECEIVE_AUTHORS';

export const REQUEST_BOOK_BY_ID = 'REQUEST_BOOK_BY_ID';
export const RECEIVE_BOOK_BY_ID = 'RECEIVE_BOOK_BY_ID';

export const POST_BOOK = 'POST_BOOK_DATA';
export const RECEIVE_RES_POST_BOOK = 'RECEIVE_RES_POST_BOOK';

export const POST_AUTHOR = 'POST_AUTHOR_DATA';
export const RECEIVE_RES_POST_AUTHOR = 'RECEIVE_RES_POST_AUTHOR';

export const SEARCH_REQUEST_GOOGLE_BOOKS = "SEARCH_REQUEST_GOOGLE_BOOKS";
export const RECEIVE_RES_GOOGLE_BOOKS = "RECEIVE_RES_GOOGLE_BOOKS";

export const DELETE_BOOK = "DELETE_BOOK";
export const RECEIVE_RES_DELETE_BOOK = "RECEIVE_RES_DELETE_BOOK";
export const CLEAN_DEL_STATE = "CLEAN_DEL_STATE";

export const SET_STATE_BOOK = "SET_STATE_BOOK";
export const RECEIVE_RES_SET_STATE_BOOK = "RECEIVE_RES_SET_STATE_BOOK";
export const CLEAN_CHANGE_STATE = "CLEAN_CHANGE_STATE";


//-------------------------
//----- BASIC ACTIONS CREATORS
//-------------------------


// Action Creator que devuelve el objeto con la acción para pedir la lista de
// libros a la API
function ActionCreatorRequestBooks(url_books_list) {
  return {type: REQUEST_BOOKS, url: url_books_list};
}

// Action Creator que devuelve el objeto con la acción para pedir la lista de
// autores a la API
function ActionCreatorRequestAuthors(url_authors_list) {
  return {type: REQUEST_AUTHORS, url: url_authors_list};
}

// Action Creator que devuelve el objeto de la acción para pedir un libro por su
// id
function ActionCreatorRequestBookById(url_book) {
  return {type: REQUEST_BOOK_BY_ID, url: url_book};
}

// Action Creator que devuelve el objeto con la acción para recibir el json de
// libros
function ActionCreatorReceiveBooks(books_json) {
  return {
    type: RECEIVE_BOOKS, books: books_json, //.map(child => child.data),
    receivedAt: Date.now()
  };
}

// Action Creator que devuelve el objeto con la acción para recibir el json de
// autores
function ActionCreatorReceiveAuthors(authors_json) {
  return {
    type: RECEIVE_AUTHORS, authors: authors_json, //.map(child => child.data),
    receivedAt: Date.now()
  };
}

// Action Creator que devuelve el objeto de la acción para recibir un json con
// los datos de un libro
function ActionCreatorReceiveBookById(book_json) {
  return {
    type: RECEIVE_BOOK_BY_ID,
    book: book_json,
    receivedAt: Date.now()
  };
}

function ActionCreatorPostBook(url_post_book, bookModel) {
  return {type: POST_BOOK, book: bookModel, url: url_post_book};
}

function ActionCreatorReceiveResPostBook(res) {
  return {type: RECEIVE_RES_POST_BOOK, response: res};
}

function ActionCreatorPostAuthor(url_post_author, authorModel) {
  return {type: POST_AUTHOR, author: authorModel, url: url_post_author};
}

function ActionCreatorReceiveResPostAuthor(res) {
  return {type: RECEIVE_RES_POST_AUTHOR, response: res};
}

function ACSearchRequestGoogleBooks(url, query) {
  return {type: SEARCH_REQUEST_GOOGLE_BOOKS, url: url};
}

function ACReceiveResGoogleBooks(books_json) {
  return {
    type: RECEIVE_RES_GOOGLE_BOOKS,
    books: books_json,
    receivedAt: Date.now()
  };
}

function ACDeleteBook(url) {
  return {type: DELETE_BOOK, url: url};
}

function ACReceiveResDeleteBook(response_json) {
  return {type: RECEIVE_RES_DELETE_BOOK, response: response_json};
}

function ACCleanDelState() {
  return {type: CLEAN_DEL_STATE}
}

function ACSetStateBook(url, id_book, state_type, new_state) {
  return {
    type: SET_STATE_BOOK,
    book_params: {
      id_book: id_book,
      state_type: state_type,
      new_state: new_state
    },
    url: url
  };
}

function ACReceiveResSetStateBook(res) {
  return {type: RECEIVE_RES_SET_STATE_BOOK, response: res};
}

function ACCleanChangeState() {
  return {type: CLEAN_CHANGE_STATE}
}


//-------------------------
//----- ASYNC ACTIONS ----
//-------------------------

// Action Creator Async que devuelve la función asíncrona que hace la petición y
// devuelve la lista de libros
function ActionCreatorFetchBooks(url_books_list) {
  return dispatch => {
    dispatch(ActionCreatorRequestBooks(url_books_list));
    fetch(url_books_list)
      .then(req => req.json())
      .then(books_json => dispatch(ActionCreatorReceiveBooks(books_json)));
  }
}

// Action Creator Async que devuelve la función asíncrona que hace la petición y
// devuelve la lista de autores
function ActionCreatorFetchAuthors(url_authors_list) {
  return dispatch => {
    dispatch(ActionCreatorRequestAuthors(url_authors_list));
    fetch(url_authors_list)
      .then(req => req.json())
      .then(authors_json => dispatch(ActionCreatorReceiveAuthors(authors_json)));
  }
}

// Action Creator Async que devuelve la función asíncrona que hace la petición y
// devuelve el libro solicitado por id
function ActionCreatorFetchBookById(url_book) {
  return dispatch => {
    dispatch(ActionCreatorRequestBookById(url_book));
    return setTimeout(function () {
      fetch(url_book)
        .then(req => req.json())
        .then(book_json => dispatch(ActionCreatorReceiveBookById(book_json)));
    }, 2000);
    /*return fetch(url_book)
      .then(req => req.json())
      .then(book_json => dispatch(ActionCreatorReceiveBookById(book_json)));*/
  };
}

// Action Creator Async que devuelve la función asíncrona que hace la petición y
// devuelve el libro solicitado por id
function ActionCreatorPostBookAsync(url_post_book, book) {
  return dispatch => {
    dispatch(ActionCreatorPostBook(url_post_book, book));
    book = object_to_x_www_form_urlencode(book);

      fetch(url_post_book, {
          method: "POST",
          headers: default_POST_headers,
          body: book
        })
        .then(res => res.json())
        .then(res => dispatch(ActionCreatorReceiveResPostBook(res)));
    /*return fetch(url_book)
      .then(req => req.json())
      .then(book_json => dispatch(ActionCreatorReceiveBookById(book_json)));*/
  };
}

// Action Creator Async que devuelve la función asíncrona que hace la petición
// para el cambio del estado de un libro
function ActionCreatorPostAuthorAsync(url_post_author, author) {
  return dispatch => {
    dispatch(ActionCreatorPostAuthor(url_post_author, author));
    return setTimeout(function () {

      author = object_to_x_www_form_urlencode(author);

      fetch(url_post_author, {
          method: "POST",
          headers: default_POST_headers,
          body: author
        })
        .then(res => res.json())
        .then(res => dispatch(ActionCreatorReceiveResPostAuthor(res)));
    }, 2000);
    /*return fetch(url_book)
      .then(req => req.json())
      .then(book_json => dispatch(ActionCreatorReceiveBookById(book_json)));*/
  };
}

// Action Creator Async que devuelve la función asíncrona que hace la petición a
// la API de Google y devuelve el json con la lista de libros
function ACSearchRequestGoogleBooksAsync(url) {
  return dispatch => {
    dispatch(ACSearchRequestGoogleBooks(url));
    fetch(url)
      .then(req => req.json())
      .then(books_json => dispatch(ACReceiveResGoogleBooks(books_json)));
  }
}

function ACDeleteBookAsync(url) {
  return dispatch => {
    dispatch(ACDeleteBook(url));
      fetch(url, {method: "DELETE"})
        .then(res => res.json())
        .then(res => dispatch(ACReceiveResDeleteBook(res)));
  };
}

function ACSetStateBookAsync(url, id_book, state_type, new_state) {
  return dispatch => {
    dispatch(ACSetStateBook(url, id_book, state_type, new_state));
    let body_params = object_to_x_www_form_urlencode({id_book: id_book, state_type: state_type, new_state: new_state});

    fetch(url, {
        method: "POST",
        headers: default_POST_headers,
        body: body_params
      })
      .then(res => res.json())
      .then(res => dispatch(ACReceiveResSetStateBook(res)));
  };
}

//-------------------------
//----- PUBLIC ACTIONS ----
//-------------------------

export function ActionCreatorFetchBooksIfNeeded() {
  return (dispatch, getState) => {
    return dispatch(ActionCreatorFetchBooks(`http://localhost:3001/api/libros/by_autor=${getState().bookForm.autor}`));
  };
}

export function ActionCreatorFetchBookIfNeeded() {
  return (dispatch, getState) => {
    let titulo = getState().bookForm.titulo;
    return dispatch(ActionCreatorFetchBookById(`http://localhost:3001/api/libros/by_autor=${titulo}`));
  };
}

export function ActionCreatorPostBookIfNeeded(book = {}) {
  return (dispatch, getState) => {
    return dispatch(ActionCreatorPostBookAsync('http://localhost:3001/api/libros/', (book === {})
      ? getState().bookForm
      : book));
  };
}

export function ActionCreatorPostAuthorIfNeeded() {
  return (dispatch, getState) => {
    return dispatch(ActionCreatorPostAuthorAsync('http://localhost:3001/api/autores/', getState().authorForm));
  };
}

export function ACSearchGoogleBooksIfNeeded() {
  return (dispatch, getState) => {
    let titulo = getState().googleBooksForm.titulo;
    let autor = getState().googleBooksForm.autor;
    let isbn = getState().googleBooksForm.isbn;
    return dispatch(ACSearchRequestGoogleBooksAsync(`https://www.googleapis.com/books/v1/volumes?q=
             ${(titulo) ? encodeURIComponent("intitle:"+titulo):""}
                                                        ${ (autor)
      ? encodeURIComponent("+inauthor:" + autor)
      : ""} ${(isbn) ? encodeURIComponent("+isbn:" + isbn): ""}
                                                    &maxResults=40`));
  };
}

export function ActionCreatorFetchAuthorsIfNeeded() {
  return (dispatch, getState) => {
    return dispatch(ActionCreatorFetchAuthors(`http://localhost:3001/api/autores`));
  };
}

export function ACDeleteBookIfNeeded(id_book = "") {
  return (dispatch, getState) => {
    return dispatch(ACDeleteBookAsync(`http://localhost:3001/api/libros/${id_book}`));
  };
}

export function ACCleanDelStateIfNeeded() {
  return (dispatch, getState) => {
    return dispatch(ACCleanDelState());
  };
}

export function ACSetStateBookIfNeeded(id_book = "", state_type = "", new_state = "") {
  return (dispatch, getState) => {
    return dispatch(ACSetStateBookAsync('http://localhost:3001/api/libros/change-state/', id_book, state_type, new_state));
  };
}

export function ACCleanChangeStateIfNeeded() {
  return (dispatch, getState) => {
    return dispatch(ACCleanChangeState());
  };
}