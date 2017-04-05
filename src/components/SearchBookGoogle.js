import React, {/* PropTypes, */
    Component
} from 'react';
import {connect} from 'react-redux';
import {ACSearchGoogleBooksIfNeeded} from '../actions/actions';
import {Control, Form} from 'react-redux-form';
import {Button} from 'semantic-ui-react';
import GridGoogleBooksCards from './GridGoogleBooksCards';

class SearchBookGoogle extends Component {
    /* eslint-disable no-useless-constructor */
    constructor(props) {
        super(props);
    }

    handleSubmitGoogleBooks() {
        // Do anything you want with the form value console.log(book);
        const {dispatch} = this.props;
        dispatch(ACSearchGoogleBooksIfNeeded());
    }

    render() {
        const {books, isFetchingFromGoogle} = this.props;

        return (
            <div>
                <h1>Buscar Libro en Google</h1>
                <br/>

                <Form model="googleBooksForm" onSubmit={() => this.handleSubmitGoogleBooks()}>
                    <label>Título:</label>
                    <Control.text model="googleBooksForm.titulo"/>
                    <br/>
                    <label>Autor:</label>
                    <Control.text model="googleBooksForm.autor"/>
                    <br/>
                    <label> ISBN: </label>
                    <Control.text model="googleBooksForm.isbn"/>
                    <br/>
                    <Button type="submit" color="blue">
                        Buscar Libro en Google Books
                    </Button>
                </Form>
                <br/>
                
                {(isFetchingFromGoogle)
                    ? "cargando"
                    : (
                        <GridGoogleBooksCards googleBooks={books}></GridGoogleBooksCards>
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
    const {booksFromGoogle} = state;
    const books = booksFromGoogle["books"].items || false;
    const isFetchingFromGoogle = booksFromGoogle["isFetching"] || false;

    return {books, isFetchingFromGoogle};
}

// Connect del componente necesario para recuperar los props cada vez que se
// actualice el estado
export default connect(mapStateToProps)(SearchBookGoogle);
