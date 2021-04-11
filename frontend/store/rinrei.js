export const state = () => ({
    counter: 1,
   })
   
   export const getters = {
    counter: state => state.counter
   }
    
   export const mutations = {
    countUp (state, number) {
      state.counter+= number;
    },
   }

   export const actions =  {
    countAction ({ commit }, number) {
      commit('countUp', number)
    }
   }
