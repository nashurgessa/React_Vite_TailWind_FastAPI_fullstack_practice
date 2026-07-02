## Tasks

---

##### Week 1

Day 1: Introduction and Setup

Introduction to Full-Stack Development

- Overview of full-stack development
- Project goals and structure
- Setting Up the Development Environment

Installing Node.js and npm
Installing Python and Flask
Setting up MySQL database
- Installing necessary tools (code editor, Postman, etc.)

---

Day 2: Basic React Concepts

React Basics

What is React and its core concepts (Components, JSX, Props, State)
Setting up a basic React project
Creating the First Component

Building a simple functional component
Understanding component hierarchy

---

Day 3: React Components and State Management

Advanced React Components

Class vs. Functional Components
State management with useState hook
Building a Basic UI

Creating a simple navigation bar
Designing a basic layout for the application

---

Day 4: Introduction to Flask and Backend Setup

Introduction to Flask

Setting up a basic Flask project
Understanding Flask routes and endpoints
Creating API Endpoints

Setting up a simple REST API
Connecting Flask to MySQL

---

Day 5: Connecting Frontend and Backend

Fetching Data from Backend

Making API calls from React using axios
Displaying data fetched from Flask API in React components
Introduction to CRUD Operations

Creating, Reading, Updating, and Deleting products via API

---

#### Week 2
Day 6: Advanced React Concepts

React Router

Setting up React Router for navigation
Creating multiple pages (Home, Product List, Product Details)
Form Handling in React

Building forms for product creation
Handling form submissions

---

Day 7: Video Streaming Integration

Uploading and Serving Videos

Setting up video upload functionality in React
Handling video uploads in Flask
Serving videos from the Flask server
Displaying Videos in React

Creating a video player component
Embedding videos in the product details page

---

Day 8: User Authentication

Introduction to Authentication

Setting up user authentication in Flask
Creating login and registration endpoints
Authentication in React

Building login and registration forms in React
Managing authentication state

---

Day 9: Advanced Backend Features

Secure API Endpoints

Implementing JWT (JSON Web Tokens) for securing endpoints
Middleware for protected routes in Flask
Database Relationships

Setting up relationships between users, products, and videos in MySQL
Writing advanced SQL queries

---

Day 10: State Management in React

Context API

Introduction to Context API for global state management
Setting up a global store for user authentication
Redux Basics (Optional)

Introduction to Redux for state management
Setting up Redux store and actions

---

Day 11: Advanced Features and Optimization

File Upload Optimization

Handling large video files
Implementing progress bars and user feedback during uploads
Performance Optimization

Lazy loading components
Optimizing API calls and reducing redundant re-renders

---

Day 12: Testing and Debugging

Testing React Components

Writing unit tests for React components
Introduction to testing libraries (Jest, React Testing Library)
Testing Flask API

Writing unit tests for Flask endpoints
Using Postman for manual API testing

---

Day 13: Deployment Preparation

Preparing for Deployment

Setting up environment variables
Building the React app for production
Deploying the Application

Deploying the backend (Flask) to a cloud provider (e.g., Heroku)
Deploying the frontend (React) to a static site host (e.g., Netlify, Vercel)

---

Day 14: Project Review and Q&A

Final Project Review

Walkthrough of the entire project
Reviewing code and project structure
Q&A Session

Addressing any remaining questions
Discussing potential improvements and next steps


#### Summary of Components
1. React Components:

> Navigation bar
Product list
Product details
Video player
Login and registration forms
Product creation form

2. Flask Endpoints:

> CRUD operations for products
Video upload and streaming
User authentication (login, registration)
Protected routes for authenticated users

3. Database (MySQL):

> User table
Product table
Video table
Relationships between users, products, and videos
This structure ensures a gradual introduction of concepts, with hands-on practice and a focus on building a functional application that incorporates both e-commerce and video streaming features.

---

## Introduction to React

1. What is React
   - A javascript library for building UI.
   - Developed and maintaned by meta (Facebook)
   - Emphasized the creation of reusable UI conponents.
