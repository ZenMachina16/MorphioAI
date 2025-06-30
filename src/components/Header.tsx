"use client"

import ProfileDropdown from "./ProfileDropdown"

interface HeaderProps {
  title?: string
}

export default function Header({ title = "Content Repurposer" }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  )
} 