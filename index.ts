const { get, put, post, del } = require('@/lib/request2')
import { ActionContext } from 'vuex'



// type getData = (json: Promise<object>) => any

interface State {
  [key: string]: any
}

type ResponseJSON = State



export function factoryArray(field: string, selector='data') {
  return function (state: State, json: ResponseJSON) {
    // 没有参数检测，请确保arguments可用
    state[field] = [...state[field], ...json[selector].result]
  }
}


export function set(field: string, value?: any , selector: string='data') {
  return function (state: State, json: ResponseJSON ) {
    if(value) {
      state[field] = value
    } else {
      state[field] = json[selector]
    }
    // state[field] = arg.value ? arg.value : json[arg.selector]
  }
}

type RequestParams = {
  [key: string]: any
}

/**
 * 动态生成vuex async action(结合服务器api设计更改
 * @param {string} requestUrlTemplate 请求字符串 "/api/albums/:id/course/:courseId"
 * @param {string} method 请求类型
 */
export function makeAsyncAction (requestUrlTemplate: string, COMMIT_TYPE: string | null, name: string='get',) {
  /* http 请求类型 */
  const method = getMethod(name)
  // 调用时传入的各种参数类型
  return async function ({ commit, rootState, state }: ActionContext<any, any>, payload: RequestParams): Promise<object> {
    const url = getUrl(requestUrlTemplate, payload)
    /* http 请求 */
    const json = await method(url, payload)
    if(COMMIT_TYPE) commit(COMMIT_TYPE, json)
    return json
  }
}


/**
 * 方法判断
 */ 
export function getMethod (name: string='get'): (path: string, options: RequestParams ) => any {
  if (name == 'put') return put
  else if (name == 'post') return post
  else if (name == 'delelte') return del
  return get
}

export function getUrl(requestUrlTemplate: string, payload: RequestParams): string { 
  return requestUrlTemplate.replace(/(:(.+?)(\/|$))/g, function(match, p1, p2, p3) {
    const value = payload[p2]
    if(!value) throw new Error(`payload中找不到与${p2}对应的值`)
    const ret: string = [value, p3].join('')
    delete payload[p2]
    return ret
  })
}
