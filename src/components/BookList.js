import React, {/* PropTypes, */
  Component
} from 'react';
import {connect} from 'react-redux';
import {ActionCreatorFetchBooksIfNeeded, ActionCreatorFetchAuthorsIfNeeded} from '../actions/actions';
import {Button, Search, Checkbox} from 'semantic-ui-react';
import GridCollectionBooksCards from './GridCollectionBooksCards';

import update from 'immutability-helper';

class BookList extends Component {
  /* eslint-disable no-useless-constructor */
  constructor(props) {
    super(props);
    this.onClickGetBooks = this.onClickGetBooks.bind(this);
  }

  // State local del componente
  state = {
    searchboxAuthor: {
      loading: false,
      value: "",
      results: [],
      validResultSelected: false,
    },
    radioButtons: {
      value: "todos"
    }
  }

  // ----- Métodos Searchbox ----- 
  
  // Método que gestiona los cambios al introducir algo en el search box
  onChangeSearch = (e, new_value) => {
    // Se recupera de las props la lista de autores
    const {authors} = this.props;
    
    // Se cambia el state para el nuevo valor del searchBox
    let new_state = this.changeValueSearchBoxState(this.state, new_value);
    
    // Si se escribieron 3 o más caracteres en el searchBox
    if (new_value.length > 2) {
      // Si se hay elementos en la lista de autores de props
      if (authors.length>0){
        let results_authors = this.authorsToResultsSearchBox(authors);
        let new_results = results_authors.filter(function(item){return (new RegExp(`.*${new_value}.*`, "i")
                                          .test(item.title))});
        new_state = this.changeResultsSearchBoxState(new_state, new_results);
      }   
    } else {
    }
    this.setState(new_state);
  }

  onResultSelectSearchBox = (e, data) => {
    e.preventDefault();
    let new_state = this.changeValueSearchBoxState(this.state, data.title);
    new_state = this.changeValidStateSearchbox(new_state, true);
    this.setState(new_state);
  }

  // State creator el value del searchBox
  changeValueSearchBoxState = (state, new_value) => {
    const new_state = update(state, {
      searchboxAuthor: {
        value: {
          $set: new_value
        }
      }
    });
    return new_state;
  }

  // State creator el boolean de estado valido del searchbox
  changeValidStateSearchbox = (state, new_value) => {
    const new_state = update(state, {
      searchboxAuthor: {
        validResultSelected: {
          $set: new_value
        }
      }
    });
    return new_state;
  }

  // State creator para los results del searchBox
  changeResultsSearchBoxState = (state, results_authors) => {
    const new_state = update(state, {
      searchboxAuthor: {
        results: {
          $set: results_authors
        }
      }
    });
    return new_state;
  }

  // Función que transforma la lista de autores de las props al formato de results del searchBox
  authorsToResultsSearchBox = (authors) => {
    let authors_results = [];
    let result_author = {};
    authors.forEach(function(author) {
      result_author = {
        "id": author._id,
        "title": author.nombre
      };
      authors_results.push(result_author);
    });
    return authors_results;
  }

  // Método que resetea el state local en lo referente al search box
  resetSearch = () => {
    // Se cambia el state para el nuevo valor del searchBox
    let new_state = this.changeValueSearchBoxState(this.state, "");
    new_state = this.changeValidStateSearchbox(new_state, false);
    this.setState(new_state);
  }



  // ----- Métodos Radio Buttons ----- 

  // Cuando se marca un radio button
  onChangeRadios = (e, data) => {
    // Se cambia el value de los radios en el local state
    let new_state = this.changeValueRadiosState(this.state, data.value);
    this.setState(new_state);
  }