2. Core Concepts:
   - Components: The building blocks of a React application
   - JSX: javascript xml, a syntax extension that allows making HTML with javascript
   - Props: Short for properties, used to pass data from parent to child components.
   - State: An object  that holds data that may change over the lifecycle of a component

---

#### Setting Up a Basic React Project

##### Using Create React App:

A command-line tool to set up a new React project quickly.
Run the following command in the terminal to create a new React app:
```bash
npx create-react-app ecommerce-app
```

Navigate into the project directory:
```bash
cd ecommerce-app
```

Start the development server:
```bash
npm start
```

Project Structure:
 > - public/: Contains the public assets of the application.
 > - src/: Contains the source code of the application.
 > - index.js: The entry point of the application.
 > - App.js: The main component.


---

##### Creating a First Component

1. Building a Simple Functional Component
	- Create a new file called `Header.js` in the `src` folder.
	- Add the following code to `Header.js`
	
	```jsx
	import React from 'react';
	function Header() {
	return (
		<header>
		<h1>Welcome to the E-commerce App</h1>
		</header>
	  );
	}

	export default Header;
	```

2. Using the Header Component in App.js:
	- Open `App.js` and import the  `Header` comonent
	- Use the `Header` component inside the `App` compoent:
	
	```jsx
	import React from 'react';
	import Header from './Header';

	function App() {
	return (
		<div className="App">
		<Header />
		</div>
	);
	}

	export default App;
	```

3. Running the Application
   - Ensure the development server is running (`npm start`)
   - Open the browser and navigate to `http://localhost:3000`
   - You should  see the "Welcome to E-commerce App" header.

---

####  Understanding the Component Hierarchy

1. Component Tree:

	- React applications are structured as a tree of components. (explain)
   - The App component is the root component, and other components branch out from it. (explain)
  
2. Parent-Child Relationship:

    - The `App component` is the parent of the Header component.
	- Components can have multiple child components, forming a nested structure.
  
---

###### React Props
React Props are like function arguments in `JavaScript` and attributes in `HTML`.

To send props into a component, use the same syntax as HTML attributes:

```jsx
const myElement = <Car brand="Ford" />;
```

The component receives the argument as a props object:

```jsx
function Car(props) {
  return <h2>I am a { props.brand }!</h2>;
}
```

###### Homework/Practice

   - Create a new component called `Footer`` that displays a simple footer message and include it in the App component.
   - Experiment with passing props to the Header component to customize the welcome message.
  
---

#### Creating a Footer Components

Create `Footer.js` in the `src/component` folder.

```jsx
function Footer(){
	return (
		<footer>
			<p>&copy; 2024 E-ecommerce App</p>
		</footer>
	);
}

export default Footer;
```

###### Exploring Props

- Modify `Header` to accept a `title` prop:

```jsx
function Header({title}) {
	return (
		<header>
			<h1>{title}</h1>
		</header>
	);
}

export default Header;
```
---

- Pass the `title` prop in `App.js`

```jsx
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Header title="Welcome to the E-commerce App"/>
      <Footer/>
    </div>
  );
}

export default App;

```


---

###### Homework/Practice:

- Create a new component called ProductList that displays a list of sample products.

- Use props to pass product data to the ProductList component.

try to use **short cut type `rfc`** to create a component

---

#### React Components and State Management 
  - Understand the difference between class and functional components.	
  - Learn state management in React using the useState hook.
  - Build a basic user interface with React components.
  - Understand and implement component hierarchy and state lifting.
  - (Optional) Introduce CSS styling with Tailwind CSS.

---

##### Class vs. Functional Components 

- Explanation of class components and their syntax.
- Introduction to lifecycle methods in class components.
- Comparison with functional components and hooks.

###### Creating a Class Component

- Create `Product.js` as a class component:
   use `rcc`

```jsx

import React, { Component } from 'react'

class Product extends Component {
  render() {
	return (
	  <div className="product">
		<h2>{this.props.name}</h2>
		<p>{this.props.description}</p>
		<p>{this.props.price}</p>
	  </div>
	)
  }
}

