import { useMemo, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useCatalog } from "../../context/CatalogContext";
import { useToast } from "../../context/ToastContext";
import { addCategory, updateCategory, deleteCategory, seedCategoriesBatch } from "../../services/categoryService";
import { categories as seedCategoryData } from "../../data/categories";
import { CategoryIcon } from "../../components/common/categoryIcons";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import CategoryFormModal from "../../components/admin/CategoryFormModal";
import EmptyState from "../../components/common/EmptyState";
import Loading from "../../components/common/Loading";

export default function CategoriesAdmin() {
  const { categories, products, loading } = useCatalog();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const productCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  function openAddModal() {
    setEditingCategory(null);
    setModalOpen(true);
  }

  function openEditModal(category) {
    setEditingCategory(category);
    setModalOpen(true);
  }

  async function handleSave(data) {
    setSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        showToast("Category updated successfully.");
      } else {
        await addCategory(data);
        showToast("Category added successfully.");
      }
      setModalOpen(false);
    } catch {
      showToast("Couldn't save the category. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteCategory(deletingCategory.id);
      showToast("Category deleted.");
    } catch {
      showToast("Couldn't delete the category. Please try again.", "error");
    } finally {
      setDeletingCategory(null);
    }
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      await seedCategoriesBatch(seedCategoryData);
      showToast("Sample categories seeded successfully.");
    } catch {
      showToast("Couldn't seed categories. Check your Firestore setup.", "error");
    } finally {
      setSeeding(false);
    }
  }

  const linkedCount = deletingCategory ? productCounts[deletingCategory.slug] || 0 : 0;

  return (
    <div>
      <div className="admin-toolbar">
        <h1 style={{ margin: 0 }}>Categories</h1>
        <button className="btn btn-primary btn-sm" onClick={openAddModal}>
          <FiPlus /> Add Category
        </button>
      </div>

      {loading ? (
        <Loading label="Loading categories..." />
      ) : categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          message="Seed the starter category set, or add your own."
          action={
            <button className="btn btn-primary btn-sm" onClick={handleSeed} disabled={seeding}>
              {seeding ? "Seeding..." : "Seed Sample Categories"}
            </button>
          }
        />
      ) : (
        <div className="card" style={{ padding: 8, overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Slug</th>
                <th>Products</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <span style={{ display: "inline-flex", width: 36, height: 36, borderRadius: "50%", background: "var(--color-cream)", alignItems: "center", justifyContent: "center", color: "var(--color-primary-dark)" }}>
                      <CategoryIcon icon={cat.icon} />
                    </span>
                  </td>
                  <td>{cat.name}</td>
                  <td>{cat.slug}</td>
                  <td>{productCounts[cat.slug] || 0}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button onClick={() => openEditModal(cat)} aria-label="Edit"><FiEdit2 /></button>
                      <button className="danger" onClick={() => setDeletingCategory(cat)} aria-label="Delete"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CategoryFormModal
        open={modalOpen}
        category={editingCategory}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deletingCategory)}
        title="Delete category?"
        message={
          linkedCount > 0
            ? `${linkedCount} product${linkedCount === 1 ? "" : "s"} currently use "${deletingCategory?.name}". They'll keep their category tag, but it won't match a listed category until reassigned. Delete anyway?`
            : `Are you sure you want to delete "${deletingCategory?.name}"?`
        }
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeletingCategory(null)}
      />
    </div>
  );
}
