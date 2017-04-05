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
    List,
    Modal
} from 'semantic-ui-react';
import {ACDeleteBookIfNeeded, ACCleanDelStateIfNeeded, 
        ActionCreatorFetchBooksIfNeeded, ActionCreatorFetchAuthorsIfNeeded,
        ACSetStateBookIfNeeded, ACCleanChangeStateIfNeeded} from '../actions/actions';

class GridCollectionBooksCards extends Component {
    constructor(props) {
        super(props);
        this.handleEliminarLibro = this
            .handleEliminarLibro
            .bind(this);
        this.handleChangeState = this
            .handleChangeState
            .bind(this);
        
    }

    // State del componente utilizado para la apertura y cierre del modal
    state = {
        open: false,
        book_actual: {}
    }

    // Método que gestiona la apertura del modal
    showModal = (book_actual) => {
        this.setState({open: true, book_actual: book_actual})
    }

    // Método que gestiona el cierre del modal
    closeModal = () => {
        const {dispatch, deletedCorrectly} = this.props;
        this.setState({open: false});

        // Si se eliminó correctamente el libro, al cerrar el modal se recarga la lista
        // de libros y autores
        if (deletedCorrectly) {
            dispatch(ActionCreatorFetchBooksIfNeeded());
            dispatch(ActionCreatorFetchAuthorsIfNeeded());

            // Se limpia el state del store para poder eliminar otro libro
            dispatch(ACCleanDelStateIfNeeded());
        }

    }

    // Handler del botón de Sí de Eliminar Libro
    handleEliminarLibro(id) {
        const {dispatch} = this.props;
        console.log(id);
        dispatch(ACDeleteBookIfNeeded(id));

    }

    // Handler de los labels para cambiar entre los estados (leído, comprado)
    handleChangeState(id_book, state_type, new_state) {
        const {dispatch} = this.props;
        
        dispatch(ACSetStateBookIfNeeded(id_book, state_type, new_state));
    }


    componentWillReceiveProps(nextProps){
        const {dispatch, stateChangedCorrectly} = this.props;
        
        // Cuando se haya actualizado el estado de un libro, se recarga la lista de libros
        if (stateChangedCorrectly!==nextProps.stateChangedCorrectly) {
            dispatch(ActionCreatorFetchBooksIfNeeded());
            dispatch(ActionCreatorFetchAuthorsIfNeeded());
            dispatch(ACCleanChangeStateIfNeeded());
        }
    }

    render() {
        const {books, authors, isDeleting, deletedCorrectly} = this.props;

        return (
            <div>
                <Grid>

                    {((books !== false) && (books.length > 0) && (authors !== false) && (authors.length > 0))
                        ? (books.map((book, id) => {
                            return <Grid.Column key={id} mobile={16} tablet={8} computer={4}>
                                <Card>
                                    <Image centered size="small" src={book.url_imagen_portada}/>
                                    <Card.Content>
                                        <Card.Header>
                                            {(book.comprado)
                                                ? <Label as="a" color='green' horizontal onClick={() => this.handleChangeState(book._id, "comprado", false)}>Comprado</Label>
                                                : <Label as="a" color='red' horizontal onClick={() => this.handleChangeState(book._id, "comprado", true)}>Por Comprar</Label>}
                                            {(book.leido)
                                                ? <Label as="a" color='green' horizontal onClick={() => this.handleChangeState(book._id, "leido", false)}>Leido </Label>
                                                : <Label as="a" color='red' horizontal onClick={() => this.handleChangeState(book._id, "leido", true)}>Por Leer</Label>}
                                            <br/>
                                            {book.titulo}
                                        </Card.Header>
                                        <Card.Meta>
                                            <span className='date'>
                                                {(book.autores)
                                                    ? (authors.find((author) => {
                                                        return author._id === book.autores[0]
                                                    }).nombre)
                                                    : "No hay autor"}
                                            </span>

                                        </Card.Meta>
                                        <Card.Description>
                                            {""}
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <List.Item>
                                            <div>
                                                <br/>
                                                <Button negative onClick={() => this.showModal(book)}>Eliminar</Button>

                                                <Modal size="small" open={this.state.open || isDeleting} onClose={this.closeModal}>
                                                    <Modal.Header>
                                                        Eliminar Libro de la Colección
                                                    </Modal.Header>
                                                    <Modal.Content>
                                                        {(isDeleting)
                                                            ? "Eliminando..."
                                                            : ((deletedCorrectly)
                                                                ? "Libro eliminado correctamente"
                                                                : (
                                                                    <p>¿Estás seguro de que quieres eliminar el libro {this.state.book_actual.titulo + " "}
                                                                        de la colección?</p>
                                                                ))}

                                                    </Modal.Content>
                                                    <Modal.Actions>
                                                        {(isDeleting || deletedCorrectly)
                                                            ? ""
                                                            : (
                                                                <div>
                                                                    <Button negative onClick={() => this.closeModal()}>
                                                                        No
                                                                    </Button>
                                                                    <Button
                                                                        positive
                                                                        onClick={() => this.handleEliminarLibro(this.state.book_actual._id)}
                                                                        icon='checkmark'
                                                                        labelPosition='right'
                                                                        content='Sí'/><br/></div>
                                                            )}
                                                    </Modal.Actions>
                                                </Modal>
                                            </div>
                                        </List.Item>
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
    const {bookDelApi, bookChangeState} = state;
    const isDeleting = bookDelApi["isDeleting"] || false;
    const deletedCorrectly = bookDelApi["deletedCorrectly"] || false;
    const isChangingState = bookChangeState["isChangingState"] || false;
    const stateChangedCorrectly = bookChangeState["stateChangedCorrectly"] || false;
    return {isDeleting, deletedCorrectly, stateChangedCorrectly, isChangingState};
}

// Connect del componente necesario para recuperar los props cada vez que se
// actualice el estado
export default connect(mapStateToProps)(GridCollectionBooksCards);