export default Product;
```

---

Use the `Product` component in `App.js`

```jsx
import Footer from './components/Footer';
import Product from './class_component/Products';


function App() {
  return (
    <div>
      <Header title="Welcome to the E-commerce App"/>
      <Product name="Product 1" description= "This is product 1" price="19.99"/>
      <Footer/>
    </div>
  );
}

export default App;

```

---

***go to `hook.md` for the introduction to State Management with `useState` Hook***

---

```jsx
import React, {useState } from 'react'

function Product ({name, description, price}) {

	const[quantity, setQuantity]  = useState(0);

  return (
	<div className="Product">
		<h2>{name}</h2>
		<p>{description}</p>
		<p>${price}</p>

		<div>
			<button onClick={()=>setQuantity(quantity - 1)}> - </button>
			<span>{quantity}</span>
			<button onClick={()=>setQuantity(quantity + 1)}> + </button>
		</div>
	</div>
  );
}

export default Product;
```

---

Use the `Product` component in`App.js`

```jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Product from './Product';

function App() {
  return (
    <div className="App">
      <Header title="Welcome to the E-commerce App" />
      <Product name="Product 1" description="This is product 1" price="19.99" />
      <Product name="Product 2" description="This is product 2" price="29.99" />
      <Footer />
    </div>
  );
}

export default App;

```

---

##### Building a Basic UI

######  Designing the Layout

	- Discuss best practices for designing a user-friendly layout.
	- Introduction to CSS styling and how to apply it to React components.
	- (Optional) Introduction to Tailwind CSS for styling components.
 
###### Creating a Simple Layout

Create a `ProductList` component to display multiple products:

```jsx
import React from 'react'
import Product from './Products'

function ProductList({products, updateQuantity}) {
  return (
	  <div className='product-list'>
      {products.map((product, index) => (
        <Product
          key={index}
          index={index}
          name={product.name}
          price={product.price}
          quantity={product.quantity}
          updateQuantity={updateQuantity}
        />
      ))}
    </div>
  );
}

export default ProductList;
```

Note: `{}` - Creates a code block that expects an explicit return statement. With `()` - implicit return takes place.

check the console  in your browser

> - Warning: Product: `key` is not  a prop...


Here we need a unique identifier for the  react to keep tract each Product, to do so, we added `key`


---

update `Product.js`

```jsx
import React from 'react'

function Product ({key,index, name, description, price, quantity, updateQuantity}) {

	//const[quantity, setQuantity]  = useState(0);

  return (
	<div className="product">
		<h2>{name}</h2>
		<p>{description}</p>
		<p>${price}</p>

		<div>
			<button onClick={()=>updateQuantity(index, -1)} disabled={quantity <= 0}> - </button>
			<span>{quantity}</span>
			<button onClick={()=>updateQuantity(index, 1)}> + </button>
		</div>
	</div>
  );
}

export default Product;
```

---

update `App.js`

```jsx
import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ProductList from './ProductList';

function App() {
  const [products, setProducts] = useState([
    { name: 'Product 1', description: 'This is product 1', price: 19.99, quantity: 0 },
    { name: 'Product 2', description: 'This is product 2', price: 29.99, quantity: 0 },
    { name: 'Product 3', description: 'This is product 3', price: 39.99, quantity: 0 },
  ]);

  const updateQuantity = (index, amount) => {
    const newProducts = [...products];
    newProducts[index].quantity += amount;
    setProducts(newProducts);
  };

  return (
    <div className="App">
      <Header title="Welcome to the E-commerce App" />
      <ProductList products={products} updateQuantity={updateQuantity} />
      <Footer />
    </div>
  );
}

export default App;

