import Image from 'next/image'
import Link from 'next/link'
import { formatToTimeAgo, formatToWon } from '@/lib/utils'

interface IListProductProps {
  title: string
  price: number
  created_at: Date
  photo: string
  id: number
}

const ListProduct = ({
  title,
  price,
  created_at,
  photo,
  id,
}: IListProductProps) => {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      <div className="relative size-28 overflow-hidden rounded-md">
        <Image src={photo} alt="product-img" fill />
      </div>
      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-lg">{title}</span>
        <span className="text-xs text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold">{formatToWon(price)} 원</span>
      </div>
    </Link>
  )
}

export default ListProduct
