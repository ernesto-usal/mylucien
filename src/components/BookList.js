import React, {/* PropTypes, */
  Component
} from 'react';
import {connect} from 'react-redux';
import {ActionCreatorFetchBooksIfNeeded, ActionCreatorFetchAuthorsIfNeeded} from '../actions/actions';
import {Button} from 'semantic-ui-react';
import GridCollectionBooksCards from './GridCollectionBooksCards';
import {Control, Form} from 'react-redux-form';

class BookList extends Component {
  /* eslint-disable no-useless-constructor */
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {dispatch, lastBooksReceipt} = this.props;

    // Se realiza la petición de libros y autores si pasaron más de 10s desde la última
    // vez o si es la primera
    if (!lastBooksReceipt || ((Date.now() - lastBooksReceipt) > 10000)) {
      dispatch(ActionCreatorFetchBooksIfNeeded());
      dispatch(ActionCreatorFetchAuthorsIfNeeded());
    }
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
