"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useRouter } from "next/navigation";

export default function DocumentPage() {
    const { id } = useParams();
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("")
    const router = useRouter()

    const deleteDoc = async () => {
        await fetch(`/api/document/$[id]`,
            { method: "DELETE" }
        );

        router.push('/')
    }


    useEffect(() => {
        fetch(`/api/document/${id}`)
            .then(res => res.json())
            .then(data => {
                setContent(data.content)
                setTitle(data.title)
            }
            );
    }, [id]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetch(`/api/document/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ title })
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [title, id]);


    return (
        <>

            <button
                onClick={deleteDoc}
                className="mb-4 px-3 py-1 bg-red-500 text-white rounded"
            >
                Delete
            </button>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold mb-4 outline-none"
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-screen p-10 outline-none"
            />

        </>
    );
}