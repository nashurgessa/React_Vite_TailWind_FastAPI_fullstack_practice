

// Get featured product

// Total number of featured product are retrieved are 6

### `useFeaturedProducts`
> Designed to fetch and manage featured products data. Here's a breakdown of how the code works and how you might use it to design a component that displays featured products.

#### Understanding the Hook

`useFeaturedProducts Hook:`

1. `State Management`:
 - featuredProducts: Stores the fetched featured products.
 - isLoading: Indicates whether the data is currently being fetched.
 - error: Stores any error messages encountered during fetching.

2. `fetchFeaturedProducts` Function:
 - Asynchronously fetches featured products from the API.
 - Updates the state based on the response or error.

3. `useEffect` Hook:
 - Triggers the data fetching when the component mounts and if featuredProducts is empty.

4. `Returned Object`:
 - featuredProducts: The fetched product data.
 - fetchFeaturedProducts: The function to manually trigger data fetching.
 - isLoading: Loading state.
 - error: Error state.