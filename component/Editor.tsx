"use client"

import { POST } from "@/app/api/document/route"
import { useEffect, useState } from "react"

export default function Editor() {

    const [content, setContent] = useState('')

    useEffect(() => {
        const timeOut = setTimeout(() => {
            fetch('/api/document', {
                method: "POST",
                body: JSON.stringify({ content })
            })
        }, 500)

        return () => clearTimeout(timeOut)

    }, [content])

    useEffect(() => {
        const load = async () => {
            const res = await fetch("/api/document")
            const data = await res.json()
            setContent(data.content)
        }

        load()
    }, [])


    return (
        <textarea
            className="w-full h-125 border p-4"
            placeholder="Enter Text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
    )
}
