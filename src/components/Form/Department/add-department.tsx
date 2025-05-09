"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Define Zod schema for validation
const formSchema = z.object({
    name: z.string().min(1, { message: "Bạn không được để trống tên công ty" }),
    company_id: z.string().min(1, { message: "Vui lòng chọn công ty" }),
})

type Company = {
    _id: string
    name: string
    is_headquarter: boolean
    phone: string
    email: string
}

export function AddDepartment() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", company_id: "" },
    })

    const onSubmit = async (data: { name: string, company_id: string }) => {
        console.log("Form values:", data)
    
        // Get token from localStorage
        const token = localStorage.getItem("token")
    
        if (!token) {
            console.error("No token found in localStorage!")
            return
        }
    
        try {
            const response = await fetch("https://qthl-group.onrender.com/api/department/post", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    company_id: data.company_id,
                }),
            })
    
            if (!response.ok) {
                const errorData = await response.json()
                console.error("Error response from server:", errorData)
                throw new Error(`Failed to add department: ${errorData.message || response.statusText}`)
            }
    
            const result = await response.json()
            console.log("Department added successfully:", result)
            window.location.href = "/department"
        } catch (error) {
            console.error("Error adding department:", error)
        }
    }

    const [companies, setCompanies] = useState<Company[]>([])

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem("token")

                if (!token) {
                    console.error("No token found in localStorage!")
                    return
                }

                const response = await fetch("https://qthl-group.onrender.com/api/company", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch companies: ${response.statusText}`)
                }

                const data = await response.json()
                setCompanies(data)
            } catch (error) {
                console.error("Error fetching companies:", error)
            }
        }

        fetchCompanies()
    }, [])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên phòng ban</FormLabel>
                            <FormControl className="w-[550px]">
                                <Input placeholder="Nhập tên phòng ban" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="company_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Công ty trực thuộc</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-[550px]">
                                        <SelectValue placeholder="Chọn công ty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.length === 0 ? (
                                            <SelectItem value="0" disabled>
                                                No companies available
                                            </SelectItem>
                                        ) : (
                                            companies.map((company) => (
                                                <SelectItem key={company._id} value={company._id}>
                                                    {company.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" style={{ float: 'right' }}>Submit</Button>
            </form>
        </Form>
    )
}
