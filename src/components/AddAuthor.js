/* COMPONENT TO ADD A NEW AUTHOR */

import React, {/* PropTypes, */
    Component
} from 'react';
import {connect} from 'react-redux';
import {ActionCreatorPostAuthorIfNeeded} from '../actions/actions';
import {Button} from 'semantic-ui-react';
import {Control, Form} from 'react-redux-form';

class AddAuthor extends Component {
    /* eslint-disable no-useless-constructor */
    constructor(props) {
        super(props);
    }

    
    handleSubmitAuthorForm() {
        const {dispatch} = this.props;
        // dispath of the action to submit the form and post a new book
        dispatch(ActionCreatorPostAuthorIfNeeded());
    }

    render() {
        const {isPosting, postedCorrectly} = this.props;

        return (
            <div>
                <h1>Add New Author</h1>
                <Form model="authorForm" onSubmit={() => this.handleSubmitAuthorForm()}>
                    <label>Nombre:</label>
                    <Control.text model="authorForm.nombre"/>
                    <br/>
                    <Button type="submit" color="blue">
                        Añadir Autor
                    </Button>
                </Form>
                {(isPosting)
                    ? "Añadiendo autor..."
                    : ((postedCorrectly)
                        ? "Autor añadido correctamente"
                        : "")}
                <br/>
            </div>
        );
    }
}

// Function that, from the actual store's state, generate the props that will
// use the component. It's important the asignation of empty objects or arrays
// for the initial case where the component's content it's not recovered
function mapStateToProps(state) {
    const {authorToApi} = state;
    const isPosting = authorToApi["isPosting"] || false;
    const postedCorrectly = authorToApi["postedCorrectly"] || false;

    return {isPosting, postedCorrectly};
}

// Connect of the component necessary to recover the props for each state update
export default connect(mapStateToProps)(AddAuthor);