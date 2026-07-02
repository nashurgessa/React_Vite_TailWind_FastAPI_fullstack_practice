
### ProductSingleView

> input value

```json
{
    "category_id": 5,
    "classifications": [
        {
            "cross_product": [
                {
                    "cross_product_id": 107,
                    "picture": "/public/images/20240809182755075608_puma_shoes.webp",
                    "price": "111.00",
                    "status": "active",
                    "stock": 10,
                    "value": [
                        "red"
                    ],
                    "variant_type_id": [
                        61
                    ],
                    "variant_value_id": [
                        134
                    ],
                    "weight": "20.00"
                },
                {
                    "cross_product_id": 108,
                    "picture": "/public/images/20240809182755076282_puma_shoes.webp",
                    "price": "111.00",
                    "status": "active",
                    "stock": 10,
                    "value": [
                        "green"
                    ],
                    "variant_type_id": [
                        61
                    ],
                    "variant_value_id": [
                        135
                    ],
                    "weight": "20.00"
                }
            ],
            "variants": {
                "Color": {
                    "values": [
                        "red",
                        "green"
                    ],
                    "variant_type_id": 61,
                    "variant_value_id": [
                        134,
                        135
                    ]
                }
            }
        }
    ],
    "currency_id": 2,
    "description": "Photo format must be .jpg, .jpeg, .png and min size. 300 x 300 px (for optimal images, use a min. size of 1,200 x 1,200 px).\n\nSelect a product photo or drag and drop up to 9 photos at once here. Upload min. 5 photos that are interesting and different from each other to attract buyers' attention.",
    "guidance_img": "/public/images/20240809182755076443_Screenshot_2024-07-04_at_8.13.21_in_the_evening.png",
    "minimum_order": 0,
    "name": "Afro phone",
    "photos": [
        {
            "is_main_photo": 1,
            "photo_id": 53,
            "photo_url": "/public/images/20240809182755074536_puma_shoes.webp"
        },
        {
            "is_main_photo": 0,
            "photo_id": 54,
            "photo_url": "/public/images/20240809182755075048_puma_shoes.webp"
        }
    ],
    "product_condition": "new",
    "product_id": "8193c8ec-c058-4927-a9d8-9e709c10e125",
    "shop_id": "",
    "showcase": "Afro store ashewa meda",
    "status": "active",
    "stock_quantity": null,
    "unit_price": "111.00",
    "user_id": ""
}
```


---

***UML Class Diagram for ProductSingleView***

Here is a textual description of the UML class diagram:

- ProductSingleView

> Attributes:
id: string (from URL parameters)
product: Product | null
productPrice: number
productPhotos: Photo[]
selectedValue: SelectedItem[]
isMobile: boolean
selectedItems: {[key: string]: string}
isButtonDisabled: boolean
showNotification: boolean
Methods:
fetchProduct(): void
onProductUpdate(e: Event, value: number): void
toggleSelectedItem(e: Event, groupKey: string, value: string): void
onAddToCart(): void
onBuyClick(e: Event): void
Product

Attributes:
id: string
name: string
unit_price: number
photos: Photo[]
classifications: Classification[]
quantity: number
Photo

Attributes:
photo_url: string
Classification

Attributes:
variants: {[key: string]: Variant}
cross_product: {[key: string]: CrossProduct}
Variant

Attributes:
values: string[]
CrossProduct

Attributes:
value: string[]
price: number
stock: number
SelectableComponent

Attributes:
value: string
isSelected: boolean
Methods:
onSelected(e: Event): void
PromotionBanner

Attributes:
price: number
ChatComponent

Attributes:
user_id: string
ItemContext

Methods:
setItem(product: Product): void
UML Class Diagram
Here's a visual representation of the UML class diagram described:

plaintext
Copy code
+--------------------+
| ProductSingleView  |
+--------------------+
| - id: string       |
| - product: Product |
| - productPrice: number |
| - productPhotos: Photo[] |
| - selectedValue: SelectedItem[] |
| - isMobile: boolean |
| - selectedItems: {[key: string]: string} |
| - isButtonDisabled: boolean |
| - showNotification: boolean |
+--------------------+
| + fetchProduct()   |
| + onProductUpdate(e: Event, value: number) |
| + toggleSelectedItem(e: Event, groupKey: string, value: string) |
| + onAddToCart()    |
| + onBuyClick(e: Event) |
+--------------------+

+-------------+
| Product     |
+-------------+
| - id: string|
| - name: string |
| - unit_price: number |
| - photos: Photo[] |
| - classifications: Classification[] |
| - quantity: number |
+-------------+

+-----------+
| Photo     |
+-----------+
| - photo_url: string |
+-----------+

