import React from 'react'

const HomeLayout = ({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) => {
  return (
    <>
      {children}
      {modal}
    </>
  )
}

export default HomeLayout
