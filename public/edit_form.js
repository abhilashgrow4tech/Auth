import { getAuth } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

const auth = getAuth();

document.getElementById('userForm').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the default form submission behavior

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const gender = document.getElementById('gender').value;
    const dob = document.getElementById('dob').value;

    const user = auth.currentUser;
    if (user) {
        try {
            const userName = fullName.split(' ');
            const firstName = userName[0];
            const lastName = userName[1] || '';

            // Save form data to session storage before verifying OTP again
            sessionStorage.setItem('userInfo', JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                gender: gender,
                dob: dob,
            }));

            console.log('Form data saved. Redirecting to OTP verification...');

            // Redirect to the final OTP verification page
            window.location.href = "verification.html"; 
        } catch (error) {
            console.error('Error during form submission:', error);
            alert('Error during form submission: ' + error.message);
        }
    } else {
        alert('User is not authenticated. Please log in again.');
    }
});
