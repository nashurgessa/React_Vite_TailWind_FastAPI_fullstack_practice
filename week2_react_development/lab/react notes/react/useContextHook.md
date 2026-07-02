
##### React Context

`itemContext.jsx`

```javascript 
import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const ItemContext = createContext();

// Create a provider component
function ItemProvider({ children }) {
  const [item, setItem] = useState(() => {
    // Load the initial state from localStorage
    const savedItem = localStorage.getItem('item');
    return savedItem ? JSON.parse(savedItem) : null;
  });

  useEffect(() => {
    // Save the item state to localStorage whenever it changes
    if (item) {
      localStorage.setItem('item', JSON.stringify(item));
    } else {
      localStorage.removeItem('item');
    }
  }, [item]);

  return (
    <ItemContext.Provider value={{ item, setItem }}>
      {children}
    </ItemContext.Provider>
  );
}

export default ItemProvider;
```


`productDetailView.jsx`

```jsx

import { ItemContext } from './context_provider/ItemContext';

function ProductDetailView() {
    // define the useContext provider
  const {setItem} = useContext(ItemContext);

  // ...

  <Link to= '/payment'> {/* Ensure 'product' is correctly passed */}
    <button className='btn-buy bg-red-500 px-5 py-2 rounded mr-5' onClick = { (e) => {
      setItem(product);
      onBuyClick(e, product);
    }}>
      Buy Now
    </button>
  </Link>

}
```

`app.js`
```jsx

import ItemProvider from './components/context_provider/ItemContext';

function App() {
  return (
    <ItemProvider>
      <AppRouter/>
    </ItemProvider>
  
  );
```