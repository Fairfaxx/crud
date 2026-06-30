'use client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type ProductCategory = 'Electronics' | 'Books' | 'Clothing';

type AllCategories = 'all' | ProductCategory;

type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro',
    category: 'Electronics',
    price: 2500,
    stock: 4,
  },
  {
    id: '2',
    name: 'Clean Code',
    category: 'Books',
    price: 35,
    stock: 12,
  },
  {
    id: '3',
    name: 'Nike Hoodie',
    category: 'Clothing',
    price: 80,
    stock: 7,
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [newProduct, setNewProduct] = useState<Product>({
    id: uuidv4(),
    name: '',
    category: 'Electronics',
    price: 0,
    stock: 0,
  });

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<AllCategories>('all');
  const [sort, setSort] = useState(false);
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setNewProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newProduct.name) return;
    if (newProduct.price < 0) return;
    if (newProduct.stock < 0) return;

    setProducts((prev) => [...prev, newProduct]);
    setNewProduct({
      id: uuidv4(),
      name: '',
      category: 'Electronics',
      price: 0,
      stock: 0,
    });
  }

  function handleDelete(id: string) {
    setProducts(products.filter((prod) => prod.id !== id));
  }

  function handleEdit(id: string) {
    const editProduct = products.find((prod) => prod.id === id);
    if (editProduct) setNewProduct({ ...editProduct });
  }

  function toggleFavorite(id: string) {
    setFavoriteProductIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  }

  const filteredProducts = products
    .filter((prod) => {
      const matchingProd = prod.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCategory =
        category === 'all' ? true : prod.category === category;

      return matchingProd && matchesCategory;
    })
    .sort((a, b) => {
      if (!sort) return 0;

      return a.name.localeCompare(b.name);
    });

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div>
          <h3>Find a product by name:</h3>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <h3>Find a product by category:</h3>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value as AllCategories)}
          />
          <button onClick={() => setSort(!sort)}>Sort by Name</button>
          <h3>Search by category:</h3>
          <select
            name="category"
            value={newProduct.category}
            onChange={handleChange}
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Clothing">Clothing</option>
          </select>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Product: </label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
            />
            <label htmlFor="category">Category: </label>
            <input
              type="text"
              name="category"
              value={newProduct.category}
              onChange={handleChange}
            />
            <label htmlFor="price">Price: </label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleChange}
            />
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              name="stock"
              value={newProduct.stock}
              onChange={handleChange}
            />
            <button type="submit">Add</button>
          </form>
        </div>
        <div>
          <ul>
            <h3>Total Products: {products.length}</h3>
            {filteredProducts.map((product) => {
              const isFavorite = favoriteProductIds.includes(product.id);
              return (
                <div key={product.id}>
                  <li className="my-1.5">
                    Name: {product.name} - Category: {product.category} - $
                    {product.price} - Stock: {product.stock}{' '}
                    {product.stock < 5 ? 'Low Stock' : ''} -{' '}
                    <button
                      className="border border-red-500 rounded-2xl p-1 mx-1.5"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete product
                    </button>
                    <button
                      className="border border-blue-500 rounded-2xl p-1 mx-1.5"
                      onClick={() => handleEdit(product.id)}
                    >
                      Edit product
                    </button>
                    <button
                      className="border border-green-500 rounded-2xl p-1 mx-1.5"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      {isFavorite
                        ? 'Remove from Favorites ❤️'
                        : 'Add to Favorites 🤍'}
                    </button>
                  </li>
                </div>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );
}
