"use client"

import * as React from "react"
import {
  LayoutPanelLeft,
  LayoutDashboard,
  Mail,
  CheckSquare,
  MessageCircle,
  ShieldUser,
  Calendar,
  Shield,
  AlertTriangle,
  NotebookPen,
  Settings,
  HelpCircle,
  CreditCard,
  LayoutTemplate,
  Users,
  Car,
  ChartLine,
  User,
  BadgeDollarSign,
  Wallet,
} from "lucide-react"
import Link from "next/link" 
import Image from "next/image"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navGroups: [
    {
      label: "Dashboards",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutPanelLeft,
        },
      ],
    },
    {
      label: "Apps",
      items: [ 
        {
          title: "My Cars",
          url: "/my-cars",
          icon: Car,
        },  
        {
          title: "Car Sales",
          url: "/car-sales",
          icon: BadgeDollarSign,
        },
        {
          title: "My Funds",
          url: "/funds",
          icon: Wallet,
        },
      ],
    },
     {
      label: "Utilities",
      items: [
 
        {
          title: "Tasks",
          url: "/tasks",
          icon: CheckSquare,
        },
        {
          title: "FAQS",
          url: "/faqs",
          icon: HelpCircle,
        }, 
 
      ],
    },
     {
      label: "Pages",
      items: [
         
       /* {
          title: "Auth Pages",
          url: "#",
          icon: Shield,
          items: [
            {
              title: "Sign In 2",
              url: "/sign-in-2",
            },
            {
              title: "Sign In 3",
              url: "/sign-in-3",
            },
            {
              title: "Sign Up 3",
              url: "/sign-up-3",
            },
            {
              title: "Members Forgot Password Page",
              url: "/forgot-password-3",
            }
          ],
        }, */
        {
          title: "Settings",
          url: "#",
          icon: Settings,
          items: [   
            {
              title: "Account Settings",
              url: "/settings/account",
            }, 
            {
              title: "Appearance",
              url: "/settings/appearance",
            },  
          ],
        }, 
      ],
    },
 
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "Loading...",
    email: "Loading...",
    avatar: "",
  })

  React.useEffect(() => {
    const fetchMember = () => {
      if (typeof window !== 'undefined') {
        const memberData = localStorage.getItem('member_user')
        if (memberData) {
          try {
            const member = JSON.parse(memberData)
            setUser({
              name: member.name || member.full_name || member.email?.split('@')[0] || "Member",
              email: member.email || "No email",
              avatar: member.avatar_url || "",
            })
          } catch (error) {
            console.error('Error parsing member data:', error)
          }
        }
      }
    }

    fetchMember()
  }, [])

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex    items-center justify-center rounded-lg  ">
                    <Image 
                                                       src="https://xqqbnlsmqrgwgscuigwi.supabase.co/storage/v1/object/sign/platform%20images/Logo.avif?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kMmM4MjVjNi1lN2E0LTQ3NTktYTU3ZS1lMTgzZGZmMWRlNjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGF0Zm9ybSBpbWFnZXMvTG9nby5hdmlmIiwiaWF0IjoxNzY3NjYxOTY1LCJleHAiOjIwODMwMjE5NjV9.jUvcTAjonyLEPTrf8-QNfVxeNOLeHHw3CNjieuyrU7o"
                                                        alt="TCTPro Logo"
                                                        width={50}
                                                        height={50}
                                                       />
                </div>
                
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter> 
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
