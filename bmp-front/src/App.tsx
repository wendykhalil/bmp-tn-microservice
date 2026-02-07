import React, { useEffect, useState } from "react";
import { api } from "./api";

type ProjectStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";

type Project = {
    id: number;
    artisanId: number;
    title: string;
    description?: string | null;
    location?: string | null;
    budget: number;
    startDate?: string | null;
    endDate?: string | null;
    status?: ProjectStatus | string | null;
};

type CreateProjectForm = {
    artisanId: number;
    title: string;
    description: string;
    location: string;
    budget: number | string;
    startDate: string;
};

type EditProjectForm = {
    title: string;
    description: string;
    location: string;
    budget: number | string;
    startDate: string;
};

export default function App() {
    const [projects, setProjects] = useState<Project[]>([]);

    // create form
    const [form, setForm] = useState<CreateProjectForm>({
        artisanId: 1,
        title: "",
        description: "",
        location: "",
        budget: 0,
        startDate: "",
    });

    // get by id
    const [searchId, setSearchId] = useState<string>("");
    const [searchedProject, setSearchedProject] = useState<Project | null>(null);

    // edit
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<EditProjectForm>({
        title: "",
        description: "",
        location: "",
        budget: 0,
        startDate: "",
    });

    async function loadProjects() {
        const res = await api.get<Project[]>("/projects");
        setProjects(res.data);
    }

    async function createProject(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const payload = {
            ...form,
            budget: Number(form.budget),
            startDate: form.startDate || null,
            endDate: null,
        };

        await api.post("/projects", payload);

        setForm({
            artisanId: 1,
            title: "",
            description: "",
            location: "",
            budget: 0,
            startDate: "",
        });

        await loadProjects();
    }

    async function getProjectById() {
        const id = Number(searchId);
        if (!id) return;

        try {
            const res = await api.get<Project>(`/projects/${id}`);
            setSearchedProject(res.data);
        } catch (err: any) {
            setSearchedProject(null);
            alert("Project not found (check the ID).");
            console.log(err?.response?.data || err.message);
        }
    }

    function startEdit(p: Project) {
        setEditingId(p.id);
        setEditForm({
            title: p.title ?? "",
            description: p.description ?? "",
            location: p.location ?? "",
            budget: p.budget ?? 0,
            startDate: p.startDate ? String(p.startDate).slice(0, 10) : "",
        });
    }

    async function saveEdit(id: number) {
        const payload = {
            title: editForm.title,
            description: editForm.description,
            location: editForm.location,
            budget: Number(editForm.budget),
            startDate: editForm.startDate || null,
            endDate: null,
        };

        await api.put(`/projects/${id}`, payload);
        setEditingId(null);
        await loadProjects();

        // refresh search card if it’s the same project
        if (searchedProject?.id === id) {
            const res = await api.get<Project>(`/projects/${id}`);
            setSearchedProject(res.data);
        }
    }

    async function updateStatus(id: number, status: ProjectStatus) {
        await api.patch(`/projects/${id}/status`, { status });
        await loadProjects();

        if (searchedProject?.id === id) {
            const res = await api.get<Project>(`/projects/${id}`);
            setSearchedProject(res.data);
        }
    }

    async function deleteProject(id: number) {
        if (!confirm(`Delete project #${id}?`)) return;

        // NOTE: this needs backend @DeleteMapping("/{id}")
        await api.delete(`/projects/${id}`);

        await loadProjects();
        if (searchedProject?.id === id) setSearchedProject(null);
        if (editingId === id) setEditingId(null);
    }

    useEffect(() => {
        loadProjects();
    }, []);

    return (
        <div style={{ fontFamily: "Arial", padding: 24, maxWidth: 900, margin: "0 auto" }}>
            <h1>BMP.tn — Project Service (Demo)</h1>

            {/* CREATE */}
            <form
                onSubmit={createProject}
                style={{ display: "grid", gap: 10, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}
            >
                <h2>Create Project</h2>

                <input
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                />

                <input
                    placeholder="Location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                />

                <input
                    placeholder="Budget"
                    type="number"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    min={0}
                    required
                />

                <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />

                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                />

                <button
                    type="submit"
                    style={{
                        padding: 10,
                        borderRadius: 10,
                        border: "none",
                        background: "#1E3A8A",
                        color: "white",
                        fontWeight: 700,
                    }}
                >
                    Create
                </button>
            </form>

            {/* GET BY ID */}
            <div style={{ marginTop: 18, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
                <h2>Find Project by ID</h2>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <input
                        placeholder="Project ID (example: 1)"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        style={{ minWidth: 220 }}
                    />
                    <button onClick={getProjectById} style={{ padding: 10, borderRadius: 10 }}>
                        Search
                    </button>
                    <button
                        onClick={() => {
                            setSearchId("");
                            setSearchedProject(null);
                        }}
                        style={{ padding: 10, borderRadius: 10 }}
                    >
                        Clear
                    </button>
                </div>

                {searchedProject && (
                    <div style={{ marginTop: 12, padding: 12, border: "1px solid #e5e5e5", borderRadius: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <strong>
                                #{searchedProject.id} — {searchedProject.title}
                            </strong>
                            <span>{searchedProject.status ?? ""}</span>
                        </div>
                        <div style={{ color: "#555" }}>{searchedProject.location || "—"}</div>
                        <div>Budget: {searchedProject.budget} TND</div>
                        <small style={{ color: "#777" }}>ArtisanId: {searchedProject.artisanId}</small>

                        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                            <button onClick={() => updateStatus(searchedProject.id, "PLANNED")}>Planned</button>
                            <button onClick={() => updateStatus(searchedProject.id, "IN_PROGRESS")}>In Progress</button>
                            <button onClick={() => updateStatus(searchedProject.id, "COMPLETED")}>Completed</button>

                            <button onClick={() => startEdit(searchedProject)} style={{ marginLeft: 10 }}>
                                Edit
                            </button>
                            <button onClick={() => deleteProject(searchedProject.id)} style={{ marginLeft: 4 }}>
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* LIST */}
            <h2 style={{ marginTop: 24 }}>Projects</h2>

            <div style={{ display: "grid", gap: 12 }}>
                {projects.map((p) => (
                    <div key={p.id} style={{ border: "1px solid #e5e5e5", padding: 14, borderRadius: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <strong>
                                #{p.id} — {p.title}
                            </strong>
                            <span>{p.status ?? ""}</span>
                        </div>

                        <div style={{ color: "#555" }}>{p.location || "—"}</div>
                        <div>Budget: {p.budget} TND</div>
                        <small style={{ color: "#777" }}>ArtisanId: {p.artisanId}</small>

                        {/* STATUS BUTTONS */}
                        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                            <button onClick={() => updateStatus(p.id, "PLANNED")}>Planned</button>
                            <button onClick={() => updateStatus(p.id, "IN_PROGRESS")}>In Progress</button>
                            <button onClick={() => updateStatus(p.id, "COMPLETED")}>Completed</button>

                            <button onClick={() => startEdit(p)} style={{ marginLeft: 10 }}>
                                Edit
                            </button>
                            <button onClick={() => deleteProject(p.id)} style={{ marginLeft: 4 }}>
                                Delete
                            </button>
                        </div>

                        {/* EDIT FORM (INLINE) */}
                        {editingId === p.id && (
                            <div style={{ marginTop: 12, padding: 12, border: "1px dashed #bbb", borderRadius: 12 }}>
                                <div style={{ display: "grid", gap: 8 }}>
                                    <input
                                        placeholder="Title"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    />
                                    <input
                                        placeholder="Location"
                                        value={editForm.location}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                    />
                                    <input
                                        placeholder="Budget"
                                        type="number"
                                        value={editForm.budget}
                                        onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                                        min={0}
                                    />
                                    <input
                                        type="date"
                                        value={editForm.startDate}
                                        onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        rows={3}
                                    />

                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button onClick={() => saveEdit(p.id)} style={{ padding: 10, borderRadius: 10 }}>
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            style={{ padding: 10, borderRadius: 10 }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
