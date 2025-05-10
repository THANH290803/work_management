"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import axios from "axios"
import { useUsers } from "@/lib/useUser"
import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// Form validation schema using Zod
const formSchema = z.object({
    name: z.string().min(1, { message: "Tên người dùng không được để trống" }),
    password: z.string().min(0, { message: "" }),
    email: z.string().email({ message: "Email không hợp lệ." }),
    role_id: z.string().min(1, { message: "Vui lòng chọn vai trò" }),
    company_id: z.string().min(1, { message: "Vui lòng chọn công ty" }),
    department_id: z.string().nullable(),
    team_id: z.string().nullable(),
})

export function UserEdit() {
    const router = useRouter();
    const { roles, companies, departments, teams, selectedCompanyId, setSelectedCompanyId } = useUsers()

    const [rolePopoverOpen, setRolePopoverOpen] = useState(false);
    const [companyPopoverOpen, setCompanyPopoverOpen] = useState(false);
    const [teamPopoverOpen, setTeamPopoverOpen] = useState(false);
    const [departmentPopoverOpen, setDepartmentPopoverOpen] = useState(false);

    const searchParams = useSearchParams();
    const userId = searchParams.get("id");
    console.log(userId);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role_id: "",
            company_id: "",
            department_id: null,
            team_id: null,
        },
    });

    // Fetch user data on component mount
    useEffect(() => {
        if (userId) {
            // Lấy token từ localStorage
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("Không tìm thấy token!");
                return;
            }

            // Gửi yêu cầu GET với token trong header
            axios.get(`https://qthl-group.onrender.com/api/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    const user = response.data;
                    // Set form values with fetched data
                    form.setValue("name", user.name);
                    form.setValue("email", user.email);
                    form.setValue("role_id", user.role_id);
                    form.setValue("company_id", user.company_id);
                    form.setValue("department_id", user.department_id || null);
                    form.setValue("team_id", user.team_id || null);
                    // Đặt password vào form nếu cần
                    form.setValue("password", "");  // Nếu bạn muốn hiển thị password, nhưng nhớ bảo mật
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, [userId, form]);

    // Handle company selection
    const handleCompanyChange = (companyId: string) => {
        form.setValue("company_id", companyId);  // Update form state with selected company
        setSelectedCompanyId(companyId); // Set the selected company in the parent state (useUsers)
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const token = localStorage.getItem("token")

            // Kiểm tra xem mật khẩu có được nhập lại không
            if (!values.password || values.password === "") {
                // Nếu không có password, tạo một bản sao mới và xóa trường password
                const { password, ...updatedValues } = values;  // Loại bỏ password khỏi bản sao
                values = updatedValues as z.infer<typeof formSchema>;  // Đảm bảo kiểu vẫn đúng
            }

            await axios.put(`https://qthl-group.onrender.com/api/user/${userId}`, values, {
                headers: { Authorization: `Bearer ${token}` },
            })
            form.reset()
            router.push('/user')
        } catch (error) {
            console.error("Lỗi khi Sửa người dùng:", error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[550px]">
                {/* Tên người dùng */}
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên người dùng</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập tên người dùng" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Vai trò */}
                <FormField
                    name="role_id"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Chức vụ</FormLabel>
                            <FormControl>
                                <Popover open={rolePopoverOpen} onOpenChange={setRolePopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {roles.find((role) => role._id === field.value)?.name || "-- Chọn chức vụ trong công ty --"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[550px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Tìm vai trò..." />
                                            <CommandList>
                                                <CommandEmpty>Không tìm thấy vai trò.</CommandEmpty>
                                                <CommandGroup>
                                                    {roles.map((role) => (
                                                        <CommandItem
                                                            key={role._id}
                                                            value={role.name}
                                                            onSelect={() => {
                                                                form.setValue("role_id", role._id);
                                                                setRolePopoverOpen(false); // Hide Popover when a role is selected
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    field.value === role._id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {role.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Công ty */}
                <FormField
                    name="company_id"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Công ty</FormLabel>
                            <FormControl>
                                <Popover open={companyPopoverOpen} onOpenChange={setCompanyPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {companies.find((company) => company._id === field.value)?.name || "-- Chọn công ty --"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[550px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Tìm công ty" />
                                            <CommandList>
                                                <CommandEmpty>Không tìm thấy công ty.</CommandEmpty>
                                                <CommandGroup>
                                                    {companies.map((company) => (
                                                        <CommandItem
                                                            key={company._id}
                                                            value={company.name}
                                                            onSelect={() => {
                                                                handleCompanyChange(company._id);
                                                                setCompanyPopoverOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    field.value === company._id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {company.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Phòng ban */}
                <FormField
                    name="department_id"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phòng ban</FormLabel>
                            <FormControl>
                                <Popover open={departmentPopoverOpen} onOpenChange={setDepartmentPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {departments.find((dept) => dept._id === field.value)?.name || "-- Chọn phòng ban --"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[550px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Tìm phòng ban" />
                                            <CommandList>
                                                <CommandEmpty>Không tìm thấy phòng ban.</CommandEmpty>
                                                <CommandGroup>
                                                    {departments
                                                        .filter((department) => department.company_id._id === selectedCompanyId)  // Show only departments for the selected company
                                                        .map((department) => (
                                                            <CommandItem
                                                                key={department._id}
                                                                value={department.name}
                                                                onSelect={() => {
                                                                    form.setValue("department_id", department._id);
                                                                    setDepartmentPopoverOpen(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className="mr-2 h-4 w-4"
                                                                    style={{ opacity: field.value === department._id ? "100%" : "0%" }}
                                                                />
                                                                {department.name}
                                                            </CommandItem>
                                                        ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Team */}
                <FormField
                    name="team_id"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Team</FormLabel>
                            <FormControl>
                                <Popover open={teamPopoverOpen} onOpenChange={setTeamPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {teams.find((team) => team._id === field.value)?.name || "-- Chọn team --"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[550px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Tìm team" />
                                            <CommandList>
                                                <CommandEmpty>Không tìm thấy team.</CommandEmpty>
                                                <CommandGroup>
                                                    {teams.map((team) => (
                                                        <CommandItem
                                                            key={team._id}
                                                            value={team.name}
                                                            onSelect={() => {
                                                                form.setValue("team_id", team._id);
                                                                setTeamPopoverOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    field.value === team._id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {team.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Cập nhật người dùng</Button>
            </form>
        </Form>
    )
}
