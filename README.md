For now, this application is deployed on Render with the free plan so it may take a while to open. Please be patient and it will open.

- Application URL: https://urbanutopia-v629.onrender.com/.
- An example user for testing (so you don’t have to sign up).

  - Email: test@gmail.com.
  - Password: test1234 (Please don’t change the email and password)

# Introduction

This full-stack production-ready CRUD web application is developed to create an online platform catering to real estate landlords. It enables them to effectively create, update, and delete listings that showcase and market their properties for sale or rent. Simultaneously, it empowers potential property buyers and tenants to read listings on this platform to explore available homes, connecting them directly with landlords to kickstart property transactions or leasing processes. Its compatibility spans both desktop and portable device browsers, ensuring seamless user access.

# Usage

This application is built on **Node.js**. It employs **React** to enhance client-side interactivity, integrates **Tailwind CSS** for crafting stylish web pages and components, and utilizes **Express.js** to power the backend API.

## Client-side

The client-side is developed using **React** with **react-router-dom**.

### User Sign-up

Users can sign up using their Google account and **Firebase** Authentication easily handles this. A user record will be created including a unique auto-generated ID for the user, as well as the user's email address. Users can also create accounts with their preferred email address and username.

### User Sign-in

Users can sign in using their Google account or the email address they have signed up with their created account.

### Read Listings

To read listings, aka realty advertisements other users have uploaded on this platform for sale or rent, a user can either navigate to the home page or use the search functionality.

- There are three ways to navigate to the home page: the URL (https://urbanutopia-v629.onrender.com/), the “Home” tag on the header, or being automatically directed to the home page after signing in. The home page only demonstrates a limited number of listings that were posted with an offer, for rent, or sale. To find the desired listings, a user can use the search functionality.

- To use the search functionality, a user can either type the keywords in the search bar on the header (the search results will include all existing listings if the search icon is clicked without any keywords) or click the “Show more ……” tags such as “Show more places for rent” on the home page.

### Search Functionality

The search result page involves more sorting and selection features as shown by the image below so users can seamlessly customize their search results.

![](./images/search%20page.png)

### Individual listing

Each listing demonstrates more detailed information about the realty with pictures. Users can slide pictures. All listing pictures are handled by **Firebase** and stored there. A user who has signed in can also contact the landlord by sending a message. This functionality will automatically open the mail application on the user’s device.

### Update User Profile

The user’s avatar icon on the header will direct users to the user profile page where they can update their username, email address, password, and profile image, and even delete the account. All users’ profile images are handled by **Firebase** and stored there.

### Create, Update, and Delete Listings

Users who are landlords can create, update, and delete listings through the user profile page too. Creating and updating listing pages have a similar interface (as shown by the image below) which allows users to customize their listing seamlessly.

![](./images/create%20listing%20page.png)

### User Authentication/Authorization

This application uses the **Redux Toolkit** to manage the authorization of users after they are authenticated either by **Firebase** Authentication or in terms of the user records on the cloud server (**MongoDB**). The authentication/authorization state is stored on the user’s local storage with the aid of **redux-persist** before the cookie expires.

## Backend API

This application executes a RESTful API using **Express.js**. Requests/responses are in JSON format. The API with the aid of **JSON Web Token** and **cookie-parser** handles requests for user authentication. The user’s password is encrypted utilizing **bcryptjs**. The Backend API is tested with **Postman** and **Insomnia**.

## Cloud Server

A **MongoDB** collection, with the aid of **mongoose**, is utilized to host records of users and listings on the cloud and respond to CRUD requests.
