const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:5000/api/v1';
let token = '';

const test = async () => {
    try {
        console.log('--- Starting API Verification ---');

        // 1. Register
        console.log('\n[1] Registering user...');
        const regRes = await axios.post(`${BASE_URL}/auth/register`, {
            name: 'Test Agent',
            email: `test_${Date.now()}@example.com`,
            password: 'password123'
        });
        console.log('✅ Registration successful');
        token = regRes.data.token;

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Attendance Check-in
        console.log('\n[2] Testing Attendance Check-in...');
        const checkInRes = await axios.post(`${BASE_URL}/attendance/checkin`, {}, config);
        console.log('✅ Check-in successful:', checkInRes.data.message);

        // 3. Attendance Check-out
        console.log('\n[3] Testing Attendance Check-out...');
        const checkOutRes = await axios.post(`${BASE_URL}/attendance/checkout`, {}, config);
        console.log('✅ Check-out successful:', checkOutRes.data.message);

        // 4. Create Task
        console.log('\n[4] Testing Create Task...');
        const taskRes = await axios.post(`${BASE_URL}/tasks`, {
            title: 'Verification Task',
            description: 'Testing the system logic'
        }, config);
        console.log('✅ Task creation successful:', taskRes.data.id);
        const taskId = taskRes.data.id;

        // 5. Get Tasks
        console.log('\n[5] Testing Get Tasks...');
        try {
            const getTasksRes = await axios.get(`${BASE_URL}/tasks`, config);
            console.log('✅ Get Tasks successful, count:', getTasksRes.data.length);
        } catch (err) {
            if (err.response && err.response.status === 500) {
                console.log('❌ Get Tasks failed with 500. This is likely due to MISSING INDEX.');
                console.log('Please check backend logs for the Firebase Index creation link.');
            } else {
                console.log('❌ Get Tasks failed:', err.response?.data || err.message);
            }
        }

        // 6. Delete Task
        console.log('\n[6] Testing Delete Task...');
        await axios.delete(`${BASE_URL}/tasks/${taskId}`, config);
        console.log('✅ Task deletion successful');

        console.log('\n--- Backend logic verified! ---');
    } catch (error) {
        console.error('\n❌ Test failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error Code:', error.code);
            console.error('Error Message:', error.message);
        }
    }
};

test();
