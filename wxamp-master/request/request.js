import { post as requestPost } from "../utils/aoixs"

const request = (url, data, apihost, method, header) => {
  const finalUrl = url.startsWith('/') ? url : `/${url}`
  return requestPost(finalUrl, data, apihost, method, header)
}

export {
  request
}