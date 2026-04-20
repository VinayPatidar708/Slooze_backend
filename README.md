# Food Ordering Backend

Role-based food ordering API built with NestJS, GraphQL, and Prisma. Users are scoped to a country (India or America) and can only interact with restaurants and orders within their assigned country.

---

## Tech Stack

| Layer    | Tool                              |
| -------- | --------------------------------- |
| Framework | NestJS (TypeScript)              |
| API      | GraphQL (Apollo, code-first)      |
| ORM      | Prisma 7                          |
| Database | PostgreSQL                        |
| Auth     | JWT + Passport                    |
| Access   | RBAC (roles) + Re-BAC (country)   |

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema (Country, User, Restaurant, MenuItem, Order, PaymentMethod)
│   └── seed.ts                # Mock data — 2 countries, 6 users, 4 restaurants, 20 menu items
├── src/
│   ├── main.ts                # App entry point
│   ├── app.module.ts          # Root module
│   ├── auth/
│   │   ├── auth.input.ts      # RegisterInput, LoginInput
│   │   ├── auth.module.ts
│   │   ├── auth.resolver.ts   # register, login mutations
│   │   ├── auth.service.ts    # bcrypt + JWT signing
│   │   ├── auth.types.ts      # AuthPayload GraphQL type
│   │   ├── country.guard.ts   # Re-BAC: blocks cross-country access
│   │   ├── current-user.decorator.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── jwt.strategy.ts    # Validates token, loads user
│   │   ├── roles.decorator.ts # @Roles(...) decorator
│   │   ├── roles.enum.ts      # ADMIN | MANAGER | MEMBER
│   │   └── roles.guard.ts     # Enforces @Roles() on resolvers
│   ├── menu-items/
│   │   ├── menu-item.model.ts
│   │   ├── menu-items.module.ts
│   │   ├── menu-items.resolver.ts
│   │   └── menu-items.service.ts
│   ├── orders/
│   │   ├── order.input.ts     # AddItemInput
│   │   ├── order.model.ts     # OrderModel, OrderItemModel
│   │   ├── orders.module.ts
│   │   ├── orders.resolver.ts
│   │   └── orders.service.ts
│   ├── payment-methods/
│   │   ├── payment-method.input.ts
│   │   ├── payment-method.model.ts
│   │   ├── payment-methods.module.ts
│   │   ├── payment-methods.resolver.ts
│   │   └── payment-methods.service.ts
│   ├── prisma/
│   │   ├── prisma.module.ts   # Global module
│   │   └── prisma.service.ts  # PrismaClient singleton
│   ├── restaurants/
│   │   ├── restaurant.model.ts
│   │   ├── restaurants.module.ts
│   │   ├── restaurants.resolver.ts
│   │   └── restaurants.service.ts
│   └── users/
│       ├── user.model.ts
│       ├── users.module.ts
│       ├── users.resolver.ts
│       └── users.service.ts
├── .env                       # Environment variables
├── prisma.config.ts           # Prisma 7 datasource config
└── tsconfig.json
```

---

## Role-Based Access

| Operation                  | Admin | Manager | Member |
| -------------------------- | :---: | :-----: | :----: |
| View restaurants & menus   |  ✅   |   ✅    |   ✅   |
| Create an order            |  ✅   |   ✅    |   ✅   |
| Add items to order         |  ✅   |   ✅    |   ✅   |
| Checkout & pay             |  ✅   |   ✅    |   ❌   |
| Cancel an order            |  ✅   |   ✅    |   ❌   |
| Add / modify payment methods |  ✅  |   ❌    |   ❌   |

**Re-BAC (country restriction):** Every user is assigned to either `India` or `America`. All queries and mutations are automatically scoped — an Admin in India cannot see restaurants, place orders, or manage payments in America, and vice versa.

---

## Setup

### 1. Prerequisites

- Node.js 18+
- PostgreSQL running locally

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Edit `.env` with your database credentials:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/food_ordering"
JWT_SECRET="your_secret_key"
PORT=3000
```

### 4. Generate Prisma client

```bash
npm run prisma:generate
```

### 5. Run database migrations

```bash
npm run prisma:migrate
```

When prompted, give the migration a name (e.g., `init`).

### 6. Seed mock data

```bash
npm run seed
```

This creates:
- 2 countries: India, America
- 6 users (Admin + Manager + Member per country)
- 4 restaurants (2 per country)
- 20 menu items (5 per restaurant)

---

## Running the Server

```bash
# Development (with ts-node, auto-reloads on change)
npm run start:dev

# Production build then run
npm run build
npm run start
```

