"use client"

import { useState, useEffect } from "react"
import { StatCards } from "./components/stat-cards"
import { DataTable } from "./components/data-table"
import { toast } from "sonner"
import { membersApi } from "@/lib/api/members"
import type { MemberStats } from "@/types"
import type { MemberEditFormValues } from "./components/member-edit-modal"

interface User {
  user_id: string
  name: string
  date_of_birth: string
  email: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

interface UserFormValues {
  name: string
  email: string
  date_of_birth: string
  phone?: string
  avatar_url?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const members = await membersApi.getAll()
        const memberList = Array.isArray(members) ? members : (members as { data?: MemberStats[] }).data || []
        const mappedUsers: User[] = (memberList as MemberStats[])
          .filter((member) => member.user_id) // Filter out members without user_id
          .map((member) => ({
            user_id: member.user_id,
            name: member.name,
            date_of_birth: member.date_of_birth,
            email: member.email || "",
            phone: member.phone,
            avatar_url: member.avatar_url,
            created_at: member.created_at,
            updated_at: member.updated_at,
          }))
        setUsers(mappedUsers)
      } catch (error) {
        console.error("Failed to fetch members:", error)
      }
    }
    fetchMembers()
  }, [])



  const handleAddUser = async (userData: UserFormValues) => {
    try {
      // Use the signup endpoint to create a new member
      // Note: This requires a password which should ideally be generated or provided
      const temporaryPassword = `temp${Date.now()}`; // Generate a temporary password
      
      const result = await membersApi.signup({
        name: userData.name,
        email: userData.email,
        password: temporaryPassword,
        dateOfBirth: userData.date_of_birth,
        phone: userData.phone,
      })

      // Add the new member to the local state
      const newUser: User = {
        user_id: result.member.user_id || result.member.id || Date.now().toString(),
        name: result.member.full_name || '',
        date_of_birth: result.member.date_of_birth,
        email: result.member.email || '',
        phone: result.member.phone,
        avatar_url: result.member.avatar_url,
        created_at: result.member.created_at || new Date().toISOString(),
        updated_at: result.member.updated_at || new Date().toISOString(),
      }
      setUsers(prev => [newUser, ...prev])
      toast.success('Member created successfully')
    } catch (error) {
      console.error("Failed to create member:", error)
      const errorMessage = error instanceof Error ? error.message.toLowerCase() : ''
      
      if (errorMessage.includes('duplicate') || errorMessage.includes('already exists') || errorMessage.includes('unique')) {
        if (errorMessage.includes('email')) {
          toast.error('A member with this email already exists')
        } else if (errorMessage.includes('phone')) {
          toast.error('A member with this phone number already exists')
        } else {
          toast.error('This member already exists')
        }
      } else {
        toast.error(`Failed to create member: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
      throw error
    }
  }

  const handleDeleteUser = (user_id: string) => {
    setUsers(prev => prev.filter(user => user.user_id !== user_id))
  }

  const handleEditUser = (user: User) => {
    // For now, just log the user to edit
    // In a real app, you'd open an edit dialog
    console.log("Edit user:", user)
  }

  const handleModifyMember = async (id: string, data: MemberEditFormValues) => {
    try {
      await membersApi.modify(id, data)
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.user_id === id 
          ? { ...user, ...data, updated_at: new Date().toISOString() }
          : user
      ))
      
      toast.success('Member updated successfully')
    } catch (error) {
      console.error("Failed to update member:", error)
      toast.error(`Failed to update member: ${error instanceof Error ? error.message : 'Unknown error'}`)
      throw error
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="@container/main px-4 lg:px-6">
        <StatCards />
      </div>
      
      <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
        <DataTable 
          users={users}
          onDeleteUser={handleDeleteUser}
          onEditUser={handleEditUser}
          onAddUser={handleAddUser}
          onModifyMember={handleModifyMember}
        />
      </div>
    </div>
  )
}
