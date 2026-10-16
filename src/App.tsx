import { useMemo, useState } from "react"

type Category = "semua" | "manis" | "asin"

type Product = {
  id: string
  name: string
  category: Exclude<Category, "semua">
  price: number
  description: string
  image: string
}

type PendingTestimonial = {
  id: string
  displayName: string
  name?: string
  testimonial: string
  rating: number
  status: "Menunggu persetujuan"
  submittedAt: string
}

const pendingTestimonialsKey = "lumlump-pending-testimonials"

const products: Product[] = [
  {
    id: "pisang",
    name: "Lumpia Pisang",
    category: "manis",
    price: 10000,
    description:
      "Pisang lembut berbalut kulit lumpia renyah, siap dipadukan dengan topping favoritmu.",
    image: "/assets/products/LumpiaPisang.jpeg",
  },
  {
    id: "ubi",
    name: "Lumpia Ubi Ungu",
    category: "manis",
    price: 15000,
    description:
      "Isian ubi ungu yang legit dan creamy dalam balutan kulit lumpia yang renyah.",
    image: "/assets/products/LumpiaUbiUngu.jpeg",
  },
  {
    id: "mie",
    name: "Lumpia Mie",
    category: "asin",
    price: 10000,
    description:
      "Gurihnya mie berbumbu dalam kulit lumpia renyah, disajikan dengan acar dan cabe rawit.",
    image: "/assets/products/LumpiaMie.jpeg",
  },
  {
    id: "sosis-kornet",
    name: "Lumpia Sosis + Kornet",
    category: "asin",
    price: 20000,
    description:
      "Perpaduan sosis dan kornet yang gurih, lengkap dengan acar segar dan cabe rawit.",
    image: "/assets/products/LumpiaKornetSosis.jpeg",
  },
]

const toppings = ["Keju parut", "Matcha bubuk", "Cokelat cair", "Oreo bubuk"]

const team = [
  { name: "Paula Novita Tefa", image: "/assets/team/team-1.jpg" },
  { name: "Virgo Maria Bria", image: "/assets/team/team-2.jpg" },
  { name: "Maria Sonya Mataubana", image: "/assets/team/team-3.jpg" },
  { name: "Noviana Pasquella", image: "/assets/team/team-4.jpg" },
  { name: "Merland D.T Kolloh", image: "/assets/team/team-5.jpg" },
  { name: "Nanggala B. Lifu", image: "/assets/team/team-6.jpg" },
  { name: "Yolanda R. Gomez", image: "/assets/team/team-7.jpg" },
]

const formatPrice = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)

