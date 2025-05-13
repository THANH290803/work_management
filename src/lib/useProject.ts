import { useState, useEffect } from "react";
import axios from "axios";

export interface Project {
    _id: string;
    name: string;
    description: string;
    created_by: {
        _id: string;
        name: string;
        email: string;
        role_id: string;
        company_id: string;
        department_id: string | null;
        team_id: string | null;
        createdAt: string;
        updatedAt: string;
    };
    company_id: {
        _id: string;
        name: string;
        is_headquarter: boolean;
        phone: string;
        email: string;
    };
    department_id: {
        _id: string;
        name: string;
        company_id: string;
    };
    team_id: {
        _id: string;
        name: string;
        department_id: string;
    };
    start_date: string; // ISO 8601 date string
    end_date: string; // ISO 8601 date string
    created_at: string; // ISO 8601 date string
}

interface Company {
    _id: string;
    name: string;
}

interface Department {
    _id: string;
    name: string;
    company_id: Company;
}

interface Team {
    _id: string;
    name: string;
    department_id: Department;
}


export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Không tìm thấy token!");
                return;
            }

            try {
                const response = await axios.get("https://qthl-group.onrender.com/api/project", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProjects(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách project:", error);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirst, indexOfLast);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(event.target.value));
        setCurrentPage(1);
    };

    // Company, Departments, Team
    const [companies, setCompanies] = useState<Company[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<string>("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [selectedTeam, setSelectedTeam] = useState<string>("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchCompanies = async () => {
            try {
                const response = await axios.get("https://qthl-group.onrender.com/api/company", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCompanies(response.data);
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };
        fetchCompanies();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchDepartments = async () => {
            if (selectedCompany) {
                try {
                    const response = await axios.get(`https://qthl-group.onrender.com/api/department/company/${selectedCompany}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                    setDepartments(response.data);
                } catch (error) {
                    console.error("Error fetching departments:", error);
                }
            }
        };
        fetchDepartments();
    }, [selectedCompany]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchTeams = async () => {
            if (selectedDepartment) {
                try {
                    const response = await axios.get(`https://qthl-group.onrender.com/api/team/department/${selectedDepartment}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                    setTeams(response.data);
                } catch (error) {
                    console.error("Error fetching teams:", error);
                }
            }
        };
        fetchTeams();
    }, [selectedDepartment]);

    // Add Project
    const [newProjectData, setNewProjectData] = useState({
        name: "",
        description: "",
        company_id: "",
        department_id: "",
        team_id: "",
        start_date: "",
        end_date: "",
    });


    const handleAddProject = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Không tìm thấy token!");
            return;
        }

        const {
            name,
            description,
            company_id,
            department_id,
            team_id,
            start_date,
            end_date,
        } = newProjectData;

        // Kiểm tra dữ liệu
        if (!name.trim()) {
            console.warn("Tên project không được để trống.");
            return;
        }

        try {
            await axios.post(
                "https://qthl-group.onrender.com/api/project/post",
                {
                    name,
                    description,
                    company_id,
                    department_id,
                    team_id,
                    start_date,
                    end_date,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNewProjectData({
                name: "",
                description: "",
                company_id: "",
                department_id: "",
                team_id: "",
                start_date: "",
                end_date: "",
            });

            window.location.href = ('/project'); // hoặc gọi lại fetchProjects()
        } catch (error) {
            console.error("Lỗi khi thêm project:", error);
        }
    };


    // Edit Project
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editProjectId, setEditProjectId] = useState<string | null>(null);
    const [editProjectName, setEditProjectName] = useState("");

    const openEdit = (project: Project) => {
        setEditProjectId(project._id);
        setEditProjectName(project.name);
        setOpenEditDialog(true);
    };

    const handleUpdateProject = async () => {
        const token = localStorage.getItem("token");
        if (!token || !editProjectId) return;

        try {
            await axios.put(
                `https://qthl-group.onrender.com/api/project/${editProjectId}`,
                { name: editProjectName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setOpenEditDialog(false);
            setEditProjectId(null);
            setEditProjectName("");
            window.location.reload(); // or refetch projects
        } catch (error) {
            console.error("Lỗi khi cập nhật project:", error);
        }
    };

    // Delete Project
    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Không tìm thấy token!");
            return;
        }

        try {
            await axios.delete(`https://qthl-group.onrender.com/api/project/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProjects(prev => prev.filter(project => project._id !== id));
        } catch (error) {
            console.error("Lỗi khi xoá project:", error);
        }
    };

    return {
        projects,
        searchTerm,
        setSearchTerm,
        currentPage,
        rowsPerPage,
        setRowsPerPage,
        handleRowsPerPageChange,
        filteredProjects,
        currentProjects,
        paginate,
        openEditDialog,
        setOpenEditDialog,
        editProjectName,
        setEditProjectName,
        openEdit,
        handleUpdateProject,
        newProjectData,
        setNewProjectData,
        handleAddProject,
        handleDelete,
        companies,
        departments,
        teams,
        selectedCompany,
        setSelectedCompany,
        selectedDepartment,
        setSelectedDepartment,
        selectedTeam,
        setSelectedTeam,
    };
}
