import React, { useState } from 'react';

export default function SummarizeForm() {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/gemini/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: text }), // 👈 отправляем как 'prompt'
            });

            const data = await res.json();
            setSummary(data.response); // 👈 ожидаем { "response": "..." }
        } catch (error) {
            console.error("Ошибка запроса:", error);
            setSummary("Ошибка подключения к серверу.");
        }

        setLoading(false);
    };

    return (
        <div>
            <h2>Генератор краткого резюме новости</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    rows={5}
                    cols={60}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Введите текст новости"
                />
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Обрабатываю..." : "Сгенерировать резюме"}
                </button>
            </form>
            {summary && (
                <div>
                    <h3>📝 Резюме:</h3>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
}
