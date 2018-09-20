import _ from 'lodash';

const localConfig = require('@/../../local-config.json');

const state = {
  config: _.find(localConfig['project-list'], { name: 'node-stock' }),
  loadDays: 30,
  dbInited: false,
  stocks: [],
  dailyStocks: [],
  dateArray: []
}

const mutations = {
  SET_STOCKS (state, data) {
    state.stocks = data;
  },
  SET_DAILY_STOCKS (state, data) {
    state.dailyStocks = data;
  },
  SET_DATE_ARRAY (state, data) {
    state.dateArray = data;
  },
  SET_DB_INITED (state, data) {
      state.dbInited = data;
  }
}

const actions = {
  
}

export default {
  state,
  mutations,
  actions
}