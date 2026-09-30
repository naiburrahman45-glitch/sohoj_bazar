# সহজ বাজার — Backend

এটি বগুড়া শহরের জন্য তৈরি **সহজ বাজার** fresh-cut vegetable delivery platform-এর backend।

## প্রযুক্তি

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs password hashing
- REST API
- Customer/Admin role
- Cash on Delivery
- bKash/Nagad payment method support (transaction ID সংরক্ষণসহ)
- Same-day delivery
- Custom vegetable cutting instruction
- Admin dashboard/order management

## ১. প্রয়োজন

- Node.js 18+ (Node 20/22/24 ব্যবহার করা যাবে)
- MongoDB Community Server অথবা MongoDB Atlas
- Postman

## ২. Install

```bash
cd sohoj-bazar-backend
npm install
```

## ৩. Environment

`.env.example` কপি করে `.env` বানান।

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

তারপর `.env`-এ `JWT_SECRET` অবশ্যই পরিবর্তন করুন।

Local MongoDB হলে:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/sohoj_bazar
```

## ৪. Admin তৈরি

```bash
npm run seed:admin
```

Admin login:
- Email: `.env`-এর ADMIN_EMAIL
- Password: `.env`-এর ADMIN_PASSWORD

## ৫. Server চালু

Development:
```bash
npm run dev
```

Production-style:
```bash
npm start
```

Server:
`http://localhost:5000`

Health:
`GET http://localhost:5000/api/health`

## Authentication

Register:
`POST /api/auth/register`

```json
{
  "name": "রহিম",
  "email": "rahim@example.com",
  "password": "12345678",
  "phone": "01700000000"
}
```

Login:
`POST /api/auth/login`

```json
{
  "email": "rahim@example.com",
  "password": "12345678"
}
```

Login response থেকে `token` নিয়ে protected API-তে:

`Authorization: Bearer YOUR_TOKEN`

## Product API

Public:
- `GET /api/products`
- `GET /api/products/:id`

Admin:
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

Product example:
```json
{
  "name": "আলু",
  "category": "আলু-পেঁয়াজ",
  "description": "তাজা আলু",
  "image": "",
  "basePrice": 60,
  "unit": "কেজি",
  "stock": 50,
  "cuttingOptions": [
    { "name": "পুরো", "extraCharge": 0 },
    { "name": "খোসা ছাড়ানো", "extraCharge": 5 },
    { "name": "কিউব", "extraCharge": 8 },
    { "name": "স্লাইস", "extraCharge": 8 }
  ]
}
```

## Order API

Customer:
- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/cancel`

Order example:
```json
{
  "items": [
    {
      "productId": "PRODUCT_ID",
      "quantity": 0.5,
      "cuttingStyle": "কিউব",
      "customInstruction": "মাঝারি সাইজের কিউব করে দিন"
    }
  ],
  "deliveryAddress": {
    "recipientName": "রহিম",
    "phone": "01700000000",
    "addressLine": "মেইন রোড, বাসা ১০",
    "area": "সাতমাথা",
    "city": "বগুড়া"
  },
  "paymentMethod": "cod",
  "customerNote": "আজকের মধ্যেই দিতে হবে"
}
```

### Payment method

- `cod` = ক্যাশ অন ডেলিভারি
- `bkash` = বিকাশ
- `nagad` = নগদ

> bKash/Nagad-এর actual payment gateway/API এখানে intentionally mock/recording layer হিসেবে রাখা হয়েছে। Real merchant credentials ও gateway approval পাওয়ার পরে payment controller/gateway integration যোগ করতে হবে।

## Admin API

সবগুলোতে Admin JWT লাগবে।

- `GET /api/admin/dashboard`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`
- `GET /api/admin/customers`

Order status:
- নতুন
- নিশ্চিত
- প্রস্তুত হচ্ছে
- কাটা হচ্ছে
- প্যাক করা হয়েছে
- ডেলিভারির পথে
- ডেলিভারড
- বাতিল

## ডেলিভারি

বর্তমান business rule:
- বগুড়া শহর
- Same-day delivery
- subtotal ৫০০ টাকা বা বেশি হলে delivery charge ০
- এর কম হলে delivery charge ৫০ টাকা

এগুলো পরে admin settings collection-এ নেওয়া যাবে।

## Postman টেস্ট করার ক্রম

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. Login token copy
4. Admin seed করে admin login করুন
5. Admin token দিয়ে `POST /api/products`
6. Customer token দিয়ে `GET /api/products`
7. Product ID দিয়ে order তৈরি করুন
8. Admin token দিয়ে order list দেখুন
9. Admin order status update করুন
10. Customer `GET /api/orders/my` দিয়ে status দেখুন

## নিরাপত্তা

- Password hash করা হয়
- JWT authentication
- Role authorization
- Helmet
- CORS
- API rate limiting
- `.env` gitignore করা হয়েছে

## গুরুত্বপূর্ণ

এই backend frontend ছাড়া স্বাধীনভাবে Postman দিয়ে test করা যাবে। Frontend তৈরি করার সময় শুধু API base URL হিসেবে:

`http://localhost:5000/api`

ব্যবহার করবেন।
