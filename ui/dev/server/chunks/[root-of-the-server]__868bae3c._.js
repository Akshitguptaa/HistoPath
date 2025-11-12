module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:stream/web [external] (node:stream/web, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream/web", () => require("node:stream/web"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/histopath/lib/kb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Define the structure for a knowledge base entry
__turbopack_context__.s([
    "knowledgeBase",
    ()=>knowledgeBase,
    "retrieveContext",
    ()=>retrieveContext
]);
const knowledgeBase = [
    {
        id: 'histopathology',
        title: 'Histopathology Definition',
        content: 'The microscopic examination of tissue to study the manifestations of disease.',
        keywords: [
            'histopathology',
            'what is histopathology',
            'tissue',
            'disease'
        ]
    },
    {
        id: 'metastasis',
        title: 'Metastasis Definition',
        content: 'The spread of cancer cells from the place where they first formed to another part of the body. In lymph nodes, this is a critical indicator of cancer progression, particularly in breast cancer.',
        keywords: [
            'metastasis',
            'metastatic',
            'spread',
            'cancer',
            'lymph node'
        ]
    },
    {
        id: 'tumor-patch',
        title: 'Tumor Patch',
        content: 'A small section (e.g., 96x96 pixels) of a whole-slide image (WSI) of a tissue sample. Analysis is often done at the patch level.',
        keywords: [
            'patch',
            'tumor patch',
            'wsi',
            'whole-slide image'
        ]
    },
    {
        id: 'model',
        title: 'CNN Model Information',
        content: 'A Convolutional Neural Network (CNN) based on the ResNet50 architecture. It\'s trained to perform binary classification (Metastatic vs. Non-Metastatic).',
        keywords: [
            'model',
            'cnn',
            'convolutional neural network',
            'resnet50',
            'classification'
        ]
    },
    {
        id: 'dataset',
        title: 'Dataset Information',
        content: 'The model was trained on the PatchCamelyon (PCam) dataset. PCam consists of hundreds of thousands of 96x96 pixel image patches extracted from lymph node WSIs. Each patch is labeled as containing metastatic tissue or not.',
        keywords: [
            'dataset',
            'pcam',
            'patchcamelyon',
            'training',
            'trained'
        ]
    },
    {
        id: 'grad-cam',
        title: 'Grad-CAM (Heatmap)',
        content: 'Grad-CAM (Gradient-weighted Class Activation Mapping) is the technique used to generate heatmaps. The heatmap visually indicates which regions of the image patch were most influential in the model\'s prediction. "Hotter" areas (e.g., red/yellow) signify regions the model focused on to make its decision. This helps in understanding and trusting the model\'s output.',
        keywords: [
            'grad-cam',
            'gradcam',
            'heatmap',
            'visualization',
            'explain',
            'why',
            'hot',
            'hotspot'
        ]
    }
];
const retrieveContext = (prompt)=>{
    const lowerCasePrompt = prompt.toLowerCase();
    // Find all KB entries that have at least one matching keyword
    const relevantEntries = knowledgeBase.filter((entry)=>entry.keywords.some((keyword)=>lowerCasePrompt.includes(keyword)));
    if (relevantEntries.length === 0) {
        return null; // No context found
    }
    // Combine the content of all relevant entries to form the context
    const context = relevantEntries.map((entry)=>`Context on "${entry.title}": ${entry.content}`).join('\n\n');
    return context;
};
}),
"[project]/histopath/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$histopath$2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/histopath/node_modules/groq-sdk/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$histopath$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/histopath/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$histopath$2f$lib$2f$kb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/histopath/lib/kb.ts [app-route] (ecmascript)"); // <-- Import our new retriever
;
;
;
// Get API key from environment variables
const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
    throw new Error("GROQ_API_KEY is not defined in environment variables");
}
const groq = new __TURBOPACK__imported__module__$5b$project$5d2f$histopath$2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]({
    apiKey
});
const model = "llama-3.3-70b-versatile";
// This is the new, simple base persona. The KB is no longer hard-coded.
const baseSystemInstruction = `You are 'Histopath', a helpful AI assistant specializing in histopathology and cancer detection. Your purpose is to assist clinicians and researchers.
- Be concise, clear, and professional.
- Explain technical terms simply.
- **Crucially, you must never provide a medical diagnosis or treatment advice.** You are an informational tool, not a substitute for a qualified pathologist.
- Use the provided context to answer the user's questions. If no context is provided or it's not relevant, use your general knowledge.
---
`;
async function POST(request) {
    try {
        const { prompt, history, analysisResult } = await request.json();
        // --- RAG: Retrieval Step ---
        // 1. Retrieve KB context based on the user's prompt
        const kbContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$histopath$2f$lib$2f$kb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["retrieveContext"])(prompt);
        // --- RAG: Augmentation Step ---
        // 2. Build the augmented system prompt
        let augmentedSystemInstruction = baseSystemInstruction;
        // 2a. Add the dynamic analysis context (if it exists)
        if (analysisResult) {
            augmentedSystemInstruction += `
**Current Image Analysis Context:**
- The user has just analyzed an image patch.
- **Model Prediction:** ${analysisResult.prediction}
- **Confidence Score:** ${Math.round(analysisResult.confidence * 100)}%
- A Grad-CAM heatmap has been generated. Use this to inform your answer.
---
`;
        }
        // 2b. Add the retrieved KB context (if it was found)
        if (kbContext) {
            augmentedSystemInstruction += `
**Retrieved Knowledge Base Context:**
(Use this information to answer the user's question)
${kbContext}
---
`;
        }
        // 3. Construct the messages array for Groq
        const messages = [
            {
                role: "system",
                content: augmentedSystemInstruction
            }
        ];
        // 4. Map the existing history
        // The 'history' from the client already includes the latest user prompt
        history.forEach((msg)=>{
            messages.push({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.parts[0].text
            });
        });
        // --- RAG: Generation Step ---
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: model
        });
        const responseText = chatCompletion.choices[0]?.message?.content || "";
        // Send the response back to the client
        return __TURBOPACK__imported__module__$5b$project$5d2f$histopath$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            response: responseText
        });
    } catch (error) {
        console.error("Error in chat API route:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$histopath$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to get a response from the AI assistant."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__868bae3c._.js.map