import { useEffect, useState } from "react";
import Modal from "../common/Modal";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
  rating: "4.5",
  bestSeller: false,
  featured: false,
};

export default function ProductFormModal({ open, product, categories, onClose, onSave, saving }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: String(product.price ?? ""),
        category: product.category || "",
        image: product.image || "",
        stock: String(product.stock ?? ""),
        rating: String(product.rating ?? "4.5"),
        bestSeller: Boolean(product.bestSeller),
        featured: Boolean(product.featured),
      });
    } else {
      setForm({ ...EMPTY, category: categories[0]?.slug || "" });
    }
  }, [product, open, categories]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price) || 0,
      category: form.category,
      image: form.image.trim(),
      stock: parseInt(form.stock, 10) || 0,
      rating: parseFloat(form.rating) || 0,
      bestSeller: form.bestSeller,
      featured: form.featured,
    });
  }

  return (
    <Modal open={open} onClose={onClose} title={product ? "Edit Product" : "Add Product"} width={560}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Product Name</label>
          <input className="form-control" required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>

        <div className="grid grid-2" style={{ gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Price ($)</label>
            <input type="number" step="0.01" min="0" className="form-control" required value={form.price} onChange={(e) => update("price", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Stock</label>
            <input type="number" min="0" className="form-control" required value={form.stock} onChange={(e) => update("stock", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" required value={form.category} onChange={(e) => update("category", e.target.value)}>
              <option value="" disabled>Select category</option>
              {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Rating (0–5)</label>
            <input type="number" step="0.1" min="0" max="5" className="form-control" value={form.rating} onChange={(e) => update("rating", e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input className="form-control" required value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." />
        </div>

        <div className="grid grid-2" style={{ gap: 16, marginBottom: 20 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: "0.9rem" }}>
            <input type="checkbox" checked={form.bestSeller} onChange={(e) => update("bestSeller", e.target.checked)} />
            Best Seller
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: "0.9rem" }}>
            <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
            Featured
          </label>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
            {saving ? "Saving..." : product ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
