async function test() {
    try {
        console.log('Starting fetch to: http://76.13.11.36:8090/api/collections/leads/records');
        const res = await fetch('http://76.13.11.36:8090/api/collections/leads/records', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test_ai_direct@example.com',
                question_1: 'a',
                question_2: 'b'
            })
        });
        const status = res.status;
        const text = await res.text();
        console.log('Status:', status);
        console.log('Response:', text);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
