import _ from 'lodash';

const localConfig = require('@/../local-config.json');

const state = {
  config: _.find(localConfig['project-list'], { name: 'node-stock' }),
  dbInited: false
}

const mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  mutations,
  actions
}