```

---

#### Summary
- Differentiated between class and functional components.
- Learned to manage state using the `useState` hook.
- Built a basic user interface with a structured component hierarchy.
- Implemented state lifting to manage shared state between components.

---

#### Homework/Practice:
- Extend the `Product` component to include an image URL prop and display the image.
- Experiment with adding more products and ensuring the quantity update functionality works correctly.


---

##### Detailed Steps for the Optional Tailwind CSS Integration:

Introduce Tailwind CSS for styling, here are the detailed steps:

1. **Install Tailwind CSS:**
    - Run the following commands to install Tailwind CSS and its dependencies:
      ```bash
      npm install -D tailwindcss
      npx tailwindcss init
      ```

2. **Configure Tailwind in `tailwind.config.js`:**
    - Add the paths to all of your template files in the `purge` option to remove unused styles in production builds:
      ```javascript
      module.exports = {
        purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
        darkMode: false, // or 'media' or 'class'
        theme: {
          extend: {},
        },
        variants: {
          extend: {},
        },
        plugins: [],
      }
      ```

3. **Add Tailwind Directives to `src/index.css`:**
    - Add the following lines to your `src/index.css` file to include Tailwind's base, components, and utilities styles:
      ```css
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
      ```

4. **Use Tailwind Classes in Your Components:**
    - Apply Tailwind CSS classes to style your components. For example, update the `Header` component:
      ```jsx
      function Header({ title }) {
        return (
          <header className="bg-blue-500 p-4 text-white text-center">
            <h1>{title}</h1>
          </header>
        );
      }

      export default Header;
      ```

    - Similarly, you can add classes to other components like `Product` and `Footer` to improve their styling.

 Tailwind CSS is an optional addition to give them a taste of utility-first CSS frameworks for quick and efficient styling.

Feel free to ask if you have any more questions or need further assistance with the lesson plans!

---

`App.js`

```jsx
import './App.css';

import { React, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ProductList from './ProductList';

function App() {


  const[products, setProducts] = useState([
    {name:"Product 1", description: "This is product 1", price:"19.99", quantity: 0},
    {name:"Product 2", description: "This is product 1", price:"29.99", quantity: 0},
    {name:"Product 3", description: "This is product 1", price:"19.99", quantity: 0}
  ]);

  const updateQuantity = (index,  amount) => {
    const newProducts = [...products];
    newProducts[index].quantity += amount;
    setProducts(newProducts);
  };

  return (
    <div className='App'>
      <Header title="Welcome to the E-commerce App"/>

    <ProductList products={products} updateQuantity={updateQuantity}/>
    
    <Footer/>
    </div>
  );
}

export default App;

```

---

`Header.js`

```jsx
function Header({title}) {
	return (
		<header className="bg-blue-500 p-4 text-white text-center">
			<h1>{title}</h1>
		</header>
	);
}

export default Header;
```

---

`Product.java`

```jsx
import React from 'react'

function Product ({index, name, description, price, quantity, updateQuantity}) {

	//const[quantity, setQuantity]  = useState(0);

  return (
	<div className="product p-4 border rounded shadow-md">
		<h2 className="text-t1 font-bold">{name}</h2>
		<p>{description}</p>
		<p>${price}</p>

		<div className="flex items-center space-x-4">
			<button 
				className='bg-red-500 text-white px-2 py-1 rounded'
				onClick={()=>updateQuantity(index, -1)} disabled={quantity <= 0}> - </button>
			<span>{quantity}</span>
			<button 
				className='bg-green-500 text-white px-2 py-1 rounded'
				onClick={()=>updateQuantity(index, 1)}> + </button>
		</div>
	</div>
  );
}

export default Product;
```

---

`Footer.js`

```jsx
function Footer(){
	return (
		<footer className="bg-gray-800 p-4 text-white text-center">
			<p>&copy; 2024 E-ecommerce App</p>
		</footer>
	);
}

export default Footer;
```

---

###### Summary of the Code:
**App.js:** The main component that maintains the state for the product quantities and passes down the state and the state updater function (updateQuantity) to the ProductList component.

**ProductList.js:** A component that maps through the list of products and renders a Product component for each product, passing down relevant props.

**Product.js:** A component that displays product details and includes buttons to increase or decrease the quantity, with styles optionally added using Tailwind CSS.

**Header.js:** A simple header component that takes a title prop and displays it.

**Footer.js:** A simple footer component with static content.

---

#### Connecting Frontend and Backend

###### Objectives:

   - Understand how to fetch data from a backend API using React.
   - Make API calls using axios.
   - Display data fetched from Flask API in React components.
   - Introduction to CRUD operations with Flask and React.

###### Prerequisites:

   - Completion of Day 4 content.
   - Basic understanding of React components and state management.
   - Basic understanding of Flask and API endpoints.


> Install `Postman` or a similar tool for testing API endpoints.

---

###### Introduction to Fetching Data

Fetching Data from an API

   - Explanation of RESTful APIs.
   - Introduction to axios for making HTTP requests.
   - Overview of how to fetch data and handle responses in React.
  
###### Setting Up Axios

Install axios in the React project:

```npx
npm install axios
```

Create a service file to manage API calls (e.g., api.js):

```jsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust the base URL as necessary
});

