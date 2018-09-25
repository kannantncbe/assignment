# assignment - REST API demo with MongoDB, Node.js, Express and Mongoose.

MongoDB Collections name: demo_user, demo_product, demo_transaction

FEATURES:
MongoDB data insert/update/retrive using Promise.

Collections:

demo_user: _id, name, phone, address
demo_product: _id, name, unit_price, description
demo_transaction: _id, date, product_id(ref to Product), user_id(ref to User), quantity, total_price

Assumption - In each transaction user is buying only 1 product with multiple quantity.

API Method 1:
Add User, Product and Transaction detail in respective collection.
If User/Product data exist then just update else insert it.

Sample Request:

{
"name": "XYZ",
"phone": "123456789890",
"address": "asdfhijk",
"transaction": {
 "product": {
  "name": "iPad",
  "unit_price": "75000",
  "description": "Apple iPad",
  "quantity": "2"
 }
}
}

API Method 2:
Get list of users with total transaction count and each user should have latest transaction detail as embedded object.
Fetch results using aggregation pipelines.

Sample Response:

[
    {
        "username": "XYZ",
        "userphone": "123456789890",
        "useraddress": "asdfhijk",
        "total_transaction": 2,
        "latest_transaction_detail": [
            {
                "_id": "5baa10e719670825485ab6dd",
                "product_id": "5baa10d319670825485ab6dc",
                "user_id": "5baa10d219670825485ab6db",
                "quantity": 1,
                "total_price": 49000.5,
                "updated_date": "2018-09-25T10:41:43.390Z",
                "__v": 0
            },
            {
                "_id": "5baa139112c8a10015175776",
                "product_id": "5baa139112c8a10015175775",
                "user_id": "5baa10d219670825485ab6db",
                "quantity": 2,
                "total_price": 30001.1,
                "updated_date": "2018-09-25T10:53:05.213Z",
                "__v": 0
            }
        ]
    },
    {
        "username": "ABCD",
        "userphone": "1234509876",
        "useraddress": "ascbffgh",
        "total_transaction": 1,
        "latest_transaction_detail": [
            {
                "_id": "5baa140012c8a10015175779",
                "product_id": "5baa140012c8a10015175778",
                "user_id": "5baa140012c8a10015175777",
                "quantity": 2,
                "total_price": 150000,
                "updated_date": "2018-09-25T10:54:56.669Z",
                "__v": 0
            }
        ]
    }
]