const assetUrl = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`

function Icon({ name, size = 20 }: { name: string size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
        <path d="M19 12H5" />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l1 12H5L6 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    spark: (
      <path d="m12 3 1.4 4.1L17 9l-3.6 1.9L12 15l-1.4-4.1L7 9l3.6-1.9L12 3Z" />
    ),
    whatsapp: (
      <>
        <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
        <path d="M8.5 8.2c.4 3.1 2.2 5 5.3 5.7l1-1.4 2 .9c-.4 1.7-1.5 2.4-3.2 2.2-3.9-.6-6.2-3-6.8-6.8-.2-1.5.5-2.4 1.8-2.8l1 2-1.1.2Z" />
      </>
    ),
  }
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[name]}
    </svg>
  )
}

function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost"
}) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  )
}

function SectionTitle({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string
  title: string
  copy?: string
}) {
  return (
    <div className="section-title">
      <span className="eyebrow">
        <Icon name="spark" size={16} />
        {eyebrow}
      </span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  )
}

export default function App() {
  const [category, setCategory] = useState<Category>("semua")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(products[0].id)
  const [quantity, setQuantity] = useState(1)
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [customerName, setCustomerName] = useState("")
  const [notes, setNotes] = useState("")
  const [testimonialFormOpen, setTestimonialFormOpen] = useState(false)
  const [testimonialName, setTestimonialName] = useState("")
  const [testimonialVisibility, setTestimonialVisibility] = useState<
    "name" | "anonymous"
  >("name")
  const [testimonialText, setTestimonialText] = useState("")
  const [testimonialRating, setTestimonialRating] = useState(5)
  const [testimonialError, setTestimonialError] = useState("")
  const [testimonialNotice, setTestimonialNotice] = useState("")

  const selectedProduct =
    products.find((product) => product.id === selectedId) ?? products[0]
  const total = selectedProduct.price * quantity
  const filteredProducts = useMemo(
    () =>
      category === "semua"
        ? products
        : products.filter((product) => product.category === category),
    [category],
  )

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMobileOpen(false)
  }

  const chooseProduct = (product: Product) => {
    setSelectedId(product.id)
    setSelectedToppings([])
    scrollTo("pesan")
  }

  const toggleTopping = (topping: string) => {
    setSelectedToppings((current) =>
      current.includes(topping)
        ? current.filter((item) => item !== topping)
        : [...current, topping],
    )
  }

  const submitTestimonial = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = testimonialText.trim()

    if (!text) {
      setTestimonialError("Testimoni wajib diisi sebelum dikirim.")
      return
    }

    const submission: PendingTestimonial = {
      id: crypto.randomUUID(),
      displayName:
        testimonialVisibility === "anonymous"
          ? "Anonim"
          : testimonialName.trim() || "Pelanggan LumLump",
      ...(testimonialVisibility === "name" && testimonialName.trim()
        ? { name: testimonialName.trim() }
        : {}),
      testimonial: text,
      rating: testimonialRating,
      status: "Menunggu persetujuan",
      submittedAt: new Date().toISOString(),
    }

    try {
      const saved = window.localStorage.getItem(pendingTestimonialsKey)
      const existing: unknown = saved ? JSON.parse(saved) : []

      if (!Array.isArray(existing)) {
        throw new Error("Data testimoni lokal tidak valid.")
      }

      window.localStorage.setItem(
        pendingTestimonialsKey,
        JSON.stringify([...existing, submission]),
      )
    } catch (error) {
      setTestimonialError(
        error instanceof Error
          ? `Testimoni tidak dapat disimpan: ${error.message}`
          : "Testimoni tidak dapat disimpan di browser ini. Periksa penyimpanan browser dan coba lagi.",
      )
      return
    }

    setTestimonialFormOpen(false)
    setTestimonialText("")
    setTestimonialName("")
    setTestimonialVisibility("name")
    setTestimonialRating(5)
    setTestimonialError("")
    setTestimonialNotice(
      "Terima kasih sudah berbagi pengalaman bersama LumLump!",
    )
  }

  const whatsappUrl = useMemo(() => {
    const toppingText =
      selectedProduct.category === "manis"
        ? selectedToppings.length > 0
          ? selectedToppings.join(", ")
          : "Belum dipilih"
        : "Acar timun & wortel, cabe rawit"
    const message = [
      "Halo LumLump! Saya ingin memesan:",
      "",
      `Produk: ${selectedProduct.name}`,
      `Jumlah: ${quantity} kotak (${quantity * 5} pcs)`,
      `${
        selectedProduct.category === "manis" ? "Topping" : "Pelengkap"
      }: ${toppingText}`,
      `Total: ${formatPrice(total)}`,
      `Nama: ${customerName || "-"}`,
      `Catatan: ${notes || "-"}`,
      "",
      "Mohon konfirmasi ketersediaan, pembayaran, serta pengambilan/pengantaran. Terima kasih!",
    ].join("\n")
    return `https://wa.me/6281547478692?text=${encodeURIComponent(message)}`
  }, [customerName, notes, quantity, selectedProduct, selectedToppings, total])

  return (
    <div className="site-shell">
      <header className="navbar">
        <div className="container nav-inner">
          <button
            className="brand"
            onClick={() => scrollTo("beranda")}
            aria-label="Kembali ke beranda"
          >
            <img src={assetUrl("/assets/lumlump-logo.png")} alt="Logo LumLump" />
            <span>LumLump</span>
          </button>
          <nav
            className={`nav-links ${mobileOpen ? "open" : ""}`}
            aria-label="Navigasi utama"
          >
            {[
              ["beranda", "Beranda"],
              ["menu", "Menu"],
              ["tentang", "Tentang Kami"],
              ["kontak", "Kontak"],
            ].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)}>
                {label}
              </button>
            ))}
            <Button className="mobile-order" onClick={() => scrollTo("pesan")}>
              Pesan Sekarang
            </Button>
          </nav>
          <Button className="desktop-order" onClick={() => scrollTo("pesan")}>
            Pesan Sekarang <Icon name="arrow" size={18} />
          </Button>
          <button
            className="menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Buka menu"
            aria-expanded={mobileOpen}
          >
            <Icon name={mobileOpen ? "close" : "menu"} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="beranda">
          <div className="hero-blob blob-one" />
          <div className="hero-blob blob-two" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">
                <Icon name="spark" size={16} />
                Dua rasa, satu kebahagiaan
              </span>
              <h1>
                Lumpia Favoritmu, <em>Lumer di Mulut!</em>
              </h1>
              <p>
                Nikmati perpaduan lumpia manis dan asin yang lezat, dibuat untuk
                menemani setiap momenmu.
              </p>
              <div className="hero-actions">
                <Button onClick={() => scrollTo("menu")}>
                  Lihat Menu <Icon name="arrow" size={18} />
                </Button>
                <Button variant="secondary" onClick={() => scrollTo("pesan")}>
                  <Icon name="whatsapp" size={19} />
                  Pesan Sekarang
                </Button>
              </div>
              <div className="hero-proof">
                <div className="proof-avatars">
                  <span>M</span>
                  <span>A</span>
                  <span>L</span>
                </div>
                <p>
                  <strong>Camilan dua rasa</strong>
                  <br />
                  untuk semua suasana
                </p>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-wrap">
                <img
                  src={assetUrl("/assets/products/LumpiaKornetSosis.jpeg")}
                  alt="Lumpia sosis dan kornet LumLump"
                />
                <span className="photo-note">Lumpia Sosis + Kornet</span>
              </div>
              <div className="flavor-card sweet">
                <span>Manis</span>
                <small>Lembut & lumer</small>
              </div>
              <div className="flavor-card savory">
                <span>Asin</span>
                <small>Gurih & renyah</small>
              </div>
              <div className="logo-stamp">
                <img src={assetUrl("/assets/lumlump-logo.png")} alt="" />
              </div>
            </div>
          </div>
        </section>

        <section className="benefits">
          <div className="container benefit-grid">
            {[
              ["01", "Manis & asin", "Pilihan rasa untuk setiap selera."],
              ["02", "Topping favorit", "Racik topping sesuai mood-mu."],
              ["03", "Teman ngemil", "Pas dinikmati sendiri atau ramai-ramai."],
              ["04", "Pesan praktis", "Selesaikan pesanan lewat WhatsApp."],
            ].map(([number, title, copy]) => (
              <article key={number} className="benefit-card">
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="container">
            <div className="menu-heading">
              <SectionTitle
                eyebrow="Menu kami"
                title="Menu Favorit LumLump"
                copy="Pilih rasa yang bikin harimu makin seru. Semua menu berisi 5 pcs per kotak."
              />
              <div className="filters" role="group" aria-label="Filter menu">
                {[
                  ["semua", "Semua Menu"],
                  ["manis", "Manis"],
                  ["asin", "Asin"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    className={category === value ? "active" : ""}
                    onClick={() => setCategory(value as Category)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <img
                      src={assetUrl(product.image)}
                      alt={`Placeholder foto ${product.name}`}
                    />
                    <span className={`category-badge ${product.category}`}>
                      {product.category === "manis"
                        ? "Lumpia Manis"
                        : "Lumpia Asin"}
                    </span>
                    <span className="photo-note">Foto placeholder</span>
                  </div>
                  <div className="product-body">
                    <div className="product-title">
                      <h3>{product.name}</h3>
                      <span>5 pcs</span>
                    </div>
                    <p>{product.description}</p>
                    <div className="product-extra">
                      <strong>
                        {product.category === "manis"
                          ? "Pilihan topping"
                          : "Pelengkap"}
                      </strong>
                      <span>
                        {product.category === "manis"
                          ? "Keju, matcha, cokelat, Oreo"
                          : "Acar timun & wortel, cabe rawit"}
                      </span>
                    </div>
                    <div className="product-footer">
                      <div>
                        <small>Mulai dari</small>
                        <strong>{formatPrice(product.price)}</strong>
                      </div>
                      <Button onClick={() => chooseProduct(product)}>
                        Pesan <Icon name="arrow" size={17} />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="order-section" id="pesan">
          <div className="container">
            <SectionTitle
              eyebrow="Pesan mudah"
              title="Dari pilihanmu ke WhatsApp"
              copy="Atur pesananmu di sini. Pembayaran dan detail pengiriman dikonfirmasi langsung bersama LumLump."
            />
            <div className="order-layout">
              <div className="order-form">
                <div className="form-step">
                  <span>1</span>
                  <div>
                    <h3>Pilih lumpiamu</h3>
                    <p>Tentukan menu yang ingin dipesan.</p>
                  </div>
                </div>
                <div className="product-options">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      className={selectedId === product.id ? "selected" : ""}
                      onClick={() => {
                        setSelectedId(product.id)
                        setSelectedToppings([])
                      }}
                    >
                      <span className="radio-dot" />
                      <span>
                        <strong>{product.name}</strong>
                        <small>{formatPrice(product.price)} · 5 pcs</small>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="form-row">
                  <div>
                    <div className="form-step small">
                      <span>2</span>
                      <div>
                        <h3>Jumlah kotak</h3>
                      </div>
                    </div>
                    <div className="quantity">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        aria-label="Kurangi jumlah"
                      >
                        <Icon name="minus" />
                      </button>
                      <strong>{quantity}</strong>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        aria-label="Tambah jumlah"
                      >
                        <Icon name="plus" />
                      </button>
                    </div>
                  </div>
                  <div className="pieces">
                    <span>Total isi</span>
                    <strong>{quantity * 5} pcs</strong>
                  </div>
                </div>
                {selectedProduct.category === "manis" && (
                  <div className="topping-block">
                    <div className="form-step small">
                      <span>3</span>
                      <div>
                        <h3>Pilih topping</h3>
                        <p>Boleh pilih lebih dari satu.</p>
                      </div>
                    </div>
                    <div className="topping-options">
                      {toppings.map((topping) => (
                        <button
                          key={topping}
                          className={
                            selectedToppings.includes(topping) ? "selected" : ""
                          }
                          onClick={() => toggleTopping(topping)}
                        >
                          <span>
                            {selectedToppings.includes(topping) && (
                              <Icon name="check" size={15} />
                            )}
                          </span>
                          {topping}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="form-step small">
                  <span>
                    {selectedProduct.category === "manis" ? "4" : "3"}
                  </span>
                  <div>
                    <h3>Lengkapi pesanan</h3>
                    <p>Supaya kami tahu pesanan ini milik siapa.</p>
                  </div>
                </div>
                <div className="input-grid">
                  <label>
                    Nama kamu
                    <input
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder="Masukkan nama"
                    />
                  </label>
                  <label>
                    Catatan pesanan
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Contoh: tanpa cabe, ambil pukul..."
                      rows={3}
                    />
                  </label>
                </div>
              </div>
              <aside className="order-summary">
                <span className="summary-label">Ringkasan pesanan</span>
                <div className="summary-product">
                  <img src={assetUrl(selectedProduct.image)} alt="" />
                  <div>
                    <strong>{selectedProduct.name}</strong>
                    <span>
                      {quantity} kotak · {quantity * 5} pcs
                    </span>
                  </div>
                </div>
                <div className="summary-detail">
                  <span>Harga satuan</span>
                  <strong>{formatPrice(selectedProduct.price)}</strong>
                </div>
                <div className="summary-detail">
                  <span>
                    {selectedProduct.category === "manis"
                      ? "Topping"
                      : "Pelengkap"}
                  </span>
                  <strong>
                    {selectedProduct.category === "manis"
                      ? selectedToppings.join(", ") || "Belum dipilih"
                      : "Acar & cabe rawit"}
                  </strong>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <a
                  className="button button-whatsapp"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="whatsapp" />
                  Lanjutkan ke WhatsApp
                </a>
                <p className="summary-note">
                  Tidak ada pembayaran online. Ketersediaan, pembayaran, dan
                  pengiriman akan dikonfirmasi melalui WhatsApp.
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section className="about-section" id="tentang">
          <div className="container about-grid">
            <div className="about-collage">
              <div className="about-main-photo" aria-label="Kolase tim LumLump">
                {team.map((member) => (
                  <img
                    key={member.name}
                    src={assetUrl(member.image)}
                    alt={member.name}
                  />
                ))}
              </div>
              <div className="about-logo">
                <img src={assetUrl("/assets/lumlump-logo.png")} alt="Logo LumLump" />
              </div>
              <span className="about-caption">
                Dibuat bersama,
                <br />
                dinikmati bersama.
              </span>
            </div>
            <div className="about-copy">
              <SectionTitle
                eyebrow="Cerita kami"
                title="Kenalan dengan LumLump"
              />
              <p className="lead">
                LumLump adalah usaha kuliner yang menghadirkan pilihan lumpia
                manis dan asin dengan rasa yang menarik dan harga yang
                terjangkau.
              </p>
              <p>
                Kami ingin menghadirkan camilan yang cocok dinikmati sendiri
                maupun bersama teman. Dari ide sederhana, kami meracik dua
                karakter rasa dalam satu brand yang hangat dan dekat dengan
                semua orang.
              </p>
              <div className="brand-quote">
                “Lumer di Mulut,
                <br />
                <em>Nagih di Hati</em>”
              </div>
            </div>
          </div>
          <div className="container team-wrap">
            <div className="team-heading">
              <div>
                <span className="eyebrow">Orang di balik LumLump</span>
                <h3>Tim kami</h3>
              </div>
              <p>
                Tujuh teman, satu semangat untuk menyajikan camilan yang bikin
                nagih.
              </p>
            </div>
            <div className="team-grid">
              {team.map((member) => (
                <article className="team-card" key={member.name}>
                  <img src={assetUrl(member.image)} alt={member.name} />
                  <strong>{member.name}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="social-section">
          <div className="container">
            <div className="social-head">
              <SectionTitle
                eyebrow="Cerita dari kamu"
                title="Camilan enak, momen hangat"
              />
            </div>
            <div className="testimonial-grid">
              {[
                [
                  "Paula",
                  "Lumpia pisangnya renyah di luar dan lembut di dalam. Pas untuk camilan sore.",
                ],
                [
                  "Anonim",
                  "Lumpia sosis dan kornetnya gurih, isiannya terasa, dan tetap renyah.",
                ],
                [
                  "Christin",
                  "Suka pilihan toppingnya. Lumpianya enak dinikmati bersama teman.",
                ],
              ].map(([name, quote]) => (
                <article className="testimonial-card" key={name}>
                  <div className="quote-mark">“</div>
                  <p>{quote}</p>
                  <div className="testimonial-person">
                    <span>{name === "Anonim" ? "A" : name[0]}</span>
                    <strong>{name}</strong>
                  </div>
                </article>
              ))}
            </div>
            <div className="testimonial-actions">
              <Button
                type="button"
                onClick={() => {
                  setTestimonialNotice("")
                  setTestimonialError("")
                  setTestimonialFormOpen(true)
                }}
              >
                ✍️ Berikan Testimoni
              </Button>
            </div>
            {testimonialNotice && (
              <p className="testimonial-notice" role="status">
                {testimonialNotice}
                <small>
                  Testimoni tersimpan di browser ini dan menunggu persetujuan
                  admin. Kiriman belum dikirim ke pemilik LumLump.
                </small>
              </p>
            )}
            {testimonialFormOpen && (
              <form
                className="testimonial-form"
                onSubmit={submitTestimonial}
              >
                <h3>Bagikan pengalamanmu</h3>
                <div className="testimonial-form-grid">
                  <label className="testimonial-field">
                    <span>Nama (opsional)</span>
                    <input
                      type="text"
                      value={testimonialName}
                      onChange={(event) =>
                        setTestimonialName(event.target.value)
                      }
                      placeholder="Namamu"
                      autoComplete="name"
                    />
                  </label>
                  <label className="testimonial-field">
                    <span>Tampilkan nama sebagai</span>
                    <select
                      value={testimonialVisibility}
                      onChange={(event) =>
                        setTestimonialVisibility(
                          event.target.value === "anonymous"
                            ? "anonymous"
                            : "name",
                        )
                      }
                    >
                      <option value="name">Nama saya</option>
                      <option value="anonymous">Anonim</option>
                    </select>
                  </label>
                </div>
                <label className="testimonial-field">
                  <span>Testimoni</span>
                  <textarea
                    value={testimonialText}
                    onChange={(event) => setTestimonialText(event.target.value)}
                    placeholder="Ceritakan pengalamanmu menikmati LumLump..."
                    rows={5}
                    required
                    aria-invalid={Boolean(testimonialError)}
                    aria-describedby={
                      testimonialError ? "testimonial-error" : undefined
                    }
                  />
                </label>
                <fieldset className="testimonial-rating">
                  <legend>Penilaian</legend>
                  <div>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating}>
                        <input
                          type="radio"
                          name="testimonial-rating"
                          value={rating}
                          checked={testimonialRating === rating}
                          onChange={() => setTestimonialRating(rating)}
                        />
                        <span aria-hidden="true">
                          {rating <= testimonialRating ? "★" : "☆"}
                        </span>
                        <span className="visually-hidden">
                          {rating} bintang
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {testimonialError && (
                  <p
                    className="testimonial-error"
                    id="testimonial-error"
                    role="alert"
                  >
                    {testimonialError}
                  </p>
                )}
                <p className="testimonial-form-note">
                  Kiriman disimpan di browser ini dan berstatus menunggu
                  persetujuan. Kiriman tidak otomatis tampil di halaman publik.
                </p>
                <div className="testimonial-form-actions">
                  <Button type="submit">Kirim Testimoni</Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setTestimonialFormOpen(false)
                      setTestimonialError("")
                    }}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            )}
            <div className="instagram-block">
              <div className="instagram-copy">
                <span className="eyebrow">
                  <Icon name="instagram" size={17} />
                  Instagram
                </span>
                <h2>
                  Intip yang lagi
                  <br />
                  <em>lumer</em> di feed.
                </h2>
                <p>Ikuti kabar menu, topping, dan momen seru LumLump.</p>
                <a
                  href="https://instagram.com/lumpia.duarasa"
                  target="_blank"
                  rel="noreferrer"
                >
                  @lumpia.duarasa <Icon name="arrow" size={18} />
                </a>
              </div>
              <div className="instagram-grid">
                {[
                  { image: "LumpiaPisang.jpeg", name: "Lumpia Pisang" },
                  { image: "LumpiaUbiUngu.jpeg", name: "Lumpia Ubi Ungu" },
                  { image: "LumpiaMie.jpeg", name: "Lumpia Mie" },
                  {
                    image: "LumpiaKornetSosis.jpeg",
                    name: "Lumpia Sosis + Kornet",
                  },
                ].map(({ image, name }) => (
                  <a
                    key={image}
                    href="https://instagram.com/lumpia.duarasa"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Buka Instagram LumLump: ${name}`}
                  >
                    <img
                      src={assetUrl(`/assets/products/${image}`)}
                      alt={name}
                    />
                    <span>
                      <Icon name="instagram" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="kontak">
        <div className="container footer-top">
          <div className="footer-brand">
            <img src={assetUrl("/assets/lumlump-logo.png")} alt="Logo LumLump" />
            <p>
              Lumer di Mulut,
              <br />
              Nagih di Hati.
            </p>
          </div>
          <div className="footer-group">
            <h3>Jelajahi</h3>
            {["Beranda", "Menu", "Tentang", "Pesan"].map((item) => (
              <button
                key={item}
                onClick={() =>
                  scrollTo(
                    item === "Beranda"
                      ? "beranda"
                      : item === "Tentang"
                        ? "tentang"
                        : item.toLowerCase(),
                  )
                }
              >
                {item}
              </button>
            ))}
          </div>
          <div className="footer-group">
            <h3>Hubungi kami</h3>
            <a
              href="https://wa.me/6281547478692"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" size={18} />
              +62 815-4747-8692
            </a>
            <a
              href="https://instagram.com/lumpia.duarasa"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="instagram" size={18} />
              @lumpia.duarasa
            </a>
          </div>
          <div className="footer-group">
            <h3>Jam operasional</h3>
            <p className="editable-info">
              Informasi jam operasional dapat ditambahkan dan diedit di sini.
            </p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} LumLump</span>
          <span>Dibuat hangat untuk pencinta lumpia.</span>
        </div>
      </footer>
    </div>
  )
}
