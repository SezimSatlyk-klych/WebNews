import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyBwo_sugdqjYP_JE_ikeyLTGd7OZ8OTbrk"); // Вставь сюда свой ключ

export default function GeminiChat() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(input);
            const response = await result.response;
            const text = response.text();
            setOutput(text);
        } catch (error) {
            console.error("Ошибка генерации:", error);
            setOutput("Ошибка: " + error.message);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Gemini AI Chat</h2>
            <textarea
                rows={4}
                cols={60}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Введите запрос к Gemini"
            />
            <br />
            <button onClick={handleGenerate} disabled={loading}>
                {loading ? "Обрабатываю..." : "Спросить Gemini"}
            </button>
            {output && (
                <div>
                    <h3>Ответ:</h3>
                    <p>{output}</p>
                </div>
            )}
        </div>
    );
}
