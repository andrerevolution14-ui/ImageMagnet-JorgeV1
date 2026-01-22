async function test() {
    try {
        const urls = [
            'http://76.13.11.36:8090/api/collections/leads/records',
            'http://76.13.11.36:8090/api/collections',
            'http://76.13.11.36:8090/api/health'
        ];
        for (const url of urls) {
            console.log('\nTesting URL:', url);
            const res = await fetch(url);
            console.log('Status:', res.status);
            const text = await res.text();
            console.log('Response:', text.substring(0, 100));
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}
test();
