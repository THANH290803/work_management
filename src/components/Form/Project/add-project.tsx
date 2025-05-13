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
  description: z.string().min(5, { message: "Mô tả ít nhất 5 ký tự" }),
  company: z.string().min(1, { message: "Vui lòng chọn công ty" }),
  department: z.string().min(1, { message: "Vui lòng chọn phòng ban" }),
  team: z.string().min(1, { message: "Vui lòng chọn team" }),
  start_date: z.date({ required_error: "Vui lòng chọn ngày bắt đầu" }),
  end_date: z.date({ required_error: "Vui lòng chọn ngày kết thúc" }),
})

type FormData = z.infer<typeof formSchema>

export function AddProject() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      company: "",
      department: "",
      team: "",
      start_date: undefined,
      end_date: undefined,
    },
  })

  const {
    companies,
    departments,
    teams,
    setSelectedCompany,
    setSelectedDepartment,
    setSelectedTeam,
  } = useProjects()

  const onSubmit = (data: FormData) => {
    console.log("Dữ liệu gửi lên:", {
      ...data,
      start_date: format(data.start_date, "yyyy-MM-dd"),
      end_date: format(data.end_date, "yyyy-MM-dd"),
    })
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
              <Popover>
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
              <Popover>
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
              <Popover>
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
          {/* Ngày bắt đầu */}
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
                    <Calendar selected={field.value} onSelect={field.onChange} mode="single" />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngày kết thúc */}
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
                    <Calendar selected={field.value} onSelect={field.onChange} mode="single" />
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
