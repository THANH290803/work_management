"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from "@/components/ui/command"
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useProjects } from "@/lib/useProject"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Project name must be at least 2 characters.",
    }),
    description: z.string().min(5, {
        message: "Project description must be at least 5 characters.",
    }),
    company: z.string(),
    department: z.string(),
    team: z.string(),
    start_date: z.string(),
    end_date: z.string(),
})

type FormData = z.infer<typeof formSchema>;

export function AddProject() {
    const form = useForm({
        resolver: zodResolver(formSchema),
    })

    const [dateStart, setDateStart] = React.useState<Date>();
    const [dateEnd, setDateEnd] = React.useState<Date>();

    const [openCompany, setOpenCompany] = React.useState(false);
    const [openDepartment, setOpenDepartment] = React.useState(false);
    const [openTeam, setOpenTeam] = React.useState(false);

    const [companyValue, setCompanyValue] = React.useState<string>("");
    const [departmentValue, setDepartmentValue] = React.useState<string>("");
    const [teamValue, setTeamValue] = React.useState<string>("");

    const {
        companies,
        departments,
        teams,
        // selectedCompany,
        setSelectedCompany,
        // selectedDepartment,
        setSelectedDepartment,
        // selectedTeam,
        setSelectedTeam,
    } = useProjects();

    const onSubmit = (data: FormData) => {
        console.log("Form Data:", data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[800px]">
                {/* Project Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên dự án</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập tên dự án" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Company Select */}
                <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Công ty nhận dự án</FormLabel>
                            <Popover open={openCompany} onOpenChange={setOpenCompany}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCompany}
                                        className="w-[800px] justify-between"
                                        {...field}
                                    >
                                        {companyValue || "-- Chọn công ty đảm nhiệm dự án --"}
                                        {openCompany ? <ChevronUp className="opacity-50" /> : <ChevronDown className="opacity-50" />}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[800px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Tìm kiếm công ty" className="h-9" />
                                        <CommandList>
                                            <CommandEmpty>No company found.</CommandEmpty>
                                            <CommandGroup>
                                                {companies.map((company) => (
                                                    <CommandItem
                                                        key={company._id}
                                                        value={company._id}
                                                        onSelect={(currentValue) => {
                                                            setSelectedCompany(currentValue);
                                                            setCompanyValue(company.name);
                                                            setOpenCompany(false);
                                                        }}
                                                    >
                                                        {company.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                />

                {/* Department Select */}
                <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phòng ban nhận dự án</FormLabel>
                            <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openDepartment}
                                        className="w-[800px] justify-between"
                                        {...field}
                                    >
                                        {departmentValue || "-- Phòng ban đảm nhiệm dự án --"}
                                        {openDepartment ? <ChevronUp className="opacity-50" /> : <ChevronDown className="opacity-50" />}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[800px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Tìm kiếm phòng ban" className="h-9" />
                                        <CommandList>
                                            <CommandEmpty>No department found.</CommandEmpty>
                                            <CommandGroup>
                                                {departments.map((department) => (
                                                    <CommandItem
                                                        key={department._id}
                                                        value={department._id}
                                                        onSelect={(currentValue) => {
                                                            setSelectedDepartment(currentValue);
                                                            setDepartmentValue(department.name);
                                                            setOpenDepartment(false);
                                                        }}
                                                    >
                                                        {department.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                />

                {/* Team Select */}
                <FormField
                    control={form.control}
                    name="team"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Team làm dự án</FormLabel>
                            <Popover open={openTeam} onOpenChange={setOpenTeam}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openTeam}
                                        className="w-[800px] justify-between"
                                        {...field}
                                    >
                                        {teamValue || "-- Chọn Team đảm nhiệm dự án --"}
                                        {openTeam ? <ChevronUp className="opacity-50" /> : <ChevronDown className="opacity-50" />}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[800px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Tìm kiếm dự án" className="h-9" />
                                        <CommandList>
                                            <CommandEmpty>No team found.</CommandEmpty>
                                            <CommandGroup>
                                                {teams.map((team) => (
                                                    <CommandItem
                                                        key={team._id}
                                                        value={team._id}
                                                        onSelect={(currentValue) => {
                                                            setSelectedTeam(currentValue);
                                                            setTeamValue(team.name);
                                                            setOpenTeam(false);
                                                        }}
                                                    >
                                                        {team.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    {/* Start Date */}
                    <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày bắt đầu</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className="w-[390px] justify-start text-left font-normal" {...field}>
                                            <CalendarIcon />
                                            {dateStart ? format(dateStart, "dd-MM-yyyy") : <span>Chọn ngày bắt đầu dự án</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={dateStart} onSelect={setDateStart} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />

                    {/* End Date */}
                    <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày kết thúc</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className="w-[390px] justify-start text-left font-normal" {...field}>
                                            <CalendarIcon />
                                            {dateEnd ? format(dateEnd, "dd-MM-yyyy") : <span>Chọn ngày kết thúc dự án</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={dateEnd} onSelect={setDateEnd} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Project Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả dự án</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Nhập mô tả dự án" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" style={{ float: 'right' }}>Lưu</Button>
            </form>
        </Form>
    )
}
