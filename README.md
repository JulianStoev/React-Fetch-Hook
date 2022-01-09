# React Fetch API Hook
Simple hook to use the Fetch API in react for ajax calls.

## Sample Usage
```
const { post, get } = useFetch();

const getHome = await post({uri: '/pages/home', data: {someparam: 1}});

get({uri: '/header', data: {someparam: 1}).then(json => console.log(json));
```
