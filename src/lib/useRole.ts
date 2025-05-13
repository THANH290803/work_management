import { useState, useEffect } from "react";
import axios from "axios";

export interface Role {
    _id: string;
    name: string;
}

export function useRoles() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchRoles = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Không tìm thấy token!");
                return;
            }

            try {
                const response = await axios.get("https://qthl-group.onrender.com/api/role", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRoles(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách role:", error);
            }
        };

        fetchRoles();
    }, []);

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentRoles = filteredRoles.slice(indexOfFirst, indexOfLast);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(event.target.value));
        setCurrentPage(1);
    };

    // Add
    const [newRole, setNewRole] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const handleAddRole = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Không tìm thấy token!");
            return;
        }

        if (!newRole.trim()) {
            return;
        }

        try {
            await axios.post(
                "https://qthl-group.onrender.com/api/role/post",
                { name: newRole },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Nếu thành công, đóng dialog, clear input, và cập nhật danh sách
            setNewRole("");
            setOpenDialog(false);
            window.location.reload(); // Hoặc gọi lại fetchRoles() nếu bạn muốn tránh reload
        } catch (error) {
            console.error("Lỗi khi thêm vai trò:", error);
        }
    };

    // Edit
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editRoleId, setEditRoleId] = useState<string | null>(null);
    const [editRoleName, setEditRoleName] = useState("");

    const openEdit = (role: Role) => {
        setEditRoleId(role._id);
        setEditRoleName(role.name);
        setOpenEditDialog(true);
    };

    const handleUpdateRole = async () => {
        const token = localStorage.getItem("token");
        if (!token || !editRoleId) return;

        try {
            await axios.put(
                `https://qthl-group.onrender.com/api/role/${editRoleId}`,
                { name: editRoleName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setOpenEditDialog(false);
            setEditRoleId(null);
            setEditRoleName("");
            window.location.reload(); // hoặc gọi lại fetchRoles()
        } catch (error) {
            console.error("Lỗi khi cập nhật vai trò:", error);
        }
    };

    // Delete
    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Không tìm thấy token!");
            return;
        }

        try {
            await axios.delete(`https://qthl-group.onrender.com/api/role/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setRoles(prev => prev.filter(role => role._id !== id));
        } catch (error) {
            console.error("Lỗi khi xoá role:", error);
        }
    };

    return {
        roles,
        searchTerm,
        setSearchTerm,
        currentPage,
        rowsPerPage,
        setRowsPerPage,
        handleRowsPerPageChange,
        filteredRoles,
        currentRoles,
        paginate,
        openEditDialog,
        setOpenEditDialog,
        editRoleName,
        setEditRoleName,
        openEdit,
        handleUpdateRole,
        setNewRole,
        setOpenDialog,
        openDialog,
        newRole,
        handleAddRole,
        handleDelete
    };
}
