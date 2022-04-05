// React Fetch Hook v1.1
// https://github.com/JulianStoev/ReactFetchHook

import { useCallback } from "react";

export function useFetch() {

  const go = useCallback((data, type) => {
      data.toSend = {
        method: type,
        mode: 'cors',
        headers: new Headers({
          'Content-Type': (data.urlencoded ? 'application/x-www-form-urlencoded' : 'application/json')
        })
      };
      if (type === 'GET') {
        data.uri += '?' + new URLSearchParams(data.data);
       } else {
         data.toSend.body = JSON.stringify(data.data);
       }

      return fetch(data.uri, data.toSend)
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
        .catch(error => console.error('[Fetch error]', error));
  }, []);

  const post    = data => go(data, 'POST');
  const put     = data => go(data, 'PUT');
  const get     = data => go(data, 'GET');
  const head    = data => go(data, 'HEAD');
  const options = data => go(data, 'OPTIONS');
  const del     = data => go(data, 'DELETE');

  return {
    post,
    put,
    get,
    head,
    options,
    del
  }
  
}
