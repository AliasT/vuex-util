
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

