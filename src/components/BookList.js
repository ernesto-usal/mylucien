import React, {/* PropTypes, */
  Component
} from 'react';
import {connect} from 'react-redux';
import {ActionCreatorFetchBooksIfNeeded, ActionCreatorFetchAuthorsIfNeeded} from '../actions/actions';
import {Button, Search} from 'semantic-ui-react';
import GridCollectionBooksCards from './GridCollectionBooksCards';
import {Control, Form} from 'react-redux-form';

class BookList extends Component {
  /* eslint-disable no-useless-constructor */
  constructor(props) {
    super(props);
  }

  resultados = [
    {
      "id" : "1",
      "title": "holaa"
    }, {
      "id" : "2",
      "title": "Herman, Fahey and Hartmann",
      "description": "Ameliorated bottom-line service-desk",
      "image": "https://s3.amazonaws.com/uifaces/faces/twitter/themadray/128.jpg",
      "price": "$49.00"
    }, {
      "id" : "3",
      "title": "Marvin Group",
      "description": "Upgradable upward-trending service-desk",
      "image": "https://s3.amazonaws.com/uifaces/faces/twitter/woodydotmx/128.jpg",
      "price": "$55.00"
    }
  ];

  // State local del componente
  state = {
    loading: true,
    value: "",
    resultados: []
  }

  // ----- Métodos Searchbox ----- Método que gestiona los cambios al introducir
  // algo en el search box
  onChangeSearch = (e, new_value) => {
    this.setState({value: new_value});

    if (new_value.length > 2) {
      this.setState({resultados: this.resultados});
    } else {
      this.setState({resultados: [1]});
    }
  }

  // Método que resetea el state local en lo referente al search box
  resetSearch = () => {
    this.setState({loading: false, value: "", resultados: []});
  }

  componentWillMount() {
    const {dispatch, lastBooksReceipt} = this.props;

    // Se realiza la petición de libros y autores si pasaron más de 10s desde la
    // última vez o si es la primera
    if (!lastBooksReceipt || ((Date.now() - lastBooksReceipt) > 10000)) {
      dispatch(ActionCreatorFetchBooksIfNeeded());
      dispatch(ActionCreatorFetchAuthorsIfNeeded());
    }

    this.resetSearch();
  }

  handleSubmit() {
    // Do anything you want with the form value console.log(book);
    const {dispatch} = this.props;
    dispatch(ActionCreatorFetchBooksIfNeeded());
    dispatch(ActionCreatorFetchAuthorsIfNeeded());
  }

  render() {
    const {books, isFetchingBooks, authors, isFetchingAuthors} = this.props;

    return (
      <div>
        <h1>Libros en la Colección</h1>
        <Search
          onSearchChange={this.onChangeSearch}
          loading={this.state.loading}
          results={this.state.resultados}
          value={this.state.value}
          fluid/>
        <Form model="bookForm" onSubmit={() => this.handleSubmit()}>
          <label>Autor:</label>
          <Control.text model="bookForm.autor"/>
          <br/><br/>
          <Button type="submit" color="blue">
            Filtrar
          </Button>
        </Form>
        <br/>
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
