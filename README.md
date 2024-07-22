# Accessible eCommerce Webstore

An eCommerce webstore designed specifically for visually impaired users, built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **Screen Reader Compatibility:** Fully compatible with screen readers to provide a seamless shopping experience for visually impaired users.
- **Accessible Design:** High-contrast colors, scalable fonts, and keyboard navigation support.
- **User Authentication:** Secure user registration and login with JWT authentication.
- **Product Management:** Browse, search, and filter products with ease.
- **Shopping Cart:** Add, remove, and manage items in the shopping cart.
- **Checkout Process:** Smooth and accessible checkout process with payment integration.
- **Order History:** View past orders and track order status.
- **Admin Panel:** Manage products, users, and orders from a dedicated admin panel.

## Technologies Used

- **Frontend:** React.js, Redux, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **Styling:** CSS, Bootstrap
- **Accessibility Tools:** ARIA (Accessible Rich Internet Applications), screen reader testing

## Setup and Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/yourusername/accessible-ecommerce-webstore.git
    cd accessible-ecommerce-webstore
    ```

2. **Backend Setup:**

    - Navigate to the `backend` directory:

        ```bash
        cd backend
        ```

    - Install backend dependencies:

        ```bash
        npm install
        ```

    - Create a `.env` file in the `backend` directory and add the following environment variables:

        ```plaintext
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        ```

    - Start the backend server:

        ```bash
        npm start
        ```

3. **Frontend Setup:**

    - Navigate to the `frontend` directory:

        ```bash
        cd ../frontend
        ```

    - Install frontend dependencies:

        ```bash
        npm install
        ```

    - Create a `.env` file in the `frontend` directory and add the following environment variables:

        ```plaintext
        REACT_APP_API_URL=http://localhost:5000
        ```

    - Start the frontend development server:

        ```bash
        npm start
        ```

4. **Access the Application:**

    - Open your browser and navigate to `http://localhost:3000` to access the frontend.
    - The backend server runs on `http://localhost:5000`.

## Project Structure

- `backend/`: Contains the backend code (Express.js, MongoDB).
    - `models/`: Mongoose models.
    - `routes/`: Express routes.
    - `controllers/`: Request handlers.
    - `middleware/`: Custom middleware (authentication, error handling).
    - `config/`: Configuration files (database connection).
- `frontend/`: Contains the frontend code (React.js, Redux).
    - `src/`: React components, Redux actions and reducers, styles, utilities.
    - `public/`: Public assets (HTML, images).

## Accessibility Features

- **Screen Reader Support:** All interactive elements are accessible via screen readers.
- **Keyboard Navigation:** Users can navigate the entire site using the keyboard.
- **High-Contrast Mode:** Option to switch to a high-contrast color scheme.
- **Scalable Fonts:** Text sizes are adjustable to accommodate different vision needs.
- **ARIA Labels:** Use of ARIA attributes to enhance the semantic meaning of elements for screen readers.

## Contributing

We welcome contributions to improve this project! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Push to your branch.
5. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Thanks to the community for providing accessibility tools and resources.
- Inspired by various accessible web design guidelines and best practices.

## Contact

For questions or suggestions, please contact cutewizzy11(mailto:).
