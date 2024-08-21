const { auth } = require('../config/firebase');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const shopifyAdminAPI = `https://${process.env.SHOPIFY_API_KEY}:${process.env.SHOPIFY_PASSWORD}@${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2024-01/customers.json`;

// Verify OTP and register/login
exports.verifyOTP = async (req, res) => {
    const { idToken, userInfo } = req.body;

    try {
        // Verify the ID token
        const decodedToken = await auth.verifyIdToken(idToken);

        // Prepare data to send to Shopify
        const customerData = {
            customer: {
                first_name: userInfo.firstName,
                last_name: userInfo.lastName,
                email: userInfo.email,
                phone: decodedToken.phone_number,
                verified_email: true,
                addresses: [userInfo.address],
            },
        };

        // Send data to Shopify
        const shopifyResponse = await axios.post(shopifyAdminAPI, customerData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Respond to the client
        res.json({
            message: 'User successfully registered/login',
            shopifyData: shopifyResponse.data,
        });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(400).json({ error: error.message });
    }
};

// Update user data after the second OTP verification
exports.updateUserData = async (req, res) => {
    const { idToken, userInfo } = req.body;

    try {
        // Verify the ID token again
        const decodedToken = await auth.verifyIdToken(idToken);

        // Prepare updated customer data
        const customerData = {
            customer: {
                first_name: userInfo.firstName,
                last_name: userInfo.lastName,
                email: userInfo.email,
                phone: decodedToken.phone_number,
                verified_email: true,
                addresses: [userInfo.address],
            },
        };

        // Send the updated data to Shopify
        const shopifyResponse = await axios.put(shopifyAdminAPI, customerData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Respond to the client
        res.json({
            message: 'User data successfully updated',
            shopifyData: shopifyResponse.data,
        });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.verifyOTPAndUpdateUser = async (req, res) => {
    const { idToken, userInfo } = req.body;
  
    try {
        // Verify the ID token with Firebase
        const decodedToken = await auth.verifyIdToken(idToken);
  
        // Prepare the user data to be updated in Shopify
        const customerData = {
            customer: {
                first_name: userInfo.firstName,
                last_name: userInfo.lastName,
                email: userInfo.email,
                phone: decodedToken.phone_number,
                verified_email: true,
                addresses: [
                    {
                        address1: userInfo.address1 || '', // Assuming `address1` is provided in userInfo
                        city: userInfo.city || '',
                        province: userInfo.province || '',
                        country: userInfo.country || '',
                        zip: userInfo.zip || '',
                    }
                ],
                gender: userInfo.gender || '',
                note: `DOB: ${userInfo.dob}`, // Store DOB in Shopify customer note
            }
        };
  
        // Send the updated user data to Shopify
        const shopifyResponse = await axios.put(`${shopifyAdminAPI}/${decodedToken.uid}.json`, customerData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
  
        // Respond to the client
        res.json({
            message: 'User data successfully updated and OTP verified.',
            shopifyData: shopifyResponse.data,
        });
    } catch (error) {
        console.error('Error updating user data and verifying OTP:', error.response ? error.response.data : error.message);
        res.status(400).json({ error: error.message });
    }
  };
  


