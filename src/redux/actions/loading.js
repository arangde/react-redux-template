import { START_LOADING, END_LOADING } from '../../constants';

function startLoading(id, text) {
  return {
    type: START_LOADING,
    id,
    text
  };
};

function endLoading(id) {
  return {
    type: END_LOADING,
    id
  };
};

module.exports = {
    startLoading,
    endLoading,
};
