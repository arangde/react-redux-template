import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import actions from '../redux/actions';

import {
  Row,
  Col,
  Grid,
  Form,
  Panel,
  Button,
  Checkbox,
  PanelBody,
  FormGroup,
  FormControl,
  ControlLabel,
  PanelContainer } from '@sketchpixy/rubix';

@withRouter
class EditTodoForm extends React.Component {
  editTodo(e) {
    e.preventDefault();

    let input = ReactDOM.findDOMNode(this.input);
    let todo = input.value;
    let completed = this.checkbox.checked;

    let { dispatch } = this.props;
    let { _id } = this.props.todo;

    dispatch(actions.updateTodo({
      _id,
      todo,
      completed
    })).then(() => {
      this.props.router.push('/');
    });
  }

  componentWillReceiveProps(newProps) {
    let input = ReactDOM.findDOMNode(this.input);
    input.value = newProps.todo.todo;
    this.checkbox.checked = newProps.todo.completed;
  }

  render() {
    let { todo, completed } = this.props.todo;

    return (
      <div>
        <Form onSubmit={::this.editTodo}>
          <FormGroup controlId='todoText'>
            <ControlLabel>Todo Text</ControlLabel>
            <FormControl type='text' placeholder='A todo item...' defaultValue={todo} ref={(input) => this.input = input} autoFocus />
          </FormGroup>
          <FormGroup controlId='todoComplete'>
            <Checkbox inputRef={(checkbox) => { this.checkbox = checkbox; }} defaultChecked={completed} >
              Mark as Completed
            </Checkbox>
          </FormGroup>
          <FormGroup>
            <Button type='submit' bsStyle='blue' onlyOnHover>Update Todo</Button>
          </FormGroup>
        </Form>
      </div>
    );
  }
}


@connect((state) => state)
export default class EditTodo extends React.Component {
  static fetchData(store, params) {
    return store.dispatch(actions.getTodo({
      _id: params.id
    }));
  }

  render() {
    let { todos, dispatch } = this.props;
    let { result } = todos;

    return (
      <PanelContainer>
        <Panel>
          <PanelBody style={{padding: 0, paddingBottom: 25}}>
            <Grid>
              <Row>
                <Col xs={12}>
                  <h3>Editing Todo Item:</h3>

                  <EditTodoForm todo={result} dispatch={dispatch} />
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}
