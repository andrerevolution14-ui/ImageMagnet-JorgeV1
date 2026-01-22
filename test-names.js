async function test() {
    const names = ['leads', 'lead', 'Registos', 'emails', 'Leads'];
    for (const name of names) {
        const url = `http://76.13.11.36:8090/api/collections/${name}/records`;
        try {
            const res = await fetch(url, { method: 'POST' }); // Just to see if it's 404 or something else
            console.log(`Testing ${name}: Status ${res.status}`);
        } catch (e) { }
    }
}
test();
