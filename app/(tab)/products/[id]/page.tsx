const getProduct = async () => {
  await new Promise((res) => setTimeout(res, 10000))
}

const ProductDetail = async ({
  params: { id },
}: {
  params: { id: string }
}) => {
  const product = await getProduct()

  return <div>{id}</div>
}

export default ProductDetail
