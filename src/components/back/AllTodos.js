import React from 'react';
import { connect } from 'react-redux';

import actions from '../redux/actions';

import Todo from '../../components/Todo';
import TodoForm from '../../components/TodoForm';

import {
  Row,
  Col,
  Grid,
  Panel,
  Alert,
  PanelBody,
  PanelContainer,
} from '@sketchpixy/rubix';

@connect((state) => state)
export default class AllTodos extends React.Component {
  static fetchData(store) {
    return store.dispatch(actions.getTodos());
  }

  render() {
    let { todos, dispatch } = this.props;
    let { result, error } = todos;

    let errors = error ?
      (
        <Alert danger dismissible>
          {error.map(({ message }, i) => {
            return <div key={i}>{message}</div>
          })}
        </Alert>
      ) : null;

    return (
      <PanelContainer>
        <Panel>
          <PanelBody style={{padding: 0, paddingBottom: 25}}>
            <Grid>
              <Row>
                <Col xs={12}>
                  <h3>Todo List:</h3>

                  {errors}

                  <TodoForm dispatch={dispatch} actions={actions} />

                  {typeof result.map === 'function' && result.map((todo) => {
                    return <Todo key={todo._id} todo={todo} dispatch={dispatch} actions={actions} />;
                  })}
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}