+----------------+
| Classification |
+----------------+
| - variants: {[key: string]: Variant} |
| - cross_product: {[key: string]: CrossProduct} |
+----------------+

+---------+
| Variant |
+---------+
| - values: string[] |
+---------+

+----------------+
| CrossProduct   |
+----------------+
| - value: string[] |
| - price: number |
| - stock: number |
+----------------+

+----------------------+
| SelectableComponent  |
+----------------------+
| - value: string      |
| - isSelected: boolean|
+----------------------+
| + onSelected(e: Event) |
+----------------------+

+-------------------+
| PromotionBanner   |
+-------------------+
| - price: number   |
+-------------------+

+---------------+
| ChatComponent |
+---------------+
| - user_id: string |
+---------------+

+--------------+
| ItemContext  |
+--------------+
| + setItem(product: Product) |
+--------------+
Description of Methods and Interactions:
fetchProduct: Fetches product details from the API and updates the state.
onProductUpdate: Updates the product quantity.
toggleSelectedItem: Updates selected items and adjusts product price based on cross-product matches.
onAddToCart: Handles the logic for adding items to the cart and displays a notification if not all required classifications are selected.
onBuyClick: Redirects to the payment page if all required classifications are selected; otherwise, shows a notification.
This UML class diagram and method descriptions should help visualize the ProductSingleView component's structure and interactions.



---

`toggleSelectedItem` Function

1. Overview of the Functionality
`toggleSelectedItem` is a function used to manage item selections within groups, ensuring only one item can be selected per group and handling comparisons of selections across different classifications. The function updates the selected `items state`, compares selections against `cross-product` data, and handles single selection constraints.

##### Key Responsibilities:
- Update Selection: Ensure **only one** item is selected per group.
- Handle State: Update and manage state for selected items and values.
- Compare Values: Check if the current selection matches any `cross-product` values in classifications.

2. UML Class Diagram
The UML Class Diagram illustrates the main components and their relationships involved in the toggleSelectedItem function.

```plaintext
+-------------------+
|  Product          |
+-------------------+
| - classifications : Object |
+-------------------+
| + getClassifications() : Object |
+-------------------+

+----------------------+
|  ToggleSelectedItem  |
+----------------------+
| - selectedItems : Object |
| - selectedValue : Array |
+----------------------+
| + toggleSelectedItem(e: Event, groupKey: String, value: String) : void |
+----------------------+

+---------------------------+
|  Classification           |
+---------------------------+
| - cross_product : Object  |
+---------------------------+
| + getCrossProduct() : Object |
+---------------------------+

+------------------------+
|  CrossProduct          |
+------------------------+
| - value : Array        |
+------------------------+
| + getValue() : Array   |
+------------------------+
```

3. UML Sequence Diagram
The UML Sequence Diagram illustrates the interactions between objects when the toggleSelectedItem function is invoked.

plaintext
Copy code
+---------------------+                +---------------------+
|    User Interface   |                |   ToggleSelectedItem|
+---------------------+                +---------------------+
          |                                   |
          | click(e, groupKey, value)         |
          |--------------------------------->|
          |                                   |
          |      setSelectedItems(prev)       |
          |--------------------------------->|
          |                                   |
          |      setSelectedValue(prev)       |
          |--------------------------------->|
          |                                   |
          |   check for matches in            |
          |   product.classifications          |
          |--------------------------------->|
          |                                   |
          |   compare values using Sets        |
          |--------------------------------->|
          |                                   |
          |        update state                |
          |<---------------------------------|
          |                                   |

4. Detailed Documentation `toggleSelectedItem` Function

##### Purpose:
The function updates the selection of an item within a group, ensuring that only one item is selected per group and performs cross-product value comparisons.

