"use client"

import { useState } from "react"
import { Phone, MapPin, Mail, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const contactInfo = [
  {
    icon: Phone,
    label: "Hotline 24/7",
    value: "0966.245.396",
    href: "tel:0966245396"
  },
  {
    icon: MapPin,
    label: "Xưởng sản xuất",
    value: "Thanh Đa - Phúc Thọ - Hà Nội",
    href: "#"
  },
  {
    icon: Mail,
    label: "Email",
    value: "noithatnvhomes@gmail.com",
    href: "mailto:noithatnvhomes@gmail.com"
  },
  {
    icon: Clock,
    label: "Giờ làm việc",
    value: "8:00 - 18:00, T2 - CN",
    href: "#"
  }
]

import { api } from "@/services/api"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    
    try {
      // 1. Lấy Google reCAPTCHA Token (v3)
      // Thêm script reCAPTCHA vào head nếu chưa có (thông thường nến thêm vào layout)
      const token = await new Promise<string>((resolve) => {
        (window as any).grecaptcha.ready(async () => {
          const t = await (window as any).grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Ldx95ksAAAAAJyG9NvRfD0NVvzPSJa8GKhwkkSb', 
            { action: 'contact' }
          );
          resolve(t);
        });
      });

      // 2. Gửi dữ liệu kèm Token xác thực
      await api.post("/customers", {
        phoneNumber: formData.phone,
        name: formData.name,
        source: "ContactSection",
        note: `Message: ${formData.message}`,
        reCaptchaToken: token // Gửi token để backend validate
      })
      setIsSuccess(true)
      setFormData({ name: "", phone: "", message: "" })
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("Xác thực thất bại hoặc lỗi hệ thống. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Info */}
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-accent mb-4">Liên hệ</p>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-6 text-balance">
              Bạn Đã Sẵn Sàng Thay Đổi?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12">
              Để lại thông tin, chuyên gia của NV Homes sẽ liên hệ tư vấn và khảo sát hiện trạng miễn phí cho bạn.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              {contactInfo.map((info, index) => (
                <a 
                  key={index}
                  href={info.href}
                  className="flex gap-4 group"
                >
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                    <p className="font-medium">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-card border border-border p-8 lg:p-12">
            <h3 className="font-serif text-2xl mb-8">Đăng Ký Tư Vấn</h3>
            
            {isSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold mb-2">Gửi thành công!</h4>
                <p className="text-muted-foreground mb-8">Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSuccess(false)}
                  className="rounded-none"
                >
                  Gửi yêu cầu khác
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="text-sm text-muted-foreground mb-2 block">
                    Họ và tên *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-none border-border bg-background h-12"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="text-sm text-muted-foreground mb-2 block">
                    Số điện thoại *
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0912 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-none border-border bg-background h-12"
                    required
                  />
                </div>


                <div>
                  <label htmlFor="message" className="text-sm text-muted-foreground mb-2 block">
                    Nội dung yêu cầu
                  </label>
                  <textarea
                    id="message"
                    placeholder="Mô tả yêu cầu của bạn..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full h-32 px-4 py-3 border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {error && <p className="text-sm text-destructive font-medium">{error}</p>}

                <Button 
                  type="submit" 
                  className="w-full rounded-none h-14 text-base group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi Yêu Cầu Tư Vấn"}
                  {!isSubmitting && <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
