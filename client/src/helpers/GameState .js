
const INITIAL_STATE = {
  map: null,
  players: []
};

const game = () => {
  let state = {
    ...INITIAL_STATE
  };

  const loadMap = map => {
    state = { ...state, map };
  };

  const saveMap = () => {
    return state.map;
  };

  const addPlayer = player => {
    const { players } = state;
    state = { ...state, players: [...players, player] };
  };


  return {
    loadMap,
    saveMap,
    addPlayer,
  };
};

export default game;
