# vuex-util


通常呢一个state会有以下的结构


state

```javascript

const state = {
  posts: [],
  post: {}
}

```


mutations

```javascript
const mutations = {
  [CLEAR_POSTS]: (state) {
    state.posts = []
  },
  [GET_POST_SUCCESS] (state, newPost) {
    state.post = newPost
  },
  [GET_MORE_POSTS_SUCCESS] (state, posts) {
    state.posts = [...state.posts, ...posts]
  }
}
```


actions

```javascript
const actions = {
  [GET_POST] ({ commit }, payload) {
    fetch(something).then(() => { 
      commit(GET_POST_SUCCESS)
    })
  },
  [GET_MORE_POST] ({ commit }, payload) {
    fetch(otherthing).then((json) => {
      commit(GET_MORE_POSTS_SUCCESS, json)
    }
  }
}
```


使用以下代码避免重复的state赋值

```javascript

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


```

然后mutations就变成了这样

```javascript
const mutations = {
  [CLEAR_POSTS]: set('posts', []),
  [GET_POST_SUCCESS]: set('post'),
  // 对象的情况类似
  [GET_MORE_POSTS_SUCCESS]: factoryArray('posts')
}
```


