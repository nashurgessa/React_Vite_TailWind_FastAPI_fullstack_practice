
#### Axios Overview

###### What is Axios?
- Promise-based HTTP client for JavaScript
- Works in both browser and Node.js environments
- Used to make asynchronous HTTP requests to interact with APIs


###### Key Features
1. Promise-Based: Simplifies asynchronous operations
2. Cross-Platform: Browser and Node.js compatibility
3. Interceptors: Modify requests/responses before handling
4. Transformation: Automatic JSON data handling
5. Error Handling: Simplified error management
6. Cancellation: Support for request cancellation
7. Default Configurations: Set global defaults for requests
8. Convenience Methods: Easy-to-use methods for standard HTTP requests


**Create an Axios Instance:**
```javascript
import axios from 'axios';

const api = axios.create({
	baseURL: "http://127.0.0.1:5000/api"
});

export default api;
```

**GET Request:**

```javascript
axios.get('https://api.example.com/data')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('There was an error!', error);
  });
```

**POST Request:**
```javascript
axios.post('https://api.example.com/data', {
  key1: 'value1',
  key2: 'value2'
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('There was an error!', error);
  });
```

---

```jsx
 const config = {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // For file uploads
    },
};

try {
    const response = await api.post('/add-product', formData, config);
    if (response.status === 201) {
        const result = response.data;
        setSuccess(result);
    }
    else if(response.status === 403) {
        setError('Authentication failed, please login in again');
        // TODO: Login again
    } else {
        setError('Failed to save the product');
    }
} catch (error) {
    setError(error.message);
} finally {
    setLoading(false);
}
```


```jsx
const headerConfig = {
      headers: {
          'Content-Type': 'application/json',
      }
    }

    const response = await api.post(`${SIGNIN}`, jsonData, headerConfig);
```

##### Using Interceptors
**Request Interceptor:**
```javascript
axios.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer token';
  return config;
}, error => {
  return Promise.reject(error);
});
```

**Response Interceptor:**
```	javascript
axios.interceptors.response.use(response => {
  return response;
}, error => {
  return Promise.reject(error);
});
```

###### Canceling a Request
**Setup and Cancellation:**
```javascript
const source = axios.CancelToken.source();

axios.get('https://api.example.com/data', {
  cancelToken: source.token
}).catch(thrown => {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    console.error('Error', thrown.message);
  }
});

// Cancel the request
source.cancel('Operation canceled by the user.');
```