Server starts at: `http://localhost:3000/graphql`

---

## Available Scripts

| Command                  | Description                                  |
| ------------------------ | -------------------------------------------- |
| `npm run start:dev`      | Start dev server with ts-node                |
| `npm run build`          | Compile TypeScript to `dist/`                |
| `npm run start`          | Run compiled production build                |
| `npm run prisma:generate`| Regenerate Prisma client after schema change |
| `npm run prisma:migrate` | Run pending database migrations              |
| `npm run prisma:studio`  | Open Prisma Studio (visual DB browser)       |
| `npm run seed`           | Seed database with mock data                 |

---

## Test Accounts

All accounts use password: `password123`

| Country | Role    | Email                      |
| ------- | ------- | -------------------------- |
| India   | Admin   | `admin.india@food.com`     |
| India   | Manager | `manager.india@food.com`   |
| India   | Member  | `member.india@food.com`    |
| America | Admin   | `admin.us@food.com`        |
| America | Manager | `manager.us@food.com`      |
| America | Member  | `member.us@food.com`       |

---

## GraphQL API

Open `http://localhost:3000/graphql` in your browser for the Apollo Playground.

### Authentication

**Register a new user:**
```graphql
mutation {
  register(input: {
    name: "John Doe"
    email: "john@example.com"
    password: "password123"
    role: "MEMBER"
    countryId: 1
  }) {
    token
    userId
    role
    countryId
  }
}
```

**Login:**
```graphql
mutation {
  login(input: {
    email: "admin.india@food.com"
    password: "password123"
  }) {
    token
    userId
    role
  }
}
```

Add the token to all subsequent requests as a header:
```
Authorization: Bearer <token>
```

---

### Restaurants & Menu

**List restaurants in your country:**
```graphql
query {
  restaurants {
    id
    name
    address
    countryId
  }
}
```

**Get a single restaurant:**
```graphql
query {
  restaurant(id: 1) {
    id
    name
    address
  }
}
```

**List menu items for a restaurant:**
```graphql
query {
  menuItems(restaurantId: 1) {
    id
    name
    description
    price
    category
  }
}
```

---

### Orders

**Create an order:**
```graphql
mutation {
  createOrder(restaurantId: 1) {
    id
    status
    totalAmount
  }
}
```

**Add an item to your order:**
```graphql
mutation {
  addItemToOrder(
    orderId: 1
    input: { menuItemId: 2, quantity: 2 }
  ) {
    id
    status
    totalAmount
    items {
      menuItemName
      quantity
      unitPrice
    }
  }
}
```

**Checkout (Admin / Manager only):**
```graphql
mutation {
  checkoutOrder(orderId: 1, paymentMethodId: 1) {
    id
    status
    totalAmount
  }
}
```

**Cancel an order (Admin / Manager only):**
```graphql
mutation {
  cancelOrder(orderId: 1) {
    id
    status
  }
}
```

**View your orders:**
```graphql
query {
  myOrders {
    id
    status
    totalAmount
    createdAt
    items {
      menuItemName
      quantity
      unitPrice
    }
  }
}
```

---

### Payment Methods (Admin only)

**Add a payment method:**
```graphql
mutation {
  addPaymentMethod(input: {
    type: "CREDIT_CARD"
    last4: "4242"
    provider: "Visa"
  }) {
    id
    type
    last4
    provider
  }
}
```

**Update a payment method:**
```graphql
mutation {
  updatePaymentMethod(id: 1, input: { provider: "Mastercard" }) {
    id
    provider
  }
}
```

**Remove a payment method:**
```graphql
mutation {
  removePaymentMethod(id: 1)
}
```

**List your payment methods:**
```graphql
query {
  myPaymentMethods {
    id
    type
    last4
    provider
  }
}
```

---

## Database Schema

```
Country
  ├── id, name, code
  ├── → users[]
  └── → restaurants[]

User
  ├── id, name, email, password, role, countryId
  ├── → orders[]
  └── → paymentMethods[]

Restaurant
  ├── id, name, address, countryId
  └── → menuItems[]

MenuItem
  ├── id, name, description, price, category, restaurantId
  └── → orderItems[]

Order
  ├── id, status, totalAmount, userId, restaurantId, paymentMethodId
  └── → items[] (OrderItem)

OrderItem
  └── id, quantity, unitPrice, orderId, menuItemId

PaymentMethod
  └── id, type, last4, provider, userId

Order Status Flow: PENDING → CONFIRMED → DELIVERED | CANCELLED
```
