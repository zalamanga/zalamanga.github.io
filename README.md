# Portfolio Website Guide

Panduan ini dibuat supaya nanti gampang update portfolio tanpa database. Website ini cocok untuk GitHub Pages karena semua data disimpan sebagai file statis.

## Katalog proyek GitHub

Bagian **Project library**, di bawah proyek unggulan, menampilkan repo proyek publik dengan pencarian, kategori, dan tombol **Show more projects**. Katalog memuat 12 entri pada awalnya. Nama proyek, deskripsi, teknologi, dan jenis proyek bisa dicari sekaligus.

Data katalog ada di [`assets/data/projects.json`](assets/data/projects.json). Script [`assets/js/project-catalog.js`](assets/js/project-catalog.js) memuat file tersebut; katalog tidak membutuhkan token GitHub atau request API GitHub dari browser pengunjung.

Untuk menambahkan atau memperbarui entri:

1. Edit objek pada array `projects`. Isi `repo`, `title`, `description`, `category`, `kind`, `stack`, dan `url` berdasarkan proyek yang benar-benar tersedia.
2. Pilih kategori `web`, `backend`, `java`, `mobile`, `data`, atau `tools`.
3. Simpan gambar dokumentasi yang sudah boleh dipublikasikan di `assets/images/project-catalog/`. Masukkan path lokal, `alt`, `label`, `width`, dan `height` pada array `screenshots`. Gambar pertama menjadi preview; tombol **View image** membuka gambar ukuran asli.
4. Bedakan screenshot aplikasi, render output terminal/HTTP, preview komponen, hasil PDF, dan diagram source pada `label`. Ikon, foto produk, atau diagram tidak boleh disebut screenshot aplikasi berjalan.
5. Jika belum ada gambar, gunakan `screenshots: []` dan isi `note` dengan keterangannya. Kartu tetap tampil dan menautkan source code.
6. Jalankan preview lokal, lalu cek pencarian, kategori, kondisi hasil kosong, pemuatan gambar, dan tombol untuk menampilkan sisa entri.

Field opsional `sourceRef` berisi commit SHA lengkap dengan 40 digit heksadesimal. Dengan field ini, **View source** membuka versi yang menjadi rujukan deskripsi dan gambar. Ini juga menjaga tautan proyek yang dikerjakan pada feature branch agar tidak membuka README cabang utama yang berbeda.

Sebagian gambar berasal dari dokumentasi repo; sepuluh screenshot website statis dibuat melalui preview lokal dari source publik tanpa perubahan. Capture frontend tersebut tidak membuktikan backend, akun, pembayaran, atau layanan eksternal sudah berjalan.

Katalog berisi proyek publik, termasuk latihan, demo, dan starter yang diberi jenisnya. Repo privat, README profil akun, serta repo portfolio ini sendiri tidak dimasukkan. Proyek Moonlight, Pakeaja Interview, dan QRCBN yang sebelumnya dikecualikan tidak ditambahkan sebagai source publik.

Seluruh 84 proyek sudah memiliki preview. Delapan Android memakai diagram layar/alur yang dibuat dari Java/XML asli; proyek backend atau legacy yang belum bisa dijalankan memakai diagram alur dari route, controller, model, dan README. Diagram berlabel **Source-based** dan menyertakan penjelasan bahwa itu bukan screenshot runtime. Source SVG disimpan di samping PNG agar bisa diperbarui. Tambahkan atau ganti dengan tangkapan emulator/perangkat setelah aplikasinya dijalankan.

Capture lokal memakai data demo atau fixture sintetis jika API/database asli tidak tersedia. Preview output Playwright menampilkan hasil penemuan tes (`--list`), bukan klaim bahwa tes login sudah dijalankan. Capture halaman landing juga tidak membuktikan seluruh CMS atau backend berhasil diuji.

Proyek unggulan dan detail pengalamannya tetap menggunakan `portfolioCases` di `assets/js/main.js`, sesuai panduan berikut.

## Profil, CV, dan identitas

- [`Muhammad_Rafik_CV.pdf`](Muhammad_Rafik_CV.pdf) adalah CV yang dipakai pada tombol download di navigasi, hero, dan kontak.
- `sections/skills.html` dan daftar marquee di `assets/js/main.js` mengikuti teknologi serta praktik yang tertulis pada CV. Teknologi pada kartu proyek mengikuti source masing-masing repo.
- Potret untuk hero ada di `assets/images/portfolio/rafik-portrait-cutout.png`. Latar foto dihapus dengan bantuan AI dan ditampilkan di atas bidang charcoal-lilac; foto sumber tetap ada di `rafik-portrait.png`.
- Logo tema gelap ada di `assets/images/brand/zalamanga-dark.png`: motif gunung dan tulisan Zalamanga berwarna lilac dengan latar transparan. Navigasi dan footer memakai file yang sama; favicon memakai versi ikon gunung `zalamanga-mark.svg`. Logo sumber berlatar putih tetap ada di `zalamanga-logo.png`.
- `assets/css/profile.css` mengatur potret, logo, menu mobile, dan tambahan styling Skills. Menu mobile dapat dibuka dengan keyboard dan ditutup melalui Escape.
- Carousel teknologi memiliki tombol **Play motion / Pause motion**. Saat preferensi perangkat meminta pengurangan animasi, carousel mulai dalam keadaan berhenti; pilihan tombol disimpan di browser agar tetap berlaku setelah reload. Animasi berhenti bekerja saat dijeda atau tab disembunyikan.

