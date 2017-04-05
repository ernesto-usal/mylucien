import React, {/* PropTypes, */
    Component
} from 'react';
import {connect} from 'react-redux';
import {ACSearchGoogleBooksIfNeeded} from '../actions/actions';
import {Button, Dropdown, Input} from 'semantic-ui-react';
import GridGoogleBooksCards from './GridGoogleBooksCards';

import update from 'immutability-helper';

class SearchBookGoogle extends Component {
    /* eslint-disable no-useless-constructor */
    constructor(props) {
        super(props);
        this.onClickSubmitGoogleBooks = this.onClickSubmitGoogleBooks.bind(this);
    }

    // Array de opciones de búsqueda para poblar el dropdown
    options_dropdown = [
        {
            key: 'by_title',
            text: 'Title',
            value: 'title'
        }, {
            key: 'by_autor',
            text: 'Autor',
            value: 'autor'
        }, {
            key: 'by_isbn',
            text: 'ISBN',
            value: 'isbn'
        }
    ];

    // State local del componente
    state = {
        // State del dropdown de búsqueda
        searchDropdown: {
            activesSearchBox: [],
            isOpen: false
        },
        // States de los searchboxes
        searchBoxes: {
            search_title: {
                value: ""
            },
            search_autor: {
                value: ""
            },
            search_isbn: {
                value: ""
            }
        },
    }


    //----- Métodos Dropdown ----- Al pulsar en el dropdown

    // Al pulsar en el dropdown
    onClickDropdown = (e, data) => {
        // Se abre el desplegable del dropdown
        let new_state = this.changeVisibilityDropdownState(this.state, true);
        this.setState(new_state);
    }

    // Al pulsar fuera del dropdown
    onCloseDropdown = (e, data) => {
        // Se cierra el desplegable del dropdown
        let new_state = this.changeVisibilityDropdownState(this.state, false);
        this.setState(new_state);
    }

    // Al seleccionar un elemento del desplegable del dropdown
    onAddItemDropdown = (e, data) => {
        // Se cambia la lista de filtros del state local a partir de los valores
        // seleccionados del dropdown
        let new_state = this.changeActiveTagsDropdownState(this.state, data.value);
        // Se cierra el desplegable del dropdown
        new_state = this.changeVisibilityDropdownState(new_state, false);
        this.setState(new_state);
    }

    // State creator para cambiar la visibilidad del dropdown
    changeVisibilityDropdownState = (state, visible) => {
        const new_state = update(state, {
            searchDropdown: {
                isOpen: {
                    $set: visible
                }
            }
        });
        return new_state;
    }

    // State creator para cambiar la visibilidad del dropdown
    changeActiveTagsDropdownState = (state, active_tags) => {
        const new_state = update(state, {
            searchDropdown: {
                activesSearchBox: {
                    $set: active_tags
                }
            }
        });
        return new_state;
    }


    //----- Métodos searchBoxes -----

    // Al cambiar el texto del searchbox
    onChangeSearchbox = (e, data) => {
        // Se cambia el value en el state local del searchbox correspondiente
        let new_state = this.changeValueSearchBoxState(this.state, data.value, ((data.label === "autor")
            ? "search_autor"
            : ((data.label === "title")
                ? "search_title"
                : ((data.label === "isbn")
                    ? "search_isbn"
                    : null))));

        this.setState(new_state);
    }

    // State creator para cambiar la visibilidad del dropdown
    changeValueSearchBoxState = (state, new_value, tag = "search_title") => {
        const new_state = update(state, {
            searchBoxes: {
                [tag]: {
                    value: {
                        $set: new_value
                    }
                }
            }
        });
        return new_state;
    }

    // Al pulsar el botón de buscar en google books
    onClickSubmitGoogleBooks(e) {
        e.preventDefault();
        const {dispatch} = this.props;

        // Se crean las variables con las opciones a pasarle a la acción
        const title = (this.state.searchDropdown.activesSearchBox.indexOf("title") !== -1)
            ? this.state.searchBoxes.search_title.value
            : null;
        const autor = (this.state.searchDropdown.activesSearchBox.indexOf("autor") !== -1)
            ? this.state.searchBoxes.search_autor.value
            : null;
        const isbn = (this.state.searchDropdown.activesSearchBox.indexOf("isbn") !== -1)
            ? this.state.searchBoxes.search_isbn.value
            : null;
        dispatch(ACSearchGoogleBooksIfNeeded(title, autor, isbn));
    }

    render() {
        const {books, isFetchingFromGoogle} = this.props;

        return (
            <div>
                <h1>Buscar Libro en Google</h1>
                <br/>
                <Dropdown
                    placeholder='Búsqueda por'
                    open={this.state.searchDropdown.isOpen}
                    onClick={this.onClickDropdown}
                    onClose={this.onCloseDropdown}
                    multiple
                    selection
                    onChange={this.onAddItemDropdown}
                    options={this.options_dropdown}/> {// Visibilidad de los searchBoxes
                (this.state.searchDropdown.activesSearchBox.indexOf("autor") !== -1)
                    ? <Input label='autor' placeholder='' onChange={this.onChangeSearchbox}/>

                    : ""}
                {(this.state.searchDropdown.activesSearchBox.indexOf("title") !== -1)
                    ? <Input label='title' placeholder='' onChange={this.onChangeSearchbox}/>

                    : ""}
                {(this.state.searchDropdown.activesSearchBox.indexOf("isbn") !== -1)
                    ? <Input label='isbn' placeholder='' onChange={this.onChangeSearchbox}/>

                    : ""}

                {// Si hay algún tag seleccionado, se muestra el botón de búsqueda
                (this.state.searchDropdown.activesSearchBox.length > 0)
                    ? <Button type="submit" color="blue" onClick={this.onClickSubmitGoogleBooks}>
                            Buscar en Google Books
                        </Button>

                    : ""}

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
