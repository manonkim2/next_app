import TabBar from '@/components/tab-bar'
import React from 'react'

const TabLayout = ({ children }: { children: React.ReactNode }) => {
  // 해당 layout은 (tab) 폴더 안에서만 영향을 미침
  return (
    <div>
      {children}
      <TabBar />
    </div>
  )
}

export default TabLayout