export default api;
```

> Clarify the differences between various `HTTP` methods (`GET`, `POST`, `PUT`, `DELETE`).


##### Fetching and Displaying Data in React

** goto React useEffect Hooks**

Integrating API Calls in React
   - Fetching data when a component mounts.

###### Fetching Products from the Backend

Update `ProductList.js` to fetch product data from the backend:

```jsx
import React, { useEffect, useState } from 'react';
import Product from './Product';
import api from './api';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-list">
      {products.map((product, index) => (
        <Product
          key={index}
          index={index}
          name={product.name}
          description={product.description}
          price={product.price}
          quantity={product.quantity}
          updateQuantity={() => {}}
        />
      ))}
    </div>
  );
}

export default ProductList;
```

---

Ensure the backend Flask server has a /products endpoint that returns a list of products:

```python
from flask import Flask, jsonify

app = Flask(__name__)

products = [
    {'name': 'Product 1', 'description': 'This is product 1', 'price': 19.99, 'quantity': 0},
    {'name': 'Product 2', 'description': 'This is product 2', 'price': 29.99, 'quantity': 0},
    {'name': 'Product 3', 'description': 'This is product 3', 'price': 39.99, 'quantity': 0},
]

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products)

if __name__ == '__main__':
    app.run(debug=True)
```

---

###### Introduction to CRUD Operations

CRUD Operations Overview

   - Explanation of Create, Read, Update, and Delete operations.
   - How CRUD operations are implemented in RESTful APIs.

Implementing CRUD Endpoints in Flask

   - Add endpoints for creating, updating, and deleting products:

```python 
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

app.config['CORS_HEADERS']='Content-Type'


@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/api/add_products', methods=['POST'])
def create_product():
    new_product = request.json
    products.append(new_product)
    return jsonify(new_product), 201

@app.route('/api/products/<int:index>', methods=['PUT'])
def update_product(index):
    product = products[index]
    updated_data = request.json
    product.update(updated_data)
    return jsonify(product)

@app.route('/api/products/<int:index>', methods=['DELETE'])
def delete_product(index):
    deleted_product = products.pop(index)
    return jsonify(deleted_product), 204
