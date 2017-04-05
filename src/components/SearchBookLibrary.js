import React, {/* PropTypes, */
    Component
} from 'react';
import {connect} from 'react-redux';
import {ActionCreatorFetchBookIfNeeded} from '../actions/actions';
import {Control, Form} from 'react-redux-form';


class SearchBookLibrary extends Component {
    /* eslint-disable no-useless-constructor */
    constructor(props) {
        super(props);
    }

    

    handleSubmit(autor) {
        // Do anything you want with the form value console.log(book);
        const {dispatch} = this.props;
        dispatch(ActionCreatorFetchBookIfNeeded());
    }


    /*componentWillReceiveProps(nextProps) {
    if (nextProps.api !== this.props.api) {
      const { dispatch} = nextProps;
      dispatch(ActionCreatorFetchBooksIfNeeded());
      dispatch(ActionCreatorFetchBookIfNeeded());
    }
  }*/

    render() {
        const {book, isFetchingBook} = this.props;

        return (
            <div>
                <h1>Search Book in Library</h1>
                <Form model="bookForm" onSubmit={() => this.handleSubmit("gaiman")}>
                    <label>Título:</label>
                    <Control.text model="bookForm.titulo"/>
                    <br/>
                    <button type="submit">
                        Buscar Libro
                    </button>
                </Form>
                <br/>
                
                

                <h1>---DEBUG---</h1>
                <h3>ISFETCHING DATOS LIBRO {isFetchingBook.toString()}</h3>
                <ul>
                    {Object
                        .keys(book)
                        .map((key, id) => <li key={id}>{key} : {book[key].toString()}</li>)}
                </ul>
                {/**/}
                


            </div>
        );
    }
}

// Función que, a partir del estado actual de la store, genera los props que
// usará el componente Es importante la asignación de objetos o arrays vacíos
// para el caso inicial de que no se haya recuperado el contenido de los
// distintos props
function mapStateToProps(state) {
    const {bookFromApi} = state;
    const book = bookFromApi["book"] || {};
    const isFetchingBook = bookFromApi["isFetching"] || false;

    return {book, isFetchingBook};
}

// Connect del componente necesario para recuperar los props cada vez que se
// actualice el estado
export default connect(mapStateToProps)(SearchBookLibrary);