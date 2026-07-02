
### React Redux and Provider

#### React Redux

React Redux is a state management library specifically designed for managing and centralizing application state in React applications. It acts as a bridge between React and Redux, a predictable state container for JavaScript apps.

Key Concepts:
1. State Management: It helps manage the state of an application in a single place (the Redux store), making it easier to manage and debug.
2. Action: An action is a plain JavaScript object that describes an event that has occurred. Actions are the only source of information for the store.
3. Reducer: A reducer is a pure function that takes the current state and an action as arguments and returns a new state. It determines how the state should change in response to actions.
4. Store: The store is an object that brings actions and reducers together. It holds the application's state and provides methods to access state, dispatch actions, and register listeners.

###### Provider
The Provider is a component from the React Redux library that makes the Redux store available to any nested components that need to access the Redux state.

Key Concepts:
1. Store Propagation: The Provider component takes a store prop, which is the Redux store you have created. It propagates this store to the rest of your app.
2. Context API: Under the hood, Provider uses React’s Context API to pass the store to deeply nested components without having to pass props manually at every level.

Basic Example:
Heres a simple example to demonstrate how to set up and use React Redux with Provider:

```bash 
npm install redux react-redux redux-persist
```

`index.js`
```javascript
// STORE -> gLOBALIZED STATE

// ACTION INCREMENT
const increment = () => {
  return { type: 'INCREMENT' };
}

// ACTION DECREMENT
const decrement = () => {
  return { type: 'DECREMENT' };
}

// REDUCER
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
  }
}

let store = createStore(counter);

// Display it in the console
store.subscribe(() => console.log(store.getState()));

// DISPATCH
store.dispatch(increment());
store.dispatch(decrement());
store.dispatch(increment());
```

https://www.youtube.com/watch?v=CVpUuw9XSjY

Setting up the Redux Store:

```javascript
import { createStore } from 'redux';

const initialState = {
  counter: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1 };
    case 'DECREMENT':
      return { ...state, counter: state.counter - 1 };
    default:
      return state;
  }
};

const store = createStore(reducer);
```

2. Setting up the Provider in React:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';
import reducer from './reducer';  // Your reducer file

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

3. Connecting Components to the Redux Store:
```javascript
import React from 'react';
import { connect } from 'react-redux';

const Counter = ({ counter, increment, decrement }) => (
  <div>
    <p>Counter: {counter}</p>
    <button onClick={increment}>Increment</button>
    <button onClick={decrement}>Decrement</button>
  </div>
);

const mapStateToProps = (state) => ({
  counter: state.counter,
});

const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch({ type: 'INCREMENT' }),
  decrement: () => dispatch({ type: 'DECREMENT' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```



By using Provider and connect, components can access the Redux state and dispatch actions without prop drilling.