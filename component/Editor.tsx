"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function Editor() {

    const {
        roomId
    } = useParams()

    const [users, setUsers] = useState<string[]>([]);
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [isTyping, setIsTyping] = useState(false)



    useEffect(() => {
        socket.emit("join-room", roomId);

        socket.on("receive-changes-content", (newContent) => {
            setContent(newContent);
        });


        socket.on("receive-changes-title", (newTitle) => {
            setTitle(newTitle);
        });


        return () => {
            socket.off("receive-changes");
        };
    }, [roomId]);

    useEffect(() => {
        socket.on("users", (usersList) => {
            setUsers(usersList)
        })

        return () => {
            socket.off("users")
        }
    }, [])


    useEffect(() => {
        socket.on("user-typing", () => {
            setIsTyping(true);

            setTimeout(() => {
                setIsTyping(false);
            }, 1000); // disappears after 1s
        });

        return () => {
            socket.off("user-typing");
        };
    }, []);

    useEffect(() => {

        if (!loading) {
            return
        }
        const timeOut = setTimeout(() => {
            fetch('/api/document', {
                method: "POST",
                body: JSON.stringify({ id: roomId, content, title })
            })
        }, 500)


        return () => clearTimeout(timeOut)

    }, [content, roomId, title, loading])

    // Why roomId is needed here??


    useEffect(() => {
        const load = async () => {
            const res = await fetch(`/api/document/${roomId}`)
            const data = await res.json()

            console.log("Response is here")
            console.log(data)

            if (data) {
                setContent(data.content)
                setTitle(data.title)
            }

            setLoading(true)
        }

        load()
    }, [roomId])

    return (
        <div className="min-h-screen bg-black text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            {/* THIN TOP NAV */}
            <nav className="h-14 border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold tracking-tighter border-r border-black pr-4">DOC_OS</span>
                    <span className="text-[10px] font-bold">ID: {roomId}</span>
                </div>

                <div className="flex items-center gap-6">
                    <span className="text-[10px] uppercase tracking-widest text-black font-semibold flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Live Sync
                    </span>
                    <button className="text-xs font-medium hover:text-blue-600 transition-colors">Export</button>
                    <button className="bg-slate-900 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-slate-800 transition-all">
                        Publish
                    </button>
                </div>
            </nav>

            <div className="flex gap-2 mb-4 flex-wrap">
                {users.map((user) => (
                    <div key={user} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">

                        {user.slice(0, 5)}
                    </div>
                ))}

            </div>



            <main className="max-w-3xl mx-auto pt-24 px-6 pb-32">
                {/* TITLE SECTION */}
                <div className="mb-12">
                    <input
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value)
                            socket.emit("send-changes-title", {
                                roomId,
                                title: e.target.value,
                            });

                            socket.emit("typing", roomId)
                        }
                        }
                        className="w-full text-5xl text-white/80 font-medium tracking-tight placeholder:text-gray-400 outline-none border-none bg-transparent"

                        placeholder="Document Title"
                    />

                </div>
                {isTyping &&
                    <div className="text-sm text-white italic mb-2">
                        Someone is typing...
                    </div>
                }


                {/* CONTENT SECTION */}
                <div className="relative">
                    <textarea
                        className="w-full h-[70vh] text-xl leading-[1.8] text-white/80 placeholder:text-slate-400 outline-none border-none bg-transparent resize-none font-normal"
                        placeholder="Start writing..."
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value)
                            socket.emit("send-changes-content", {
                                roomId,
                                content: e.target.value,
                            });
                            socket.emit("typing", roomId)
                        }}
                    />
                </div>

                {/* MINIMALIST FLOATING TOOLBAR */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-full shadow-xs shadow-gray-400">
                    <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-900 hover:text-slate-900 transition-all">B</button>
                    <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-900 hover:text-slate-900 transition-all font-serif italic">i</button>
                    <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                    <span className="px-3 text-[10px]  text-slate-900 uppercase tracking-tighter">
                        {content && content.length} chars
                    </span>
                </div>
            </main>
        </div>
    )
}
