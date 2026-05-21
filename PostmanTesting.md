
---

# Hono.js API Documentation

This is the complete guide for testing all API routes of the Hono.js application using Postman. It covers campaign management and payment management endpoints.

---

## 🚀 Base URL

```plaintext
http://localhost:3000
```

---

## 📚 Endpoints

### **1. Root Endpoint**

#### **GET `/`**
- **Description**: A simple greeting message.
- **Request**:
  ```plaintext
  GET http://localhost:3000/
  ```
- **Response**:
  ```json
  {
    "message": "Hello! Enter the Valid Api Endpoint"
  }
  ```

---

### **2. Campaign Management**

#### **POST `/create-campaign`**
- **Description**: Create a new campaign.
- **Request**:
  - **Method**: `POST`
  - **URL**: `http://localhost:3000/create-campaign`
  - **Headers**:
    ```
    Content-Type: application/json
    ```
  - **Body** (JSON):
    ```json
    {
      "campaignname": "Save the Forests",
      "description": "Protect the endangered forests",
      "targetamount": 10000,
      "days": 30,
      "imgurl":"https://fadcdn.s3.ap-south-1.amazonaws.com/media/1345/Lead_image_71004.jpg"
    }
    ```
- **Responses**:
  - **201**:
    ```json
    {
      "message": "Campaign created successfully",
      "status": 201
    }
    ```
  - **400**:
    ```json
    {
      "error": "All fields are required",
      "status": 400
    }
    ```

---

#### **GET `/campaign/:id`**
- **Description**: Fetch campaign details by ID.
- **Request**:
  ```plaintext
  GET http://localhost:3000/campaign/1
  ```
- **Response**:
  ```json
  {
    "campaignInfo": {
      "campaignDetails": [...],
      "totalfunders": 10,
      "raisedfund": 5000
    }
  }
  ```

---

#### **GET `/showcampaigns`**
- **Description**: Fetch all campaigns with aggregated stats.
- **Request**:
  ```plaintext
  GET http://localhost:3000/showcampaigns
  ```
- **Response**:
  ```json
  [
    {
      "campaignId": 1,
      "campaignName": "Save the Forests",
      "totalFunderCount": 5,
      "totalRaisedAmount": 3000,
      "imgurl":"https://fadcdn.s3.ap-south-1.amazonaws.com/media/1345/Lead_image_71004.jpg",
    },
    ...
  ]
  ```

---

#### **PUT `/update-campaign/:id`**
- **Description**: Update an existing campaign.
- **Request**:
  - **Method**: `PUT`
  - **URL**: `http://localhost:3000/update-campaign/1`
  - **Headers**:
    ```
    Content-Type: application/json
    ```
  - **Body** (JSON):
    ```json
    {
      "campaignname": "Save the Rainforests",
      "description": "Updated campaign description",
      "targetamount": 20000,
      "days": 60
    }
    ```
- **Responses**:
  - **200**:
    ```json
    {
      "message": "Campaign updated successfully",
      "status": 200
    }
    ```
  - **404**:
    ```json
    {
      "error": "Campaign not found",
      "status": 404
    }
    ```

---

#### **DELETE `/delete-campaign/:id`**
- **Description**: Delete a campaign by ID.
- **Request**:
  ```plaintext
  DELETE http://localhost:3000/delete-campaign/1
  ```
- **Responses**:
  - **200**:
    ```json
    {
      "message": "Campaign deleted successfully",
      "status": 200
    }
    ```
  - **404**:
    ```json
    {
      "error": "Unable to delete. Campaign does not exist.",
      "status": 404
    }
    ```

---

### **3. Payment Management**

# Create Payment API Documentation

## Endpoint

**POST** `/create-payment`

---

## Description
This endpoint is used to create a payment entry in the system by providing the required user and payment details. The data is validated before being inserted into the database.

---

## Request Headers

| Header           | Type    | Description                                |
|------------------|---------|--------------------------------------------|
| Authorization    | Bearer  | Bearer token for authentication. Required.|
| Content-Type     | String  | Must be `application/json`.               |

---

## Request Body

The request body must be sent in JSON format with the following fields:

| Field       | Type    | Required | Description                           |
|-------------|---------|----------|---------------------------------------|
| email       | String  | Yes      | The email of the user.               |
| mobileno    | String  | Yes      | The mobile number of the user.       |
| nationality | String  | Yes      | The nationality of the user.         |
| country     | String  | Yes      | The country of the user.             |
| state       | String  | Yes      | The state of the user.               |
| pincode     | String  | Yes      | The pincode of the user.             |
| city        | String  | Yes      | The city of the user.                |
| panno       | String  | No       | The PAN number of the user.          |
| address     | String  | Yes      | The address of the user.             |
| amount      | Number  | Yes      | The payment amount.                  |
| username    | String  | Yes      | The username of the user.            |
| campaignsid | Number  | No       | The ID of the associated campaign.   |

---

## Example Request Body

```json
{
  "email": "john.doe@example.com",
  "mobileno": "1234567890",
  "nationality": "Indian",
  "country": "India",
  "state": "Karnataka",
  "pincode": "560001",
  "city": "Bangalore",
  "panno": "ABCDE1234F",
  "address": "123 Main Street",
  "amount": 5000,
  "username": "johndoe",
  "campaignsid": 1
}
```

---

## Response

### Success Response

**Status Code:** `201 Created`

**Response Body:**

```json
{
  "message": "Payment created successfully",
  "status": 201
}
```

### Error Responses

**Invalid JSON Body:**

**Status Code:** `400 Bad Request`

**Response Body:**

```json
{
  "error": "Invalid JSON body",
  "status": 400
}
```

**Missing Required Fields:**

**Status Code:** `400 Bad Request`

**Response Body:**

```json
{
  "error": "email is required",
  "status": 400
}
```

**Invalid Campaign ID:**

**Status Code:** `400 Bad Request`

**Response Body:**

```json
{
  "error": "Invalid 'campaignsid'. Campaign does not exist.",
  "status": 400
}
```

**Internal Server Error:**

**Status Code:** `500 Internal Server Error`

**Response Body:**

```json
{
  "error": "Failed to create payment",
  "status": 500
}
```

---


#### **GET `/show`**
- **Description**: Fetch all payments.
- **Request**:
  ```plaintext
  GET http://localhost:3000/show
  ```
- **Response**:
  ```json
  [
    {
      "id": 1,
      "userid": 1,
      "amount": 1000,
      "username": "John Doe",
      "campaignsid": 1
    },
    ...
  ]
  ```

---

## 🛠️ Import to Postman

1. Open Postman.
2. Go to **File > Import**.
3. Use the following JSON to import this collection:

```json
{
  "info": {
    "name": "Hono.js API",
    "description": "Postman collection for testing Hono.js API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "/",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/"
      }
    },
    ...
  ]
}
```

4. Replace `{{baseUrl}}` with `http://localhost:3000`.
5. Start testing! 🎉

--- 

This README includes all endpoints, descriptions, example requests, and responses for seamless API testing.
