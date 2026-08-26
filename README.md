# Portfolio Website Guide

Panduan ini dibuat supaya nanti gampang update portfolio tanpa database. Website ini cocok untuk GitHub Pages karena semua data disimpan sebagai file statis.

## Struktur File

```txt
index.html
assets/
  css/
    styles.css
  js/
    main.js
    partials.js
  images/
    portfolio/
      foto.jpeg
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

```js
category: 'code'
```

Dipakai untuk filter tombol showcase. Pilihan yang tersedia:

- `code`
- `mobile`
- `uiux`

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
3. Pastikan `category` salah satu dari `code`, `mobile`, atau `uiux`.
4. Pastikan path gambar benar.
5. Pastikan link tombol benar.
6. Preview pakai Live Server.
7. Push ke GitHub.

## Catatan Penting

- Website ini tidak memakai database.
- Semua portfolio disimpan di `assets/js/main.js`.
- Semua gambar disimpan di `assets/images/portfolio/`.
- Aman untuk GitHub Pages.
- Jangan hapus `assets/js/partials.js`, karena file ini yang memuat section HTML.