Parameters:
> `e (Event):` The event object from the user interaction.
> `groupKey (String):` The identifier for the group within which the item is being selected.
> `v`alue (String):` The item value being selected.

Returns:
`void:` The function does not return a value.

Implementation Details:
1. ***Prevent Default Behavior:*** 
    - `e.preventDefault();`: Prevents the default action associated with the event.

2. ***Update Selected Items State:***
    - setSelectedItems: Updates the selectedItems state to reflect the latest selection for the specified group. Ensures only one item is selected per group.

3. ***Update Selected Values State:***
- setSelectedValue: Updates the selectedValue state by removing previous selections from the same group and adding the new selection.

4. ***Compare with Cross-Product Values:***

    - Convert Arrays to Sets: Uses a helper function to convert arrays to sets for comparison.

    - Compare Sets: Compares the newly selected values against the cross_product values in the product.classifications data to check for matches.

Helper Function:
- ***toSet(array: Array)***: Converts an array to a Set to facilitate comparison.
Usage Example:

```javascript
const handleSelection = (event, group, itemValue) => {
  toggleSelectedItem(event, group, itemValue);
};
```

Summary
This documentation provides a comprehensive overview of the toggleSelectedItem function, including its purpose, parameters, return type, and detailed implementation. The UML diagrams visualize the class structure and sequence of interactions, helping to understand the function's integration within the system.



--- 


{
    "category_id": 5,
    "classifications": [
        {
            "cross_product": [
                {
                    "cross_product_id": 113,
                    "picture": "/public/images/20240814171531324921_puma_shoes.webp",
                    "price": "111.00",
                    "status": "",
                    "stock": 120,
                    "value": [
                        "red",
                        "l"
                    ],
                    "variant_type_id": [
                        64,
                        65
                    ],
                    "variant_value_id": [
                        140,
                        142
                    ],
                    "weight": "20.00"
                },
                {
                    "cross_product_id": 114,
                    "picture": "/public/images/20240814171531325598_puma_shoes.webp",
                    "price": "111.00",
                    "status": "",
                    "stock": 120,
                    "value": [
                        "red",
                        "m"
                    ],
                    "variant_type_id": [
                        64,
                        65
                    ],
                    "variant_value_id": [
                        140,
                        143
                    ],
                    "weight": "20.00"
                },
                {
                    "cross_product_id": 115,
                    "picture": "/public/images/20240814171531326048_puma_shoes.webp",
                    "price": "111.00",
                    "status": "inactive",
                    "stock": 120,
                    "value": [
                        "green",
                        "l"
                    ],
                    "variant_type_id": [
                        64,
                        65
                    ],
                    "variant_value_id": [
                        141,
                        142
                    ],
                    "weight": "20.00"
                },
                {
                    "cross_product_id": 116,
                    "picture": "/public/images/20240814171531326212_puma_shoes.webp",
                    "price": "111.00",
                    "status": "",
                    "stock": 120,
                    "value": [
                        "green",
                        "m"
                    ],
                    "variant_type_id": [
                        64,
                        65
                    ],
                    "variant_value_id": [
                        141,
                        143
                    ],
                    "weight": "20.00"
                }
            ],
            "variants": {
                "Color": {
                    "values": [
                        "red",
                        "green"
                    ],
                    "variant_type_id": 64,
                    "variant_value_id": [
                        140,
                        141
                    ]
                },
                "Size": {
                    "values": [
                        "l",
                        "m"
                    ],
                    "variant_type_id": 65,
                    "variant_value_id": [
                        142,
                        143
                    ]
                }
            }
        }
    ],
    "currency_id": 2,
    "description": "Photo format must be .jpg, .jpeg, .png and min size. 300 x 300 px (for optimal images, use a min. size of 1,200 x 1,200 px).\n\nSelect a product photo or drag and drop up to 9 photos at once here. Upload min. 5 photos that are interesting and different from each other to attract buyers' attention.",
    "guidance_img": "/public/images/20240809182755076443_Screenshot_2024-07-04_at_8.13.21_in_the_evening.png",
    "minimum_order": 1,
    "name": "Afro phone",
    "photos": [
        {
            "photo_url": "/public/images/20240809182755075048_puma_shoes.webp"
        },
        {
            "photo_url": "/public/images/20240809182755074536_puma_shoes.webp"
        }
    ],
    "product_condition": "new",
    "product_id": "8193c8ec-c058-4927-a9d8-9e709c10e125",
    "shop_id": "",
    "showcase": "Afro store ashewa meda",
    "status": "",
    "stock_quantity": "0",
    "unit_price": "111.00",
    "user_id": "",
    "quantity": 1
}

### payment page

> item objects as income 

{
    "description": "Photo format must be .jpg, .jpeg, .png and min size. 300 x 300 px (for optimal images, use a min. size of 1,200 x 1,200 px).\n\nSelect a product photo or drag and drop up to 9 photos at once here. Upload min. 5 photos that are interesting and different from each other to attract buyers' attention.",
    "minimum_order": 1,
    "productId": "8193c8ec-c058-4927-a9d8-9e709c10e125",
    "productName": "Afro phone",
    "productCondition": "new",
    "productImg": "/public/images/20240814171531324921_puma_shoes.webp",
    "quantity": 1,
    "shopId": "",
    "sellerId": "",
    "productPrice": "111.00",
    "productMaxStock": 120,
    "productVariants": {
        "Color": {
            "values": [
                "red",
                "green"
            ],
            "variant_type_id": 64,
            "variant_value_id": [
                140,
                141
            ]
        },
        "Size": {
            "values": [
                "l",
                "m"
            ],
            "variant_type_id": 65,
            "variant_value_id": [
                142,
                143
            ]
        }
    },
    "productVariantValue": [
        "red",
        "l"
    ],
    "productStatus": "active"
}