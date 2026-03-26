"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  tags: string;
}

export default function LandingPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Lead form state
  const [leadForm, setLeadForm] = useState({ name: "", phone: "", address: "", needs: "" });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState("");

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitting(true);
    setLeadError("");
    try {
      await api.post("/customers", {
        phoneNumber: leadForm.phone,
        name: leadForm.name,
        source: "Contact"
      });
      setLeadSuccess(true);
    } catch {
      setLeadError("Gửi thất bại. Vui lòng thử lại hoặc gọi trực tiếp 0966.245.396.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        // Chỉ lấy 3 dự án mới nhất cho trang chủ
        setProjects(response.data.slice(0, 3));
      } catch (error) {
        console.error("Lỗi fetch dự án:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);


  return (
    <div className="flex flex-col w-full overflow-hidden pb-16 md:pb-0">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden text-center text-white">
        <div className="absolute inset-0 bg-stone-900/60 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-top bg-no-repeat transform scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000')" }}
        />
        
        <div className="relative z-20 container mx-auto px-4">
          <span className="inline-block py-1 px-4 rounded-full bg-white/20 backdrop-blur-md text-sm font-semibold tracking-wider uppercase mb-6 border border-white/30 shadow-lg">
            Nội Thất NV Homes - Xưởng Gỗ Phúc Thọ
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.1] drop-shadow-2xl uppercase">
            Kiến Tạo <span className="text-red-500">Đẳng Cấp</span> <br className="hidden md:block"/> Cho Ngôi Nhà Bạn
          </h1>
          <p className="text-lg md:text-2xl text-stone-200 max-w-2xl mx-auto mb-10 font-bold drop-shadow-sm leading-relaxed">
            Thiết kế sáng tạo - Thi công tận tâm - Chất lượng từ tâm. <br/>
            Sở hữu không gian sống mơ ước với chi phí tối ưu từ xưởng sản xuất trực tiếp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/contact" className="px-10 py-5 bg-red-500 text-white hover:bg-red-600 rounded-full font-black uppercase tracking-widest transition-all transform hover:-translate-y-1 shadow-2xl">
              Nhận Báo Giá Ngay
            </Link>
            <Link href="/projects" className="px-10 py-5 bg-transparent border-2 border-white/50 text-white hover:bg-white/10 rounded-full font-black uppercase tracking-widest transition-all backdrop-blur-md">
              Xem Mẫu Thiết Kế
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Pain Points & Solutions */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-4">Tại sao chọn chúng tôi?</h2>
          <h3 className="text-4xl md:text-5xl font-black text-stone-900 mb-16 uppercase tracking-tighter">Giải Pháp <span className="text-stone-400">Trọn Gói</span> Hoàn Hảo</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-10 rounded-3xl bg-stone-50 border border-stone-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="text-4xl mb-6">🪵</div>
              <h3 className="text-2xl font-black text-stone-900 mb-4 uppercase tracking-tight">Vật Liệu Chuẩn An Cường</h3>
              <p className="text-stone-500 mb-8 leading-relaxed font-medium">Chúng tôi cam kết 100% sử dụng ván gỗ công nghiệp An Cường cao cấp, đảm bảo độ bền và an toàn sức khỏe cho cả gia đình.</p>
              <div className="border-t border-stone-200 pt-6 flex items-start gap-3">
                <span className="text-red-500 font-bold bg-red-50 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>
                <p className="text-sm text-stone-900 font-bold">Cam kết đền 200% nếu phát hiện gỗ giả.</p>
              </div>
            </div>

            <div className="p-10 rounded-3xl bg-stone-50 border border-stone-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="text-4xl mb-6">🏗️</div>
              <h3 className="text-2xl font-black text-stone-900 mb-4 uppercase tracking-tight">Xưởng Sản Xuất Trực Tiếp</h3>
              <p className="text-stone-500 mb-8 leading-relaxed font-medium">Sở hữu xưởng quy mô lớn tại Thanh Đa - Phúc Thọ, NV Homes giúp bạn tiết kiệm tới 30% chi phí do không qua trung gian.</p>
              <div className="border-t border-stone-200 pt-6 flex items-start gap-3">
                <span className="text-red-500 font-bold bg-red-50 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>
                <p className="text-sm text-stone-900 font-bold">Quản lý khép kín, đảm bảo đúng tiến độ.</p>
              </div>
            </div>

            <div className="p-10 rounded-3xl bg-stone-50 border border-stone-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="text-4xl mb-6">📐</div>
              <h3 className="text-2xl font-black text-stone-900 mb-4 uppercase tracking-tight">Thiết Kế Độc Bản</h3>
              <p className="text-stone-500 mb-8 leading-relaxed font-medium">Đội ngũ KTS dày dặn kinh nghiệm luôn lắng nghe và hiện thực hóa phong cách cá nhân của bạn vào từng góc nhỏ ngôi nhà.</p>
              <div className="border-t border-stone-200 pt-6 flex items-start gap-3">
                <span className="text-red-500 font-bold bg-red-50 p-1 rounded-full"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>
                <p className="text-sm text-stone-900 font-bold">Báo giá chi tiết, tuyệt đối không phát sinh.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Projects Section */}
      <section className="py-24 bg-stone-50" id="projects">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="text-left">
              <h2 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-4">Dự án thi công</h2>
              <h3 className="text-4xl md:text-5xl font-black text-stone-900 uppercase tracking-tighter leading-tight">Dấu Ấn <br/> <span className="text-stone-400">Kiến Trúc</span></h3>
            </div>
            <Link href="/projects" className="text-stone-900 font-black uppercase tracking-widest text-sm border-b-2 border-stone-900 pb-2 hover:text-red-500 hover:border-red-500 transition-all">
              Tất cả dự án ↗
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {loading ? (
              <div className="col-span-full py-20 text-center">
                 <div className="inline-block w-10 h-10 border-4 border-stone-200 border-t-red-500 rounded-full animate-spin"></div>
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`} className="group block">
                  <div className="aspect-[16/10] bg-stone-200 relative overflow-hidden rounded-[2rem] shadow-xl mb-6">
                    <img 
                      src={project.thumbnail || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800'} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-x-6 bottom-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                       <span className="bg-white/90 backdrop-blur text-stone-900 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Chi tiết dự án</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-stone-900 uppercase group-hover:text-red-500 transition-colors leading-tight">{project.title}</h3>
                  <p className="text-stone-400 font-black uppercase text-[10px] tracking-widest">{project.tags?.split(',')[0] || 'Modern Luxury'}</p>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-stone-400 font-medium italic border-2 border-dashed border-stone-200 rounded-[2rem] bg-white">
                Chưa có dự án nào được cập nhật.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Contact Form */}
      <section id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-stone-900 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
            
            <div className="w-full md:w-5/12 p-12 md:p-16 text-white relative z-10 border-r border-white/5">
              <h2 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-6">Liên hệ</h2>
              <h3 className="text-4xl font-black mb-8 uppercase tracking-tighter leading-tight">Bạn Đã <span className="text-stone-500">Sẵn Sàng</span> <br/> Thay Đổi?</h3>
              <p className="text-stone-400 mb-12 text-lg font-medium leading-relaxed">Để lại thông tin, chuyên gia của NV Homes sẽ liên hệ tư vấn và khảo sát hiện trạng miễn phí cho bạn.</p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Hotline 24/7</p>
                    <p className="text-xl font-black tracking-tight">0966.245.396</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">Xưởng sản xuất</p>
                    <p className="text-sm font-bold tracking-tight">Thanh Đa - Phúc Thọ - Hà Nội</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-7/12 p-12 md:p-16 bg-white/5 backdrop-blur-sm">
              {leadSuccess ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20">
                    <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h4 className="text-3xl font-black text-white mb-4 uppercase">Gửi Thành Công!</h4>
                  <p className="text-stone-400 font-medium mb-8">Chúng tôi sẽ liên hệ tư vấn cho bạn sau ít phút.</p>
                  <button onClick={() => setLeadSuccess(false)} className="text-red-500 font-black uppercase text-xs tracking-[0.2em]">Gửi lại yêu cầu</button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleLeadSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      className="w-full px-6 py-5 rounded-2xl border-none bg-white/10 text-white placeholder:text-stone-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all font-bold"
                      placeholder="Họ & Tên *"
                      value={leadForm.name}
                      onChange={e => setLeadForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                    <input
                      type="tel"
                      className="w-full px-6 py-5 rounded-2xl border-none bg-white/10 text-white placeholder:text-stone-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all font-bold"
                      placeholder="Số Điện Thoại *"
                      value={leadForm.phone}
                      onChange={e => setLeadForm(f => ({ ...f, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <input
                    type="text"
                    className="w-full px-6 py-5 rounded-2xl border-none bg-white/10 text-white placeholder:text-stone-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all font-bold"
                    placeholder="Địa chỉ dự án"
                    value={leadForm.address}
                    onChange={e => setLeadForm(f => ({ ...f, address: e.target.value }))}
                  />
                  <textarea
                    className="w-full px-6 py-5 rounded-2xl border-none bg-white/10 text-white placeholder:text-stone-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all font-bold resize-none"
                    placeholder="Nhu cầu: Vd: Thiết kế căn hộ 3 ngủ, 90m2..."
                    rows={4}
                    value={leadForm.needs}
                    onChange={e => setLeadForm(f => ({ ...f, needs: e.target.value }))}
                  />
                  {leadError && <p className="text-red-500 text-sm font-bold">{leadError}</p>}
                  <button
                    type="submit"
                    disabled={leadSubmitting}
                    className="w-full py-6 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {leadSubmitting ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Đang gửi...</>
                    ) : "Đăng Ký Tư Vấn Ngay"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-stone-200 z-50 md:hidden shadow-2xl">
        <Link href="tel:0966245396" className="w-full py-4 bg-red-500 text-white text-center rounded-xl font-black block shadow-xl uppercase tracking-widest text-sm active:scale-95 transition-transform">
          Liên Hệ Ngay: 0966.245.396
        </Link>
      </div>
    </div>
  );
}
