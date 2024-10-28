'use client'

import Button from '@/components/button'
import Input from '@/components/input'
import { PhotoIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { useFormState } from 'react-dom'
import { getUploadUrl, uploadProduct } from './actions'

const AddProductsPage = () => {
  const [preview, setPreview] = useState('')
  const [uploadUrl, setUploadUrl] = useState('')
  const [state, action] = useFormState(uploadProduct, null)

  // public 폴더에 업로드
  const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event

    if (!files) {
      return
    }

    const file = files[0]

    /**
     * @description
     * 1KB = 1024
     * 1024 * 1024 = 1MB
     * 1024 * 1024 * 1024 = 1GB
     * 1024 * 1024 * 1024 * 1024 = 1TB
     */
    const maxSize = 9 * 1024

    if (file.size > maxSize) {
      alert('9KB 이하의 사진을 업로드해주세요.')
      return
    }

    /**
     * @description 지정한 object(file)의 참조 URL을 담은 DOMString을 반환 -> 파일이 브라우저의 메모리에 업로드되었고, 페이지를 새로고침 할 때까지 저장되고있음 > 그 파일이 저장된 메모리의 url을 반환해주는 것!
     */
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  // cloudflare에 업로드
  const onChangeImageCloud = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      target: { files },
    } = event

    if (!files) {
      return
    }

    const file = files[0]
    const url = URL.createObjectURL(file)
    setPreview(url)

    const { success, result } = await getUploadUrl()
    if (success) {
      const { id, uploadUrl } = result
      setUploadUrl(uploadUrl)
    }
  }

  return (
    <div>
      <form className="flex flex-col gap-5 p-5" action={action}>
        <label
          htmlFor="photo"
          className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-300 bg-cover bg-center"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {!preview && (
            <>
              <PhotoIcon className="w-20" />
              <div>사진을 추가해주세요.</div>
              {state?.fieldErrors.photo}
            </>
          )}
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
          onChange={onChangeImage}
        />
        <Input
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          required
          placeholder="가격"
          type="number"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          required
          placeholder="상세설명"
          type="text"
          errors={state?.fieldErrors.description}
        />
        <Button text="작성완료" />
      </form>
    </div>
  )
}

export default AddProductsPage
