import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { CategoryIcon } from "../common/categoryIcons";

const ICON_OPTIONS = ["cleanser", "moisturizer", "serum", "sunscreen", "makeup", "spa", "hair"];

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoryFormModal({ open, category, onClose, onSave, saving }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setSlug(category.slug || "");
      setIcon(category.icon || ICON_OPTIONS[0]);
      setSlugTouched(true);
    } else {
      setName("");
      setSlug("");
      setIcon(ICON_OPTIONS[0]);
      setSlugTouched(false);
    }
  }, [category, open]);

  function handleNameChange(value) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ name: name.trim(), slug: slugify(slug), icon });
  }

  return (
    <Modal open={open} onClose={onClose} title={category ? "Edit Category" : "Add Category"} width={460}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Category Name</label>
          <input className="form-control" required value={name} onChange={(e) => handleNameChange(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Slug</label>
          <input
            className="form-control"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Icon</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ICON_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setIcon(opt)}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: icon === opt ? "2px solid var(--color-primary)" : "1.5px solid var(--color-border)",
                  background: icon === opt ? "var(--color-cream)" : "var(--color-white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--color-primary-dark)",
                  fontSize: "1.1rem",
                }}
                aria-label={opt}
              >
                <CategoryIcon icon={opt} />
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 20 }}>
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
            {saving ? "Saving..." : category ? "Save Changes" : "Add Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
