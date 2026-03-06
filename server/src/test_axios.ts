import axios from 'axios';

async function testPost() {
    try {
        console.log("Sending POST to /api/auth/register");
        const res = await axios.post('http://localhost:3001/api/auth/register', {
            email: 'test_axios@gmail.com',
            password: 'password123'
        });
        console.log("Success:", res.data);
    } catch (e: any) {
        if (e.response) {
            console.error("Server responded with error:", e.response.status, e.response.data);
        } else {
            console.error("Network error:", e.message);
        }
    }
}

testPost();
