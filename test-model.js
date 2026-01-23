const Replicate = require("replicate");

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
    try {
        const model = await replicate.models.get("xlabs-ai", "flux-dev-controlnet-canny");
        console.log("Model Version:", model.latest_version?.id);
        console.log("Model Schema (top level):", Object.keys(model));
    } catch (error) {
        console.error("Error fetching model:", error.message);
    }
}

main();
