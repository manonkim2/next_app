'use client'

import {
  HomeModernIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid'
import {
  HomeModernIcon as OutlineHomeModernIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  ChatBubbleLeftRightIcon as OutlineChatBubbleLeftRightIcon,
  ShoppingBagIcon as OutlineShoppingBagIcon,
  UserCircleIcon as OutlineUserCircleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TabBar = () => {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 mx-auto grid w-full max-w-screen-md grid-cols-5 border-t border-neutral-600 bg-neutral-900 px-5 py-3 *:text-white">
      <Link href="/products" className="flex flex-col items-center gap-px">
        {pathname === '/products' ? (
          <HomeModernIcon className="h-6 w-6" />
        ) : (
          <OutlineHomeModernIcon className="h-6 w-6" />
        )}
        <span>홈</span>
      </Link>
      <Link href="/life" className="flex flex-col items-center gap-px">
        {pathname === '/life' ? (
          <NewspaperIcon className="h-6 w-6" />
        ) : (
          <OutlineNewspaperIcon className="h-6 w-6" />
        )}
        <span>동네생활</span>
      </Link>
      <Link href="/chat" className="flex flex-col items-center gap-px">
        {pathname === '/chat' ? (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        ) : (
          <OutlineChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
        <span>채팅</span>
      </Link>
      <Link href="/shopping" className="flex flex-col items-center gap-px">
        {pathname === '/shopping' ? (
          <ShoppingBagIcon className="h-6 w-6" />
        ) : (
          <OutlineShoppingBagIcon className="h-6 w-6" />
        )}
        <span>쇼핑</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-px">
        {pathname === '/profile' ? (
          <UserCircleIcon className="h-6 w-6" />
        ) : (
          <OutlineUserCircleIcon className="h-6 w-6" />
        )}
        <span>나의 당근</span>
      </Link>
    </div>
  )
}

export default TabBar
