
/*
 * @author: chai_xb@163.com
 */
export function factoryArray(field) {
  return function (state) {
    // 没有参数检测，请确保arguments可用
    state[field] = [...state[field], ...arguments[1]]
  }
}


export function set(field, value) {
  return function (state) {
    state[field] = value == null ? arguments[1] : value
  }
}

export function factoryObject(field) {
  return function (state) {
    state[field] = { ...state[field], ...arguments[1] }
  }
}


/**
 * 动态生成vuex async action(结合服务器api设计更改
 * @param {string} requestUrlTemplate 请求字符串 "/api/albums/:id/course/:courseId"
 * @param {string} method 请求类型
 *
 *
 * usage: [types.GET_USER_POSTS]: asyncAction('/api/user/:userId/posts/:postId/', types.GET_USER_POSTS_SUCESS)
 */
export function asyncAction (requestUrlTemplate, COMMIT_TYPE, _method='get',) {
  let method = get
  if (_method == 'put') method = put
  else if (_method == 'post') method = post
  
  /**
   * vuex async action builder
   * 😘😘 🎉🎉 😏😏
   */
  return async function ({ commit, rootState, state }, payload) {
    const url = requestUrlTemplate.replace(/(:(.+?)(\/|$))/g, function(match, p1, p2, p3) {
      const ret = [payload[p2], p3].join('')
      delete payload[p2]
      return ret
    })
    /* http request */
    const json = await method(url, { data: payload })
    commit(COMMIT_TYPE, json)
    return json 
  }
}
