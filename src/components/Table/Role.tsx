"use client";  // Required for client-side React hooks in Next.js 13+

import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
// import { useroles } from "@/lib/useroles";
import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRoles } from "@/lib/useRole";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"


export function Role() {
    const {
        currentRoles,
        searchTerm,
        setSearchTerm,
        paginate,
        currentPage,
        rowsPerPage,
        handleRowsPerPageChange,
        handleDelete,
        filteredRoles,
        newRole,
        setNewRole,
        setOpenDialog,
        openDialog,
        handleAddRole,
        openEditDialog,
        setOpenEditDialog,
        editRoleName,
        setEditRoleName,
        openEdit,
        handleUpdateRole,
    } = useRoles();

    // const router = useRouter();

    // const handleClick = () => {
    //     // Navigate to the role page when button is clicked
    //     router.push("/role/add-role"); // Replace with the correct path
    // };

    return (
        <>

            <div className="flex items-center justify-between">
                <h1 style={{ fontWeight: 'bold', fontSize: '24px' }}>Danh sách vai trò</h1>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-md">
                            Thêm vai trò
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Thêm vai trò</DialogTitle>
                            <DialogDescription>
                                Nhập thông tin vai trò mới.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="roleName" className="text-right">
                                    Tên vai trò
                                </Label>
                                <Input
                                    id="roleName"
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    className="col-span-3"
                                    placeholder="Nhập tên vai trò"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddRole}>Lưu</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mb-4">
                <Input
                    type="text"
                    placeholder=" Tìm kiếm theo tên vai trò"
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: "10px", padding: "5px", fontSize: "16px" }}
                />
            </div>


            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead style={{ width: '433px' }}>No.</TableHead>
                        <TableHead className="text-center">Tên vai trò</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentRoles.length > 0 ? (
                        currentRoles.map((role, index) => (
                            <TableRow key={role._id}>
                                <TableCell>{index + 1 + (currentPage - 1) * rowsPerPage}</TableCell>
                                <TableCell className="text-center">{role.name}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 hover:bg-gray-100 rounded">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openEdit(role)}>
                                                Sửa
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(role._id)}>
                                                Xoá
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                                Không có vai trò
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="mt-6 flex flex-col md:flex-row md:justify-end items-center gap-4">
                {/* Rows per page */}
                <div className="flex items-center gap-2 text-sm">
                    <span>Rows per page:</span>
                    <select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        {[10, 25, 50, 100].map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-md border text-sm hover:bg-gray-100 disabled:opacity-50"
                    >
                        ← Trước
                    </button>

                    <span className="text-sm">
                        Trang <strong>{currentPage}</strong> /{" "}
                        {Math.ceil(filteredRoles.length / rowsPerPage)}
                    </span>

                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage * rowsPerPage >= filteredRoles.length}
                        className="px-3 py-2 rounded-md border text-sm hover:bg-gray-100 disabled:opacity-50"
                    >
                        Sau →
                    </button>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Cập nhật vai trò</DialogTitle>
                        <DialogDescription>
                            Sửa tên vai trò bên dưới.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editRoleName" className="text-right">
                                Tên vai trò
                            </Label>
                            <Input
                                id="editRoleName"
                                value={editRoleName}
                                onChange={(e) => setEditRoleName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUpdateRole}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
