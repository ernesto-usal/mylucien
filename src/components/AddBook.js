/* COMPONENT TO ADD A NEW BOOK */


import React, {/* PropTypes, */
    Component
} from 'react';
import {connect} from 'react-redux';
import {ActionCreatorPostBookIfNeeded, ActionCreatorFetchAuthorsIfNeeded} from '../actions/actions';
import {Control, Form} from 'react-redux-form';

class AddBook extends Component {
    /* eslint-disable no-useless-constructor */
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {dispatch} = this.props;
        // dispatch of the action to fetch the list of authors to populate the dropdown of adding a book
        dispatch(ActionCreatorFetchAuthorsIfNeeded());
    }


    handleSubmitBookForm() {
        const {dispatch} = this.props;
        // dispath of the action to submit the form and post a new book
        dispatch(ActionCreatorPostBookIfNeeded());
    }

   
    componentWillReceiveProps(nextProps) {
        if (nextProps.authorsFromApi !== this.props.authorsFromApi) {
            const { dispatch} = nextProps;
            dispatch(ActionCreatorFetchAuthorsIfNeeded());
        }
    }

    render() {
        // Props's retrieval
        const {authors} = this.props;
        
        
    
        return (
            <div>
                <h1>Add New Book</h1>
                <Form model="bookForm" onSubmit={() => this.handleSubmitBookForm()}>
                    <label>Título:</label>
                    <Control.text model="bookForm.titulo"/>
                    <br/>
                    {(authors.length > 0) ? <label>Autor:</label> : "Cargando Autores"}
                    {(authors.length > 0) 
                        ? (
                            
                            <Control.select model="bookForm.autor">
                                <option value=""></option>
                            {authors.map((author, id) => {return <option key={author.nombre} value={author.nombre}>
                                {author.nombre}</option>})}
                                </Control.select>
                        ) 
                        : ""
                    }
                    <br/>
                    <button type="submit">
                        Añadir Libro
                    </button>
                </Form>
                <br/>
            </div>
        );
    }
}

// Function that, from the actual store's state, generate the props that 
// will use the component. It's important the asignation of empty objects
// or arrays for the initial case where the component's content it's not 
// recovered
function mapStateToProps(state) {
    const {authorsFromApi} = state;
    const authors = authorsFromApi["authors"] || [];
    const isFetchingAuthors = authorsFromApi["isFetching"] || false;

    return {authors, isFetchingAuthors};
}

// Connect of the component necessary to recover the props for each state update
export default connect(mapStateToProps)(AddBook);