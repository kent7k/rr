export const state = () => ({
    drawer: false,
    status: false,
    message: "",
    post: {},
    posts: [],
    calorie: 0,
    carbo: 0,
    protein: 0,
    lipid: 0,
    price: 0,
  })
  
  export const getters = {
    drawer: (state) => state.drawer,
    status: (state) => state.status,
    message: (state) => state.message,
    post: (state) => state.post,
    posts: (state) => state.posts,
    calorie: (state) => state.calorie,
    carbo: (state) => state.carbo,
    protein: (state) => state.protein,
    lipid: (state) => state.lipid,
    price: (state) => state.price,
  }
  
  export const mutations = {
    setDrawer(state, drawer) {
      state.drawer = drawer
    },
    setPosts(state, post) {
      state.post = post
      state.posts.push(post)
    },
    resetPosts(state, payload) {
      state.posts = payload
    },
    unsetPosts(state, post) {
      state.post = post
      state.post.some(function (v, i) {
        if (v.id == post.id) state.posts.splice(i, 1)
        console.log("削除成功")
      })
    },
    setCalorie(state, payload) {
      state.calorie = payload
    },
    setCarbo(state, payload) {
      state.carbo = payload.toFixed(1)
    },
    setProtein(state, payload) {
      state.protein = payload.toFixed(1)
    },
    setLipid(state, payload) {
      state.lipid = payload.toFixed(1)
    },
    setPrice(state, payload) {
      state.price = payload
    },
    setStatus(state, bool) {
      state.status = bool
    },
    setMessage(state, message) {
      state.message = message
    },
  }
  
  export const actions = {
    showDrawer({ commit }, payload) {
      commit("setDrawer", payload)
    },
    addPost({ state, commit, dispatch }, post) {
      commit("setPosts", post)
      let calorie = 0.0
      let carbo = 0.0
      let protein = 0.0
      let lipid = 0.0
      let price = 0.0
      state.posts.forEach((f) => {
        calorie += f.calorie
        carbo += f.carbonhydrate
        protein += f.protein
        lipid += f.lipid
        price += f.price
        console.log("終了")
      })
      console.log("代入")
      commit("setCalorie", calorie)
      commit("setCarbo", carbo)
      commit("setProtein", protein)
      commit("setLipid", lipid)
      commit("setPrice", price)
      dispatch("showPostMessage", {
        status: true,
        message: "献立に追加しました。",
      })
      console.log("表示できたよ")
    },
    deletePost({ state, commit, dispatch }, post) {
      commit("unsetPosts", post)
      let calorie = 0.0
      let carbo = 0.0
      let protein = 0.0
      let lipid = 0.0
      let price = 0.0
      state.posts.forEach((f) => {
        calorie += f.calorie
        carbo += f.carbonhydrate
        protein += f.protein
        lipid += f.lipid
        price += f.price
        console.log("終了")
      })
      console.log("代入")
      commit("setCalorie", calorie)
      commit("setCarbo", carbo)
      commit("setProtein", protein)
      commit("setLipid", lipid)
      commit("setPrice", price)
      dispatch("showPostMessage", {
        status: true,
        message: "献立から削除しました。",
      })
      console.log("表示できたよ")
    },
    deleteChoise({ commit }) {
      commit("setCalorie", 0)
      commit("setCarbo", 0)
      commit("setProtein", 0.0)
      commit("setLipid", 0.0)
      commit("setPrice", 0)
      commit("resetPosts", [])
    },
    showPostMessage({ commit }, { message, status }) {
      commit("setStatus", status)
      commit("setMessage", message)
      setTimeout(() => {
        commit("setStatus", !status)
      }, 700)
    },
    async registerPosts(
      { commit, dispatch, rootState, state },
      { day, zone, number }
    ) {
      try {
        if (state.posts.length) {
          const res = await this.$axios.$post("/api/v1/menus", {
            user_id: rootState.auth.currentUser.id,
            date: day,
            timezone: zone,
            timezone_number: number,
          })
          console.log(res)
          await Promise.all(
            state.posts.map((post) => {
              this.$axios.post("api/v1/choise_posts", {
                post_id: post.id,
                menu_id: res.id,
              })
            })
          )
          await this.$axios
            .$get(`/api/v1/users/${rootState.auth.currentUser.id}`)
            .then((res) => {
              console.log(res)
              commit("auth/setLoginUser", res, { root: true })
              console.log("成功")
            })
          dispatch(
            "flashMessage/showMessage",
            {
              message: "献立を保存しました。",
              type: "success",
              status: true,
            },
            { root: true }
          )
          dispatch("deleteChoise")
        } else {
          dispatch(
            "flashMessage/showMessage",
            {
              message: "献立を選択して下さい",
              type: "error",
              status: true,
            },
            { root: true }
          )
        }
      } catch (err) {
        console.log(err)
        dispatch(
          "flashMessage/showMessage",
          {
            message: "同じ日付・時間帯では1度しかセットできません",
            type: "error",
            status: true,
          },
          { root: true }
        )
      }
    },
  }
  