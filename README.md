# Ecommerce-API-portfolio
lay Welcome to this e-commerce API documentation. This API can serve as the backend for your E-commerce platform, Allowing you to register, signIn, create dispand manage your products for Intending customers.
Whether you're a developer integrating our API into your application or a curious user wanting to understand the technical aspects, this readme will guide you through the process.

___

### Introduction
This API will provide the tools for an E-commerce platform to manage, create and interact with intending buyers, intending sellers and their various products in an efficient manner.
Allowing sellers to create and manage their different produtcs, and buyers to view and purchase these products seamlessly. This API aims to simplify the E-commerce experience for its various users.

___

### Key Features
* **Virtual Accounts/Wallets** - Every Authenticated user would have a unique wallet in which they can fund and use to make payments for purchases made. if a user purchases an item the price of the item will be deducted from his wallet balance automatically. Sellers can also receive payments via their wallet for any products sold, once a buyer purchases a product the price of that product would be deducted from the buyers wallet and credited to the sellers wallet. Sellers can easily withdraw their earnings from the wallets directly to their bank account.
* **Payments** - There would be a payment system that allows users to fund their virtual accounts/ wallets, The funded amount will be displayed in the users wallet after the payment has been confirmed. They can purchase any product of their choice and pay with the funded wallets ( As long as the amount in their wallet is enough to cover the price of the item they wish to purchase).
* **Receipts Generator** - After every purchase a downloadable receipt would be generated containing all the details of the purchased item.
* **Image Uploads** -Sellers can upload images if their products.
* **JWT AUthentication** - Registered users will be authenticated using **jwt** before they can be granted access to their accounts.
* **Email Sending** - Emails will be sent out at different stages wehn using this API using the mailgun API.
     * email confirmation - after registration a confirmation email with a unique link will be sent to the email provided during registration. The user is required to click the unique link to confirm their email.
     * **Welcome message** - A welcome message will be sent out to users after they successfully confrim their email.
     * **Payments** - An email will be sent upon successfull funding of wallets
     * **Successfully Purchased** - An email containng the details of the transactions and recipts will be sent to a buyer after every purchase.
     * **Successfull sale** - An email will be sent to a seller upon making a succesfull sale.

___

### Getting Started