  // State creator para cambiar el value de los radio buttons
  changeValueRadiosState = (state, new_value) => {
    const new_state = update(state, {
      radioButtons: {
        value: {
          $set: new_value
        }
      }
    });
    return new_state;
  }

  
  componentWillMount() {
    const {dispatch, lastBooksReceipt, authors} = this.props;

    // Se realiza la petición de libros y autores si pasaron más de 10s desde la
    // última vez o si es la primera
    if (!lastBooksReceipt || ((Date.now() - lastBooksReceipt) > 10000)) {
      dispatch(ActionCreatorFetchBooksIfNeeded());
      dispatch(ActionCreatorFetchAuthorsIfNeeded());
    }

    // Se resetea el value del searchBox
    this.resetSearch();
  }

  componentWillReceiveProps(nextProps) {
  }

  // Al pulsar el botón de filtrar
  onClickGetBooks() {
    const {dispatch} = this.props;
    if (this.state.radioButtons.value === "leidos"){
      dispatch(ActionCreatorFetchBooksIfNeeded(null, null, null, null, true));
    } 
    if (this.state.radioButtons.value === "comprados"){
      dispatch(ActionCreatorFetchBooksIfNeeded(null, null, null, true, null));
    } 
    if (this.state.radioButtons.value === "autor"){
      dispatch(ActionCreatorFetchBooksIfNeeded(null, this.state.searchboxAuthor.value, null, null, null));
    } 
    if (this.state.radioButtons.value === "todos"){
      dispatch(ActionCreatorFetchBooksIfNeeded(null, this.state.searchboxAuthor.value, null, null, null));
    } 
  }

  render() {
    const {books, isFetchingBooks, authors, isFetchingAuthors} = this.props;

    return (
      <div>
        <h1>Libros en la Colección</h1>
        <Checkbox
          radio
          label='Todos'
          name='radioButtons'
          value='todos'
          checked={this.state.radioButtons.value === 'todos'}
          onChange={this.onChangeRadios}/>
        <Checkbox
          radio
          label='Leídos'
          name='radioButtons'
          value='leidos'
          checked={this.state.radioButtons.value === 'leidos'}
          onChange={this.onChangeRadios}/>
        <Checkbox
          radio
          label='Comprados'
          name='radioButtons'
          value='comprados'
          checked={this.state.radioButtons.value === 'comprados'}
          onChange={this.onChangeRadios}/>
        <Checkbox
          radio
          label='Autor'
          name='radioButtons'
          value='autor'
          checked={this.state.radioButtons.value === 'autor'}
          onChange={this.onChangeRadios}/> {(this.state.radioButtons.value === 'autor')
          ? <Search
              onSearchChange={this.onChangeSearch}
              loading={this.state.searchboxAuthor.loading}
              results={this.state.searchboxAuthor.results || []}
              value={this.state.searchboxAuthor.value}
              noResultsMessage="No hay resultados"
              onResultSelect={this.onResultSelectSearchBox}
              fluid/>
          : ""}
        <h2>{}</h2>
        <Button type="submit" color="blue" onClick={this.onClickGetBooks}>
                            Filtrar
                        </Button>
        <br/>
        <br/> {(isFetchingBooks || isFetchingAuthors)
          ? "Cargando..."
          : (
            <GridCollectionBooksCards books={books} authors={authors}></GridCollectionBooksCards>
          )}

      </div>
    );
  }
}

// Función que, a partir del estado actual de la store, genera los props que
// usará el componente Es importante la asignación de objetos o arrays vacíos
// para el caso inicial de que no se haya recuperado el contenido de los
// distintos props
function mapStateToProps(state) {
  const {booksFromApi, authorsFromApi} = state;
  const books = booksFromApi["books"] || [];
  const isFetchingBooks = booksFromApi["isFetching"] || false;
  const authors = authorsFromApi["authors"] || [];
  const isFetchingAuthors = authorsFromApi["isFetching"] || false;
  const lastBooksReceipt = booksFromApi["lastUpdated"] || false;

  return {books, isFetchingBooks, authors, isFetchingAuthors, lastBooksReceipt};
}

// Connect del componente necesario para recuperar los props cada vez que se
// actualice el estado
export default connect(mapStateToProps)(BookList);
