import { useMemo, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiDatabase } from "react-icons/fi";
import { useCatalog } from "../../context/CatalogContext";
import { useToast } from "../../context/ToastContext";
import { addProduct, updateProduct, deleteProduct, seedProductsBatch } from "../../services/productService";
import { seedCategoriesBatch } from "../../services/categoryService";
import { seedProducts } from "../../data/seedProducts";
import { categories as seedCategories } from "../../data/categories";
import SearchBar from "../../components/common/SearchBar";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ProductFormModal from "../../components/admin/ProductFormModal";
import EmptyState from "../../components/common/EmptyState";
import Loading from "../../components/common/Loading";

export default function ProductsAdmin() {
  const { products, categories, loading } = useCatalog();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const term = search.trim().toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
  }, [products, search]);

  function openAddModal() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function openEditModal(product) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  async function handleSave(data) {
    setSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        showToast("Product updated successfully.");
      } else {
        await addProduct(data);
        showToast("Product added successfully.");
      }
      setModalOpen(false);
    } catch {
      showToast("Couldn't save the product. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteProduct(deletingProduct.id);
      showToast("Product deleted.");
    } catch {
      showToast("Couldn't delete the product. Please try again.", "error");
    } finally {
      setDeletingProduct(null);
    }
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      if (categories.length === 0) await seedCategoriesBatch(seedCategories);
      await seedProductsBatch(seedProducts);
      showToast("Sample catalog seeded successfully.");
    } catch {
      showToast("Couldn't seed sample data. Check your Firestore setup.", "error");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div>
      <div className="admin-toolbar">
        <h1 style={{ margin: 0 }}>Products</h1>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
          <button className="btn btn-primary btn-sm" onClick={openAddModal}>
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <Loading label="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<FiDatabase />}
          title="No products yet"
          message="Seed the starter catalog migrated from the original Miss Sunflower site, or add your first product manually."
          action={
            <button className="btn btn-primary btn-sm" onClick={handleSeed} disabled={seeding}>
              {seeding ? "Seeding..." : "Seed Sample Data"}
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState title="No matches" message="Try a different search term." />
      ) : (
        <div className="card" style={{ padding: 8, overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td><img src={product.image} alt={product.name} /></td>
                  <td>{product.name}</td>
                  <td>{categories.find((c) => c.slug === product.category)?.name || product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock <= 0 ? <span className="badge" style={{ background: "var(--color-error)", color: "#fff" }}>Out</span> : product.stock}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button onClick={() => openEditModal(product)} aria-label="Edit"><FiEdit2 /></button>
                      <button className="danger" onClick={() => setDeletingProduct(product)} aria-label="Delete"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductFormModal
        open={modalOpen}
        product={editingProduct}
        categories={categories}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deletingProduct)}
        title="Delete product?"
        message={`Are you sure you want to delete "${deletingProduct?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeletingProduct(null)}
      />
    </div>
  );
}
