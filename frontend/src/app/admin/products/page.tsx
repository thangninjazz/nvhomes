"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Modal } from "@/components/common/Modal";

export default function ProductManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: "",
    originalPrice: 0,
    discountPrice: 0,
    description: "",
    images: ""
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err: any) {
      console.error("Lỗi fetch sản phẩm:", err);
      const msg = err.response?.data?.message || err.message || "Không thể tải danh sách sản phẩm.";
      alert("Lỗi: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/tree');
      // Làm phẳng cây danh mục để chọn trong dropdown
      const flattened: any[] = [];
      const flatten = (items: any[]) => {
        items.forEach(cat => {
          flattened.push(cat);
          if (cat.children && cat.children.length > 0) {
            flatten(cat.children);
          }
        });
      };
      flatten(res.data);
      setCategories(flattened);
    } catch (err) {
      console.error("Lỗi fetch danh mục:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: "", slug: "", categoryId: "", originalPrice: 0, discountPrice: 0, description: "", images: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      categoryId: item.categoryId || "",
      originalPrice: item.originalPrice || 0,
      discountPrice: item.discountPrice || 0,
      description: item.description || "",
      images: item.images || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Vui lòng chọn danh mục.");
      return;
    }

    try {
      if (editingItem) {
        await api.put(`/products/${editingItem.id}`, formData);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await api.post('/products', formData);
        alert("Thêm sản phẩm mới thành công!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error("Lỗi lưu sản phẩm:", err);
      const msg = err.response?.data?.message || err.response?.data || err.message || "Đã có lỗi xảy ra.";
      alert("Lỗi: " + (typeof msg === 'string' ? msg : JSON.stringify(msg)));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await api.delete(`/products/${id}`);
        alert("Xóa sản phẩm thành công!");
        fetchProducts();
      } catch (err: any) {
        console.error("Lỗi xóa sản phẩm:", err);
        const msg = err.response?.data?.message || err.message || "Không thể xóa sản phẩm.";
        alert("Lỗi: " + msg);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">Quản Lý Sản Phẩm (E-Commerce)</h1>
            <p className="text-stone-500 font-medium">Hỗ trợ tính toán % giảm giá tự động và quản lý kho hàng chuẩn SEO.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-stone-900 text-white px-7 py-3.5 rounded-xl font-bold tracking-wide uppercase text-sm hover:bg-black shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-all flex items-center gap-2"
        >
          <span>+ Thêm Sản Phẩm</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-stone-100 flex gap-4 bg-stone-50/30">
            <input type="text" placeholder="Tìm kiếm tên sản phẩm..." className="flex-1 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all font-medium text-stone-700 bg-white" />
        </div>
        
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-stone-50 text-stone-400 font-black text-[10px] uppercase tracking-widest border-b border-stone-100">
                    <th className="p-6">Tên Sản Phẩm / Hình ảnh</th>
                    <th className="p-6">Phân Loại (Category)</th>
                    <th className="p-6 text-right">Giá Bán Cấu Hình</th>
                    <th className="p-6 text-center w-40">Thao Tác</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
                {loading ? (
                    <tr>
                        <td colSpan={4} className="p-10 text-center text-stone-400 font-medium">Đang tải danh sách...</td>
                    </tr>
                ) : products.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="p-10 text-center text-stone-400 font-medium">Không có sản phẩm nào.</td>
                    </tr>
                ) : products.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors group">
                        <td className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-stone-100 rounded-xl shrink-0 border border-stone-200 overflow-hidden">
                                  {p.images && <img src={p.images} alt={p.name} className="w-full h-full object-cover" />}
                                </div>
                                <span className="font-bold text-stone-800 line-clamp-2">{p.name}</span>
                            </div>
                        </td>
                        <td className="p-6">
                            <span className="bg-stone-100 border border-stone-200 text-stone-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
                              {p.categoryName || categories.find(c => c.id === p.categoryId)?.name || 'Chưa phân loại'}
                            </span>
                        </td>
                        <td className="p-6">
                            <div className="flex flex-col items-end">
                                <span className="font-black text-red-600 text-lg tracking-tight">{p.discountPrice ? p.discountPrice.toLocaleString('vi-VN') : p.originalPrice.toLocaleString('vi-VN')} đ</span>
                                {p.discountPrice > 0 && p.discountPrice < p.originalPrice && (
                                    <span className="text-[10px] text-stone-400 font-bold line-through">{p.originalPrice.toLocaleString('vi-VN')} đ</span>
                                )}
                            </div>
                        </td>
                        <td className="p-6">
                           <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openEditModal(p)}
                              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            >
                              Sửa
                            </button>
                            <button 
                              onClick={() => handleDelete(p.id)}
                              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            >
                              Xóa
                            </button>
                           </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Tên Sản Phẩm</label>
              <input 
                type="text" 
                required
                className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Đường Dẫn SEO (Slug)</label>
              <input 
                type="text" 
                required
                className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Danh Mục</label>
              <select 
                required
                className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Chọn danh mục...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Giá Gốc (VNĐ)</label>
              <input 
                type="number" 
                className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold text-red-600"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Giá Giảm (Nếu có)</label>
              <input 
                type="number" 
                className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Link Hình Ảnh (URL)</label>
            <input 
              type="text" 
              className="w-full bg-stone-50 border border-stone-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-bold"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Mô Tả Sản Phẩm</label>
            <textarea 
              className="w-full bg-stone-50 border border-stone-200 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium min-h-[120px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="pt-8 border-t border-stone-100 flex gap-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-4 bg-stone-100 text-stone-500 font-bold rounded-2xl hover:bg-stone-200 uppercase tracking-widest text-[11px]"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="flex-[2] py-4 bg-stone-900 text-white font-black rounded-2xl hover:bg-black uppercase tracking-widest text-[11px] shadow-xl"
            >
              Xác Nhận Lưu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

