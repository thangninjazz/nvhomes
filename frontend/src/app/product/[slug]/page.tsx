"use client";

import { useState, use } from 'react';
import Link from 'next/link';
import PhoneModal from '@/components/modals/PhoneModal';
import { useRouter } from 'next/navigation';

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean, title: string, source: string}>({
    isOpen: false,
    title: "",
    source: ""
  });

  const images = [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1080',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1080',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1080'
  ];

  const handleAddToCart = () => {
    // Lưu sản phẩm vào localStorage (giả lập giỏ hàng)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({
      id: slug, // Trong thực tế dùng id thật từ API
      name: slug.replace(/-/g, ' '),
      price: 12000000,
      image: images[0]
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Hiện modal thu thập SĐT
    setModalConfig({
      isOpen: true,
      title: "Thêm vào giỏ hàng",
      source: "Cart"
    });
  };

  const handleConsult = () => {
    setModalConfig({
      isOpen: true,
      title: "Tư vấn thiết kế",
      source: "Consultation"
    });
  };

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex text-xs text-stone-400 font-bold mb-10 uppercase tracking-widest">
            <Link href="/" className="hover:text-stone-900 transition-colors">Trang Chủ</Link>
            <span className="mx-3">/</span>
            <Link href="/category/van-phong" className="hover:text-stone-900 transition-colors">Sản Phẩm</Link>
            <span className="mx-3">/</span>
            <span className="text-stone-900 truncate max-w-[200px]">{slug.replace(/-/g, ' ')}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
            {/* Left: Product Image Gallery */}
            <div className="space-y-6">
                <div className="aspect-[4/5] md:aspect-square bg-stone-50 rounded-[2rem] overflow-hidden shadow-sm border border-stone-100 flex items-center justify-center relative group">
                    <img src={images[activeImage]} alt="Product view" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-6 left-6 z-10 bg-red-600 text-white text-[11px] font-black px-4 py-2 rounded-full tracking-widest uppercase shadow-[0_10px_20px_rgba(220,38,38,0.3)]">
                        Hàng Mới Về
                    </div>
                </div>
                
                {/* Thumbnails */}
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                    {images.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveImage(idx)}
                            className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 relative ${activeImage === idx ? 'border-stone-900 shadow-md ring-4 ring-stone-900/10 scale-[1.02]' : 'border-transparent hover:border-stone-300 opacity-60 hover:opacity-100 bg-stone-50'}`}
                        >
                            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Product Details & Action Funnel */}
            <div className="flex flex-col pt-4">
                <span className="text-[11px] font-black text-white bg-red-600 px-4 py-1.5 rounded-full w-max uppercase tracking-widest shadow-md mb-6 animate-pulse">🎉 Ưu Đãi Giới Hạn -20%</span>
                
                <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-stone-900 mb-6 tracking-tight leading-[1.1] capitalize">
                    {slug.replace(/-/g, ' ')}
                </h1>
                
                <div className="flex items-end gap-5 mb-10 pb-10 border-b border-stone-100">
                    <span className="text-5xl font-black text-red-600 tracking-tighter">12.000.000 đ</span>
                    <span className="text-xl font-bold text-stone-400 line-through mb-1">15.000.000 đ</span>
                </div>

                <div className="prose prose-stone mb-12 text-stone-600 leading-relaxed font-medium">
                    <p className="text-lg text-stone-500 font-serif leading-loose italic mb-6">"Sản phẩm mang dấp dáng tinh tế của thiết kế Bắc Âu, kết hợp chất liệu da thật nhập khẩu cùng khung gỗ Sồi nguyên khối. Phù hợp cho những không gian tổng thống cao cấp."</p>
                    <ul className="mt-4 space-y-4 text-[15px]">
                        <li className="flex gap-3"><span className="text-stone-900 mt-1">✓</span> <span><strong className="text-stone-900 capitalize">Chất liệu:</strong> Gỗ Sồi nhập khẩu Nga. Da công nghiệp Microfiber / Da bò Ý cao cấp.</span></li>
                        <li className="flex gap-3"><span className="text-stone-900 mt-1">✓</span> <span><strong className="text-stone-900 capitalize">Kích thước:</strong> Dài 2m2 x Rộng 1m1 x Cao 0.75m. <span className="text-red-600 font-bold">*Có thể tùy biến theo không gian nhà bạn*</span>.</span></li>
                        <li className="flex gap-3"><span className="text-stone-900 mt-1">✓</span> <span><strong className="text-stone-900 capitalize">Bảo hành:</strong> Chính hãng 5 năm và hỗ trợ bọc da định kỳ trọn đời.</span></li>
                    </ul>
                </div>

                {/* Call to Actions (Funnel) */}
                <div className="mt-auto space-y-5 bg-stone-50 p-6 rounded-3xl border border-stone-100">
                    <button 
                      onClick={handleAddToCart}
                      className="w-full bg-stone-900 text-white font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-black transition-all hover:scale-[1.02] shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex justify-center items-center gap-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        Thêm Vào Giỏ Hàng
                    </button>
                    <button 
                      onClick={handleConsult}
                      className="w-full bg-white text-stone-900 font-black border-2 border-stone-200 uppercase tracking-widest py-5 rounded-2xl hover:border-stone-900 hover:bg-stone-50 transition-colors flex justify-center items-center gap-3 shadow-sm">
                        <svg className="w-5 h-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        Tư Vấn Thiết Kế Theo Yêu Cầu
                    </button>
                    <div className="flex items-center justify-center gap-2 text-center text-sm font-bold text-red-600 mt-6 bg-red-50 rounded-2xl p-4 border border-red-100">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                        Đăng ký ngay hôm nay để nhận tư vấn thiết kế miễn phí và ưu đãi tốt nhất!
                    </div>
                </div>
            </div>
        </div>
      </div>

      <PhoneModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({...modalConfig, isOpen: false})}
        title={modalConfig.title}
        source={modalConfig.source}
        onSuccess={() => {
          if (modalConfig.source === 'Cart') {
            router.push('/cart');
          }
        }}
      />
    </div>
  );
}
