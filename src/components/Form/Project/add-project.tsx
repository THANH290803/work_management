"use client"

import * as React from "react"
import { useState } from 'react'
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useProjects } from "@/lib/useProject"

const formSchema = z.object({
  name: z.string().min(2, { message: "Tên dự án ít nhất 2 ký tự" }),
  description: z.union([z.string().min(5, { message: "Mô tả ít nhất 5 ký tự" }), z.literal("")]),

  company: z.string().min(1, { message: "Vui lòng chọn công ty" }),
  department: z.union([z.string().min(1, { message: "Vui lòng chọn phòng ban" }), z.literal("")]),
  team: z.union([z.string().min(1, { message: "Vui lòng chọn team" }), z.literal("")]),

  start_date: z.union([z.date(), z.null()]).refine(date => date instanceof Date || date === null, {
    message: "Vui lòng chọn ngày bắt đầu",
  }),
  end_date: z.union([z.date(), z.null()]).refine(date => date instanceof Date || date === null, {
    message: "Vui lòng chọn ngày kết thúc",
  }),
})


type FormData = z.infer<typeof formSchema>

export function AddProject() {
  const {
    companies,
    departments,
    teams,
    setSelectedCompany,
    setSelectedDepartment,
    setSelectedTeam, // ⬅️ add this
    handleAddProject,
    // newProjectData,
    setNewProjectData,
  } = useProjects();


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      company: "",
      department: "",
      team: "",
      start_date: null,
      end_date: null,
    },
  })

  const [openCompanyPopover, setOpenCompanyPopover] = useState(false);
  const [openDepartmentPopover, setOpenDepartmentPopover] = useState(false);
  const [openTeamPopover, setOpenTeamPopover] = useState(false);

  const onSubmit = (data: FormData) => {
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if (startDate && endDate && startDate >= endDate) {
      alert("Ngày kết thúc phải lớn hơn ngày bắt đầu.");
      return;
    }

    // Ensure department_id and team_id are set to empty string instead of null
    const departmentId = data.department || '';
    const teamId = data.team || '';

    setNewProjectData({
      name: data.name,
      description: data.description,
      company_id: data.company,
      department_id: departmentId,
      team_id: teamId,
      start_date: startDate ? startDate.toISOString() : '',
      end_date: endDate ? endDate.toISOString() : '',
      created_by: "",
    });

    handleAddProject();
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-[800px]">

        {/* Tên dự án */}
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

        {/* Công ty */}
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Công ty nhận dự án</FormLabel>
              <Popover open={openCompanyPopover} onOpenChange={setOpenCompanyPopover}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[800px] justify-between">
                    {companies.find(c => c._id === field.value)?.name || "-- Chọn công ty --"}
                    <ChevronDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[800px] p-0">
                  <Command>
                    <CommandInput placeholder="Tìm công ty" />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy</CommandEmpty>
                      <CommandGroup>
                        {companies.map(company => (
                          <CommandItem
                            key={company._id}
                            value={company._id}
                            onSelect={() => {
                              field.onChange(company._id)
                              setSelectedCompany(company._id)
                              setOpenCompanyPopover(false);
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phòng ban */}
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phòng ban</FormLabel>
              <Popover open={openDepartmentPopover} onOpenChange={setOpenDepartmentPopover}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[800px] justify-between">
                    {departments.find(d => d._id === field.value)?.name || "-- Chọn phòng ban --"}
                    <ChevronDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[800px] p-0">
                  <Command>
                    <CommandInput placeholder="Tìm phòng ban" />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy</CommandEmpty>
                      <CommandGroup>
                        {departments.map(department => (
                          <CommandItem
                            key={department._id}
                            value={department._id}
                            onSelect={() => {
                              field.onChange(department._id)
                              setSelectedDepartment(department._id)
                              setOpenDepartmentPopover(false);
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Team */}
        <FormField
          control={form.control}
          name="team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team</FormLabel>
              <Popover open={openTeamPopover} onOpenChange={setOpenTeamPopover}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[800px] justify-between">
                    {teams.find(t => t._id === field.value)?.name || "-- Chọn team --"}
                    <ChevronDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[800px] p-0">
                  <Command>
                    <CommandInput placeholder="Tìm team" />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy</CommandEmpty>
                      <CommandGroup>
                        {teams.map(team => (
                          <CommandItem
                            key={team._id}
                            value={team._id}
                            onSelect={() => {
                              field.onChange(team._id)
                              setSelectedTeam(team._id)
                              setOpenTeamPopover(false)
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ngày bắt đầu và kết thúc */}
        <div className="flex gap-4">

          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[390px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "dd-MM-yyyy") : "Chọn ngày bắt đầu"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      {...field}
                      selected={field.value ? field.value : undefined}  // Fallback to `undefined` when `field.value` is `null`
                      onSelect={field.onChange}
                      mode="single"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[390px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "dd-MM-yyyy") : "Chọn ngày kết thúc"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      {...field}
                      selected={field.value ?? undefined}  // Nullish coalescing to fallback to `undefined`
                      onSelect={field.onChange}
                      mode="single"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Mô tả */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập mô tả dự án" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="float-right">Lưu</Button>
      </form>
    </Form>
  )
}
