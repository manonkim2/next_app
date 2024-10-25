interface IProductsProps {}

const getProducts = async () => {
  await new Promise((res) => setTimeout(res, 10000))
}

const Products = async ({}: IProductsProps) => {
  const products = await getProducts()

  return <div>Products</div>
}

export default Products