```

---

###### Adding Events
React events are written in camelCase syntax:

`onClick` instead of onclick.

React event handlers are written inside curly braces:

`onClick={shoot}`  instead of onclick="shoot()".

```jsx
<button onClick={shoot}>Take the Shot!</button>
```

Example:

```jsx
function Football() {
  const shoot = () => {
    alert("Great Shot!");
  }

  return (
    <button onClick={shoot}>Take the shot!</button>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Football />);
```

**Passing Arguments**

To pass an argument to an event handler, use an arrow function.

Example:

```jsx
function Football() {
  const shoot = (a) => {
    alert(a);
  }

  return (
    <button onClick={() => shoot("Goal!")}>Take the shot!</button>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Football />);
```


###### Handling Forms

Handling forms is about how you handle the data when it changes value or gets submitted.

In HTML, form data is usually handled by the DOM.

In React, form data is usually handled by the components.

When the data is handled by the components, all the data is stored in the component state.

You can control changes by adding event handlers in the `onChange` attribute.

We can use the `useState` Hook to keep track of each inputs value and provide a "single source of truth" for the entire application.

```jsx
import { useState } from 'react';
import ReactDOM from 'react-dom/client';

function MyForm() {
  const [name, setName] = useState("");

  return (
    <form>
      <label>Enter your name:
        <input
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
    </form>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MyForm />);
```

###### Handling Update and Delete Operations in React

---

create a form to add new products:

```jsx
import React, { useState } from 'react';
import api from './api';

function AddProductForm({ onAdd }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newProduct = { name, description, price: parseFloat(price), quantity: 0 };
    try {
      const response = await api.post('/add_products', newProduct);
      onAdd(response.data);
    } catch (error) {
      console.error('Error adding product', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <button type="submit">Add Product</button>
    </form>
  );
}

export default AddProductForm;
```

---

Update ProductList.js to handle product addition:

```jsx
import React, { useEffect, useState } from 'react';
import Product from './Product';
import AddProductForm from './AddProductForm';
import api from './api';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  return (
    <div className="product-list">
      <AddProductForm onAdd={handleAddProduct} />
      {products.map((product, index) => (
        <Product
          key={index}
          index={index}
          name={product.name}
          description={product.description}
          price={product.price}
          quantity={product.quantity}
          updateQuantity={() => {}}
        />
      ))}
    </div>
  );
}

export default ProductList;
```

---

Modify `Product.js` to include an edit form:

```jsx
import React, { useState } from 'react';
import api from './api';

function Product({ index, name, description, price, quantity, updateQuantity, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDescription, setEditDescription] = useState(description);
  const [editPrice, setEditPrice] = useState(price);

  const handleUpdate = async (event) => {
    event.preventDefault();
    const updatedProduct = { name: editName, description: editDescription, price: parseFloat(editPrice), quantity };
    try {
      await api.put(`/products/${index}`, updatedProduct);
      onUpdate(index, updatedProduct);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating product', error);
    }
  };

  return (
    <div className="product p-4 border rounded shadow-md">
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
          <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} required />
          <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} required />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <h2 className="text-xl font-bold">{name}</h2>
          <p>{description}</p>
          <p>${price}</p>
          <div className="flex items-center space-x-4">
            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => updateQuantity(index, -1)} disabled={quantity <= 0}>-</button>
            <span>{quantity}</span>
            <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => updateQuantity(index, 1)}>+</button>
            <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => setIsEditing(true)}>Edit</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Product;

```

Update `ProductList.js` to handle product updates:

```jsx
import React, { useEffect, useState } from 'react';
import Product from './Product';
import AddProductForm from './AddProductForm';
import api from './api';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (index, updatedProduct) => {
    const newProducts = [...products];
    newProducts[index] = updatedProduct;
    setProducts(newProducts);
  };

  return (
    <div className="product-list">
      <AddProductForm onAdd={handleAddProduct} />
      {products.map((product, index) => (
        <Product
          key={index}
          index={index}
          name={product.name}
          description={product.description}
          price={product.price}
          quantity={product.quantity}
          updateQuantity={() => {}}
          onUpdate={handleUpdateProduct}
        />
      ))}
    </div>
  );
}

export default ProductList;

```


---

```jsx
import React, { useState } from "react";
import api from "../API/Api";


