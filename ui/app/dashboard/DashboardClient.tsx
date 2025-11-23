"use client";

import { useState } from "react";
import { Chat } from "@prisma/client";
import { Search, FileText, Activity, Calendar, ArrowUpRight, Filter, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardClientProps {
    chats: Chat[];
    userName: string;
}

export default function DashboardClient({ chats: initialChats, userName }: DashboardClientProps) {
    const [chats, setChats] = useState<Chat[]>(initialChats);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"ALL" | "META" | "NON_META">("ALL");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            setDeletingId(id);
            const response = await fetch(`/api/chat/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete");
            }

            setChats((prev) => prev.filter((chat) => chat.id !== id));
            router.refresh();
        } catch (error) {
            console.error("Error deleting chat:", error);
            alert("Failed to delete analysis. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredChats = chats.filter((chat) => {
        const matchesSearch =
            chat.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.response.toLowerCase().includes(searchQuery.toLowerCase());

        if (filter === "ALL") return matchesSearch;

        const isMeta = chat.prediction?.toLowerCase().includes("metastatic") ||
            (chat.response.toLowerCase().includes("metastatic") && !chat.response.toLowerCase().includes("non-metastatic"));
        const isNonMeta = chat.prediction?.toLowerCase().includes("non") || chat.response.toLowerCase().includes("non-metastatic");

        if (filter === "META") return matchesSearch && isMeta;
        if (filter === "NON_META") return matchesSearch && isNonMeta;

        return matchesSearch;
    });

    const totalScans = chats.length;
    const metastaticCount = chats.filter(c =>
        c.prediction?.toLowerCase().includes("metastatic") ||
        (c.response.toLowerCase().includes("metastatic") && !c.response.toLowerCase().includes("non-metastatic"))
    ).length;
    const nonMetastaticCount = chats.filter(c =>
        c.prediction?.toLowerCase().includes("non") ||
        c.response.toLowerCase().includes("non-metastatic")
    ).length;

    return (
        <div className="container py-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {userName}. Here's your analysis overview.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <a href="/analyze" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm">
                        <Activity className="w-4 h-4 mr-2" />
                        New Analysis
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                    title="Total Analyses"
                    value={totalScans}
                    icon={<FileText className="w-4 h-4 text-blue-500" />}
                    description="All time history"
                />
                <StatsCard
                    title="Metastatic Detected"
                    value={metastaticCount}
                    icon={<Activity className="w-4 h-4 text-red-500" />}
                    description="Potential concerns found"
                />
                <StatsCard
                    title="Non-Metastatic"
                    value={nonMetastaticCount}
                    icon={<Activity className="w-4 h-4 text-green-500" />}
                    description="Clear analyses"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search history..."
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <FilterButton active={filter === "ALL"} onClick={() => setFilter("ALL")} label="All" />
                    <FilterButton active={filter === "META"} onClick={() => setFilter("META")} label="Metastatic" />
                    <FilterButton active={filter === "NON_META"} onClick={() => setFilter("NON_META")} label="Non-Metastatic" />
                </div>
            </div>

            <div className="space-y-4">
                {filteredChats.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Search className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No results found</h3>
                        <p className="text-muted-foreground">
                            {chats.length === 0 ? "You haven't performed any analyses yet." : "Try adjusting your search or filters."}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredChats.map((chat) => (
                            <div key={chat.id} className="group relative flex flex-col gap-4 p-6 border rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-lg">Analysis Report</span>
                                            <Badge status={getAnalysisStatus(chat.response)} />
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground gap-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(chat.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Activity className="w-3 h-3" />
                                                {new Date(chat.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDelete(chat.id)}
                                            disabled={deletingId === chat.id}
                                            className="p-2 hover:bg-red-100 text-red-500 rounded-full transition-colors disabled:opacity-50"
                                            title="Delete Analysis"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-muted rounded-full">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {chat.prediction && (
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">Prediction:</span>
                                            <span className="font-semibold">{chat.prediction}</span>
                                        </div>
                                        {chat.confidence && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">Confidence:</span>
                                                <span className="font-semibold">{Math.round(chat.confidence * 100)}%</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-6 mt-2">
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Input Query</span>
                                        <p className="text-sm text-foreground/90">{chat.message}</p>
                                    </div>
                                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">AI Findings</span>
                                        <p className="text-sm text-foreground/90 line-clamp-3 group-hover:line-clamp-none transition-all">
                                            {chat.response}
                                        </p>
                                    </div>
                                </div>

                                {chat.heatmapUrl && (
                                    <div className="mt-4">
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Analysis Heatmap</span>
                                        <img src={chat.heatmapUrl} alt="Analysis Heatmap" className="rounded-lg border max-w-md" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, description }: { title: string, value: number, icon: React.ReactNode, description: string }) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
                {icon}
            </div>
            <div className="content">
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
        </div>
    )
}

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
        >
            {label}
        </button>
    )
}

function Badge({ status }: { status: "META" | "NON_META" | "UNKNOWN" }) {
    if (status === "META") {
        return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Metastatic</span>
    }
    if (status === "NON_META") {
        return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Non-Metastatic</span>
    }
    return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">Analysis</span>
}

function getAnalysisStatus(response: string): "META" | "NON_META" | "UNKNOWN" {
    const lower = response.toLowerCase();
    if (lower.includes("non-metastatic")) return "NON_META";
    if (lower.includes("metastatic")) return "META";
    return "UNKNOWN";
}
