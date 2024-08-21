import { getAuth } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

const auth = getAuth();

// Event listener for verifying OTP
document.getElementById('verifyOtp').addEventListener('click', async () => {
    const otpCode = document.getElementById('otpCode').value;

    try {
        const confirmationResult = window.confirmationResult;
        const result = await confirmationResult.confirm(otpCode);
        const user = result.user;
        console.log('User signed in successfully:', user);
        alert('OTP verified successfully!');

        // Retrieve form data from session storage
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

        // Update user data on backend after OTP verification
        const response = await fetch('http://localhost:3000/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idToken: await user.getIdToken(),
                userInfo: userInfo
            })
        });

        const data = await response.json();
        console.log('Backend response:', data);

        if (data.error) {
            alert('Error updating user data: ' + data.error);
        } else {
            alert('User data successfully updated!');
            // Clear session storage after update
            sessionStorage.removeItem('userInfo');
            window.location.href = "success.html"; // Redirect to success page
        }
    } catch (error) {
        console.error("Error during OTP verification:", error);
        alert('Error verifying OTP: ' + error.message);
    }
});
