
### State Management with useState Hook

Hooks allow function components to have access to state and other React features. Because of this, class components are generally no longer needed.

**What is a Hook?**
Hooks allow us to "hook" into React features such as state and lifecycle methods.

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function FavoriteColor() {
  const [color, setColor] = useState("red");

  return (
    <>
      <h1>My favorite color is {color}!</h1>
      <button
        type="button"
        onClick={() => setColor("blue")}
      >Blue</button>
      <button
        type="button"
        onClick={() => setColor("red")}
      >Red</button>
      <button
        type="button"
        onClick={() => setColor("pink")}
      >Pink</button>
      <button
        type="button"
        onClick={() => setColor("green")}
      >Green</button>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FavoriteColor />);
```

You must import Hooks from react.

Here we are using the useState Hook to keep track of the application state.

State generally refers to application data or properties that need to be tracked.

**Hook Rules**

There are 3 rules for hooks:

   - Hooks can only be called inside React function components.
  - Hooks can only be called at the top level of a component.
  - Hooks cannot be conditional

***Note:*** Hooks will not work in React class components.

**React useState Hook**

The React useState Hook allows us to track state in a function component.

State generally refers to data or properties that need to be tracking in an application.

**What Can State Hold**

The useState Hook can be used to keep track of `strings`, `numbers`, `booleans`, `arrays`, `objects`, and any combination of these!

We could create multiple state Hooks to track individual values.

Using the useState Hook
- Modify `Product.js` to manage state with `useState`:

**Updating Objects and Arrays in State**

When state is updated, the entire state gets overwritten.

```jsx
const [car, setCar] = useState({
    brand: "Ford",
    model: "Mustang",
    year: "1964",
    color: "red"
  });
```

What if we only want to update the color of our car?

If we only called `setCar({color: "blue"})`, this would remove the brand, model, and year from our state.

We can use the JavaScript spread operator to help us.

```jsx
const [car, setCar] = useState({
    brand: "Ford",
    model: "Mustang",
    year: "1964",
    color: "red"
  });

  const updateColor = () => {
    setCar(previousState => {
      return { ...previousState, color: "blue" }
    });
  }
```

Because we need the current value of state, we pass a function into our setCar function. This function receives the previous value.

We then return an object, spreading the previousState and overwriting only the color.