## Struktur File

```txt
index.html
Muhammad_Rafik_CV.pdf
assets/
  css/
    styles.css
    project-catalog.css
    profile.css
  js/
    main.js
    partials.js
    project-catalog.js
  data/
    projects.json
  images/
    brand/
      zalamanga-logo.png
      zalamanga-dark.png
      zalamanga-mark.svg
    project-catalog/
    portfolio/
      rafik-portrait.png
      rafik-portrait-cutout.png
sections/
  nav.html
  hero.html
  marquee.html
  showcase.html
  about.html
  skills.html
  experience.html
  education.html
  certifications.html
  contact.html
  footer.html
```

Keterangan:

- `index.html`: file utama. Isinya loader untuk semua section.
- `sections/`: tempat edit isi HTML per bagian website.
- `assets/css/styles.css`: tempat edit styling, warna, spacing, animasi, responsive.
- `assets/js/main.js`: tempat edit data portfolio, tech stack marquee, animasi, dan interaksi.
- `assets/js/partials.js`: loader untuk mengambil file dari folder `sections/`.
- `assets/images/portfolio/`: tempat simpan gambar portfolio.

## Preview Lokal

Karena section dipisah dan dimuat memakai `fetch`, jangan buka `index.html` dengan double click biasa.

Gunakan salah satu:

- VS Code extension `Live Server`
- server lokal seperti `python -m http.server`
- langsung deploy ke GitHub Pages

Kalau dibuka via `file://`, section bisa gagal muncul karena browser memblokir fetch file lokal.

## Ukuran Gambar Portfolio

Rekomendasi ukuran:

- Thumbnail portfolio: `1200 x 800 px`
- Rasio terbaik: `3:2` atau `16:10`
- Format: `.jpg`, `.jpeg`, `.png`, atau `.webp`
- Ukuran file ideal: di bawah `500 KB` per gambar
- Nama file: huruf kecil, tanpa spasi

Contoh nama yang bagus:

```txt
cms-dashboard.jpg
mobile-reading-app.png
admin-ui-kit.webp
```

Simpan gambar di:

```txt
assets/images/portfolio/
```

Contoh path:

```txt
assets/images/portfolio/cms-dashboard.jpg
```

## Cara Menambah Portfolio Baru

Buka:

```txt
assets/js/main.js
```

Cari:

```js
const portfolioCases = [
```

Copy salah satu object portfolio, lalu paste di dalam array tersebut.

Contoh:

```js
{
  title: 'Nama Project Kamu',
  type: 'Code',
  category: 'code',
  year: '2026',
  image: 'assets/images/portfolio/nama-gambar.jpg',
  summary: 'Deskripsi singkat project, fokus ke masalah, solusi, dan hasil.',
  stack: ['Laravel', 'Vue.js', 'MySQL'],
  links: [
    { label: 'Case Study', href: '#contact' },
    { label: 'GitHub', href: 'https://github.com/username/repository' },
  ],
},
```

Pastikan setiap object dipisah dengan koma.

## Arti Field Portfolio

```js
title: 'Custom CMS Website'
```

Nama project yang tampil di card.

```js
type: 'Code'
```

Label kecil di card. Bisa diisi:

- `Code`
- `Mobile App`
- `UI/UX`
- `Data Analytics`

```js
category: 'code'
```

Dipakai untuk filter tombol showcase. Pilihan yang tersedia:

- `code`
- `mobile`
- `uiux`
- `data`

```js
year: '2026'
```

Tahun project.

```js
image: 'assets/images/portfolio/cms-dashboard.jpg'
```

Gambar thumbnail portfolio. Kalau field `image` tidak ada, card akan memakai mockup default.

```js
summary: 'Deskripsi singkat project.'
```

Penjelasan pendek untuk card. Idealnya 1 kalimat.

```js
stack: ['PHP', 'MySQL', 'CSS']
```

Teknologi atau tools yang dipakai.

```js
links: [
  { label: 'Case Study', href: '#contact' },
  { label: 'GitHub', href: 'https://github.com/zalamanga' },
]
```

