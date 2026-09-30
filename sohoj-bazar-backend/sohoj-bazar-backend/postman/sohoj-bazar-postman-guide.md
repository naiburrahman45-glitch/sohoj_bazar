# সহজ বাজার — Postman Test Guide

## Base URL
http://localhost:5000/api

## 1. Health
GET `/health`

## 2. Customer Register
POST `/auth/register`

Body → raw → JSON:
```json
{
  "name": "রহিম",
  "email": "rahim@example.com",
  "password": "12345678",
  "phone": "01700000000"
}
```

## 3. Customer Login
POST `/auth/login`

```json
{
  "email": "rahim@example.com",
  "password": "12345678"
}
```

Response-এর `token` copy করুন।

## 4. Admin Login
প্রথমে `npm run seed:admin` চালান।

POST `/auth/login`

```json
{
  "email": "admin@sohojbazar.local",
  "password": "ChangeMe123!"
}
```

যদি `.env`-এ password পরিবর্তন করেন, সেই password ব্যবহার করবেন।

## Authorization
Authorization tab:
- Type: Bearer Token
- Token: login response-এর token

## 5. Admin Add Product
POST `/products`

```json
{
  "name": "আলু",
  "category": "আলু-পেঁয়াজ",
  "description": "তাজা দেশি আলু",
  "image": "",
  "basePrice": 60,
  "unit": "কেজি",
  "stock": 100,
  "cuttingOptions": [
    {"name": "পুরো", "extraCharge": 0},
    {"name": "খোসা ছাড়ানো", "extraCharge": 5},
    {"name": "কিউব", "extraCharge": 8},
    {"name": "স্লাইস", "extraCharge": 8}
  ]
}
```

## 6. Product List
GET `/products`

## 7. Customer Create Order
POST `/orders`

```json
{
  "items": [
    {
      "productId": "এখানে_PRODUCT_ID",
      "quantity": 0.5,
      "cuttingStyle": "কিউব",
      "customInstruction": "মাঝারি সাইজের কিউব করে দিন"
    }
  ],
  "deliveryAddress": {
    "recipientName": "রহিম",
    "phone": "01700000000",
    "addressLine": "বাসা ১০, মেইন রোড",
    "area": "সাতমাথা",
    "city": "বগুড়া"
  },
  "paymentMethod": "cod",
  "customerNote": "আজকের মধ্যেই ডেলিভারি চাই"
}
```

## 8. Customer Orders
GET `/orders/my`

## 9. Admin Orders
GET `/admin/orders`

## 10. Admin Status Update
PATCH `/admin/orders/ORDER_ID/status`

```json
{
  "orderStatus": "কাটা হচ্ছে"
}
```

## 11. Dashboard
GET `/admin/dashboard`