function Product ({index, name, description, price, quantity, updateQuantity, onUpdate, onDelete}) {

	// const[quantity, setQuantity]  = useState(quantity_);

	const [isEditing, setIsEditing] = useState(false);
	const [editedName, setEditedName] =useState(name);
	const [editedDesciription, setDescription]= useState(description);
	const [editedPrice, setPrice]= useState(price);

	const handleUpdate = async (event) => {
		event.preventDefault();
		const updatedProduct = { name: editedName, description: editedDesciription, 
			price: parseFloat(editedPrice)}
		
		try{
			// send to server
			await api.put(`/products/${index}`, updatedProduct);
			//save to local
			onUpdate(index, updatedProduct);
			setIsEditing(false);
		} catch (error) {
			console.error("Error updating product", error)
		}
	};

	const handleDelete = async (event) => {
		event.preventDefault();

		try {
			await api.delete(`/products/${index}`)
			onDelete(index);

		} catch(error) {
			console.error("Error deleting product", error);
		}	
	};

  return (

	<div className="product p-4 border rounded shadow-md">

		{isEditing 
		?  <>
			<form onSubmit={handleUpdate}>
				<input type="text" value={editedName} onChange={(event) => setEditedName(event.target.value)}/>
				<input type="text" value={editedDesciription} onChange={(event) => setDescription(event.target.value)}/>
				<input type="text" value={editedPrice} onChange={(event) => setPrice(event.target.value)}/>
				<button type="submit" className="bg-green-500 px-2 py-1 rounded">Save</button>
				<span className="px-3"></span>
				<button type="button" onClick={() => setIsEditing(false)} className="bg-red-500 px-2 py-1 rounded">Cancel</button>
			</form>
		</>
		
		: <>
			<h2 className="text-t1 font-bold">{name}</h2>
			<p>{description}</p>
			<p>${price}</p>

			<div className="flex items-center space-x-4">
				<button 
					className='bg-red-500 text-white px-2 py-1 rounded'
					onClick={()=>updateQuantity(index, -1)} disabled={quantity <= 0}> 
					- 
				</button>
				<span>{quantity}</span>
				<button 
					className='bg-green-500 text-white px-2 py-1 rounded'
					onClick={()=>updateQuantity(index, 1)}> 
					+ 
				</button>

				<button className="bg-green-500 rounded text-white px-2  py -2" onClick={() => setIsEditing(true)}>Update</button>
				<button className="bg-red-500 rounded text-white px-2  py -2" onClick={(e) => handleDelete(e)}>Delete</button>
			</div>
		</>
		}
	</div>
  );
}

export default Product;
```

#### Advanced React Concepts

Objectives:
  - Understand and implement React Router for navigation.
  - Create multiple pages within the application.
  - Handle forms in React to create and update products.

Prerequisites:
  - Basic understanding of ***React components***, ***state management***, and ***fetching data*** from an API.


##### Introduction to React Router 

  - Explanation of single-page applications (SPAs).
  - Introduction to React Router and its benefits.
  - Overview of React Router components: `BrowserRouter`, `Routes`, `Route`, `Link`, and `NavLink`.

Hands-On Activity: Setting Up React Router

- Install React Router:
```bash
npm install react-router-dom
```
- Update `App.js` to include routing:






Installing Dependencies
For styling and icons, you might want to use libraries like styled-components and react-icons. Install them using:

```bash
npm install styled-components react-icons
```


###### Add React Router

`index.js`

```jsx
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

We wrap our content first with `<BrowserRouter>`.

Then we define our `<Routes>`. An application can have multiple `<Routes>`. Our basic example only uses one.

`<Route>`s can be nested. The first `<Route>` has a path of `/` and renders the Layout component.

The nested `<Route>`s inherit and add to the parent route. So the blogs path is combined with the parent and becomes `/blogs`.

The Home component route does not have a path but has an index attribute. That specifies this route as the default route for the parent route, which is `/`.

Setting the path to `*` will act as a catch-all for any undefined URLs. This is great for a `404` error page.


###### Pages / Components
The `Layout` component has `<Outlet>` and `<Link>` elements.

The `<Outlet>` renders the current route selected.

`<Link>` is used to set the URL and keep track of browsing history.

Anytime we link to an internal path, we will use `<Link>` instead of `<a href="">`.

The "layout route" is a shared component that inserts common content on all pages, such as a navigation menu.

```jsx
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/blogs">Blogs</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};
```


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


![1718936906522](image/short_semster_notes/1718936906522.png)


https://www.flaticon.com/search?word=chat