// React Fetch Hook v1.0
// https://github.com/JulianStoev/react-fetch-hook

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

  const post    = useCallback(data => go(data, 'POST'), [go]);
  const put     = useCallback(data => go(data, 'PUT'), [go]);
  const get     = useCallback(data => go(data, 'GET'), [go]);
  const head    = useCallback(data => go(data, 'HEAD'), [go]);
  const options = useCallback(data => go(data, 'OPTIONS'), [go]);
  const del     = useCallback(data => go(data, 'DELETE'), [go]);

  return {
    post,
    put,
    get,
    head,
    options,
    del
  }
  
}
