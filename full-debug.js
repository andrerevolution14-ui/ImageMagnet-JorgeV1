async function check() {
    const res = await fetch('http://76.13.11.36:8090/api/collections/ImageMagnet_JorgeV1/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Email: 'test_array@test.pt',
            Question_1: 'a',
            Question_2: 'a'
        })
    });
    console.log('Status:', res.status);
    console.log('Response:', await res.text());
}
check();
