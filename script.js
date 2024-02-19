// Temukan tombol berdasarkan ID
const aboutBtn = document.getElementById('aboutBtn');

// Tambahkan event listener untuk menangani klik tombol
aboutBtn.addEventListener('click', function () {
  // Temukan elemen "about" berdasarkan ID
  const aboutSection = document.getElementById('about');

  // Gulir ke bagian "about" dengan efek smooth
  aboutSection.scrollIntoView({ behavior: 'smooth' });
});