Tombol yang tampil di bawah card.

## Tombol Case Study, GitHub, Details Itu Untuk Apa?

Tombol di bawah card berasal dari field `links`.

Contoh:

```js
links: [
  { label: 'Case Study', href: '#contact' },
  { label: 'GitHub', href: 'https://github.com/zalamanga' },
]
```

Artinya akan muncul 2 tombol:

- `Case Study`: biasanya untuk menuju halaman detail project, PDF, Figma, atau section penjelasan.
- `GitHub`: untuk menuju source code repository.

Contoh lain:

```js
links: [
  { label: 'Details', href: '#experience' },
]
```

Artinya hanya muncul 1 tombol bernama `Details`.

Kamu bebas mengganti label tombol, misalnya:

- `Live Demo`
- `GitHub`
- `Figma`
- `Prototype`
- `App Store`
- `Play Store`
- `Case Study`

Contoh link lengkap:

```js
links: [
  { label: 'Live Demo', href: 'https://nama-website.com' },
  { label: 'GitHub', href: 'https://github.com/username/project' },
  { label: 'Figma', href: 'https://figma.com/file/...' },
]
```

Kalau link dimulai dengan `https://`, tombol otomatis terbuka di tab baru.

## Contoh Portfolio Berdasarkan Tipe

### Code / Web

```js
{
  title: 'Company Profile Website',
  type: 'Code',
  category: 'code',
  year: '2026',
  image: 'assets/images/portfolio/company-profile.jpg',
  summary: 'Website company profile responsive dengan halaman admin sederhana.',
  stack: ['PHP', 'MySQL', 'Bootstrap'],
  links: [
    { label: 'Live Demo', href: 'https://example.com' },
    { label: 'GitHub', href: 'https://github.com/username/project' },
  ],
},
```

### Mobile App

```js
{
  title: 'Reading App',
  type: 'Mobile App',
  category: 'mobile',
  year: '2026',
  image: 'assets/images/portfolio/reading-app.png',
  summary: 'Aplikasi membaca dengan flow browsing, detail buku, dan profile user.',
  stack: ['Flutter', 'Firebase', 'REST API'],
  links: [
    { label: 'Case Study', href: '#contact' },
  ],
},
```

### UI/UX

```js
{
  title: 'Admin Dashboard UI Kit',
  type: 'UI/UX',
  category: 'uiux',
  year: '2026',
  image: 'assets/images/portfolio/dashboard-ui-kit.jpg',
  summary: 'Desain dashboard untuk monitoring data, tabel, dan action management.',
  stack: ['Figma', 'Prototype', 'Components'],
  links: [
    { label: 'Figma', href: 'https://figma.com/file/...' },
  ],
},
```

## Cara Update Tech Stack Marquee

Buka:

```txt
assets/js/main.js
```

Cari:

```js
const techStack = [
```

Tambah item seperti ini:

```js
{ name: 'Next.js', icon: 'nextdotjs', invert: true },
```

Icon mengambil dari Simple Icons:

```txt
https://cdn.simpleicons.org/namaicon
```

Contoh:

- React: `react`
- Laravel: `laravel`
- Flutter: `flutter`
- Figma: `figma`
- GitHub: `github`

Kalau icon gelap tidak terlihat di background gelap, tambahkan:

```js
invert: true
```

## Cara Edit Section Website

Edit isi section di folder:

```txt
sections/
```

Contoh:

- Ubah headline utama: `sections/hero.html`
- Ubah isi about: `sections/about.html`
- Ubah skills: `sections/skills.html`
- Ubah experience: `sections/experience.html`
- Ubah contact: `sections/contact.html`

## Checklist Sebelum Upload Portfolio Baru

1. Masukkan gambar ke `assets/images/portfolio/`.
2. Tambahkan object baru di `portfolioCases`.
3. Pastikan `category` salah satu dari `code`, `mobile`, `uiux`, atau `data`.
4. Pastikan path gambar benar.
5. Pastikan link tombol benar.
6. Preview pakai Live Server.
7. Push ke GitHub.

## Catatan Penting

- [KYB Onboarding Analytics](projects/kyb-onboarding-analytics/) adalah demo analitik dengan 840 catatan sintetis. Generator data, SQL, dan dokumentasinya tersedia pada folder proyek tersebut.

- Website ini tidak memakai database.
- Proyek unggulan disimpan di `assets/js/main.js`; katalog repo publik disimpan di `assets/data/projects.json`.
- Gambar unggulan ada di `assets/images/portfolio/`; visual katalog ada di `assets/images/project-catalog/`.
- Aman untuk GitHub Pages.
- Jangan hapus `assets/js/partials.js`, karena file ini yang memuat section HTML.
