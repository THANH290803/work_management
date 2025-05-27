// import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
// import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
//   SidebarTrigger,
} from "@/components/ui/sidebar"
import { DetailProject } from "@/components/Comman/DetailProject"

export default function Page() {
  return (
    <SidebarProvider>
      {/* <AppSidebar /> */}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          {/* <SidebarTrigger className="-ml-1" /> */}
          {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/project">
                  Quản lý dự án
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Chi tiết dự án</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <div className="aspect-video rounded-xl bg-muted/50">
                <DetailProject />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50">
                <DetailProject />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50">
                <DetailProject />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50">
                <DetailProject />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
