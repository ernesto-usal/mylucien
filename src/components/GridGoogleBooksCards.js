import React, {/* PropTypes, */
    Component
} from 'react';
import {connect} from 'react-redux';
import {
    Grid,
    Card,
    Image,
    Button,
    Label,
    List
} from 'semantic-ui-react';
import {ActionCreatorPostBookIfNeeded} from '../actions/actions';

class GridGoogleBooksCards extends Component {
    constructor(props) {
        super(props);
        this.handleAddBookToCollection = this
            .handleAddBookToCollection
            .bind(this);
    }

    handleAddBookToCollection(id) {
        //e.preventDefault();

        const {dispatch, googleBooks} = this.props;
        // Dispatch action para post book
        const bookToPost = {
            "titulo": googleBooks[id].volumeInfo.title,
            "autor": (googleBooks[id].volumeInfo.authors)
                ? googleBooks[id].volumeInfo.authors[0]
                : "sin_autor",
            "url_imagen_portada": (googleBooks[id].volumeInfo.imageLinks)
                ? (googleBooks[id].volumeInfo.imageLinks.thumbnail)
                : "",
            "isbn": (googleBooks[id].volumeInfo.industryIdentifiers)
                ? (googleBooks[id].volumeInfo.industryIdentifiers[0].identifier)
                : "",
            "tipo_isbn": (googleBooks[id].volumeInfo.industryIdentifiers)
                ? (googleBooks[id].volumeInfo.industryIdentifiers[0].type)
                : "",
            "id_google_books": (googleBooks[id].id)
                ? (googleBooks[id].id)
                : "",
            "descripcion": (googleBooks[id].volumeInfo.description)
                ? googleBooks[id].volumeInfo.description
                : ""
        };
        console.log(bookToPost);
        dispatch(ActionCreatorPostBookIfNeeded(bookToPost));
        // Scroll al principio de la página
        window.scrollTo(0, 0)
    }

    render() {
        const {googleBooks, isPosting, postedCorrectly} = this.props;

        return (
            <div>
                {(isPosting)
                    ? "Añadiendo libro..."
                    : ((postedCorrectly)
                        ? "Libro añadido correctamente"
                        : "")}
                <Grid>

                    {((googleBooks !== false) && (googleBooks.totalItems !== "0"))
                        ? (googleBooks.map((book, id) => {
                            return <Grid.Column key={id} mobile={16} tablet={8} computer={4}>
                                <Card>
                                    <Image
                                        size="small"
                                        src={(book.volumeInfo.imageLinks)
                                        ? (book.volumeInfo.imageLinks.thumbnail)
                                        : ""}/>
                                    <Card.Content>
                                        <Card.Header>
                                            {book.volumeInfo.title}
                                        </Card.Header>
                                        <Card.Meta>
                                            <span className='date'>
                                                {(book.volumeInfo.authors)
                                                    ? (
                                                        <List.Item>
                                                            {book.volumeInfo.authors[0] + " "}
                                                            <Label color='red' horizontal>0 Libros</Label>
                                                        </List.Item>
                                                    )
                                                    : "No hay autor"}
                                            </span>
                                        </Card.Meta>
                                        <Card.Description>
                                            {(book.volumeInfo.industryIdentifiers)
                                                ? (book.volumeInfo.industryIdentifiers[0].type + " : " + book.volumeInfo.industryIdentifiers[0].identifier)
                                                : "Sin ISBN"}
                                            <br/>
                                            <br/> {(book.volumeInfo.description)
                                                ? book.volumeInfo.description.slice(0, 200)
                                                : ""}

                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>

                                        <Button color='green' onClick={() => this.handleAddBookToCollection(id)}>Añadir a la Colección</Button>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>

                        }))
                        : ""}

                </Grid>
            </div>
        );
    }
}

// Función que, a partir del estado actual de la store, genera los props que
// usará el componente Es importante la asignación de objetos o arrays vacíos
// para el caso inicial de que no se haya recuperado el contenido de los
// distintos props
function mapStateToProps(state) {
    const {bookForm, bookToApi} = state;
    const miBookForm = bookForm || {};
    const isPosting = bookToApi["isPosting"] || false;
    const postedCorrectly = bookToApi["postedCorrectly"] || false;

    return {miBookForm, isPosting, postedCorrectly};
}

// Connect del componente necesario para recuperar los props cada vez que se
// actualice el estado
export default connect(mapStateToProps)(GridGoogleBooksCards);
