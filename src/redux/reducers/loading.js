import { START_LOADING, END_LOADING } from '../../constants';

function loading(state = {}, action) {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        [action.id]: {
          isLoading: true,
          text: action.text
        }
      };

    case END_LOADING:
      return {
        ...state,
        [action.id]: {
          isLoading: false
        }
      };

    default:
      return state;
  }
}

module.exports = {
    loading,
};
