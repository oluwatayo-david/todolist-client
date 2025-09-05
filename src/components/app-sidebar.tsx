import {  Home, Users,  LogOut, ChevronRight, User, Loader2 } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "./ui/sidebar"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible"

import { Skeleton } from "./ui/skeleton"
import {useGetTasks} from "../hooks/task/use-get-tasks.tsx";
import {Button} from "./ui/button.tsx";
import {useAuth} from "../hooks/use-auth.ts";
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },



]

export function AppSidebar() {
    const location = useLocation()
    const {task , loading} = useGetTasks()
const {logout}=useAuth()


    const isActive = (url: string) => {
        if (url === "/dashboard") {
            return location.pathname === "/dashboard"
        }
        return location.pathname.startsWith(url)
    }

    const isUsersActive = location.pathname.startsWith("/dashboard/task")

    return (
        <Sidebar collapsible={'icon'} variant={'sidebar'}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Regular menu items */}
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                            {/* Collapsible Users menu */}
                            <Collapsible
                                defaultOpen={isUsersActive}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip="Users"
                                            isActive={isUsersActive}
                                            className="w-full"
                                        >
                                            <Users />
                                            <span>Tasks</span>
                                            {loading && (
                                                <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                                            )}
                                            {!loading && (
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            )}
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {/*Tasks overview */}
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={location.pathname === "/dashboard/task"}
                                                >
                                                    <Link to="/dashboard">
                                                        <Users />
                                                        <span>All Tasks</span>
                                                        {!loading && (
                                                            <span className="ml-auto text-xs text-muted-foreground">
                                                                {task.length}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>

                                            {/* Loading state with skeleton loaders */}
                                            {loading && (
                                                <>
                                                    {[120, 100, 140, 110, 130].map((width, index) => (
                                                        <SidebarMenuSubItem key={`skeleton-${index}`}>
                                                            <SidebarMenuSubButton>
                                                                <Skeleton className={`h-4 w-[${width}px] shrink-0`} />
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </>
                                            )}

                                            {!loading && task.map((task , index) => (
                                                <SidebarMenuSubItem key={task?._id || index}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={location.pathname === `/dashboard/task/${task?._id}`}
                                                    >
                                                        <Link to={`/dashboard/task/${task?._id}`}>

                                                            <span>{task.name}</span>

                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}

                                            {/* Empty state */}
                                            {!loading && task.length === 0 && (
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuSubButton>
                                                        <User />
                                                        <span>No tasks found</span>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            )}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Button className={'flex flex-row gap-1 item-center'} variant={'outline'} onClick={logout} ><LogOut />
                                <span>Sign Out</span></Button>

                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}