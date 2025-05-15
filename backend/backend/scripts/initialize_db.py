import transaction
import bcrypt
from datetime import date, timedelta
from pyramid.paster import get_appsettings, setup_logging
from sqlalchemy import engine_from_config
from ..models import get_tm_session, get_session_factory
from ..models.user import User
from ..models.kategori import Kategori
from ..models.artikel import Artikel

def main():
    config_uri = 'development.ini'
    setup_logging(config_uri)
    settings = get_appsettings(config_uri)

    engine = engine_from_config(settings, 'sqlalchemy.')
    session_factory = get_session_factory(engine)

    with transaction.manager:
        dbsession = get_tm_session(session_factory, transaction.manager)

        # ✅ Create sample categories
        kategori_politik = Kategori(
            nama='Politik',
            deskripsi='Berita terkini seputar politik dan pemerintahan'
        )
        kategori_teknologi = Kategori(
            nama='Teknologi',
            deskripsi='Inovasi, gadget, dan perkembangan teknologi'
        )
        kategori_kesehatan = Kategori(
            nama='Kesehatan',
            deskripsi='Tips kesehatan dan perkembangan medis'
        )

        dbsession.add_all([kategori_politik, kategori_teknologi, kategori_kesehatan])
        dbsession.flush()

        # ✅ Create the "admin" user
        admin_user = User(
            username='admin',
            password_hash=''  # This will be set by the `set_password` method
        )
        admin_user.set_password('adminpassword')  # Set the password for the "admin" user

        dbsession.add(admin_user)

        # ✅ Create 30 articles (10 per kategori)
        base_konten = {
            'Politik': "Pemilu {tahun} akan segera dimulai. Partai politik mulai menyusun strategi. KPU telah mengumumkan tahapan pemilu yang berlangsung sampai April {tahun}. Fokus kampanye mencakup ekonomi, infrastruktur, dan pendidikan. Masyarakat diimbau menjaga netralitas dan ikut serta secara aktif dalam proses demokrasi.\n\nKPU menekankan pentingnya verifikasi data pemilih serta meningkatkan transparansi melalui rekapitulasi digital. Simulasi logistik dan distribusi perlengkapan TPS sedang dilakukan. Semua pihak berharap pemilu berjalan jujur, adil, dan damai.\n\nSebanyak {jumlah_partai} partai akan ikut serta, membawa isu-isu yang krusial bagi masa depan bangsa. Debat capres akan menjadi ajang penting untuk menilai visi-misi calon pemimpin. Publik diminta kritis dalam menerima informasi agar tidak terjebak hoaks.",
            'Teknologi': "Tahun {tahun} menjadi tonggak kemajuan AI di Indonesia. Teknologi seperti LLM, chatbot, dan sistem rekomendasi semakin canggih. Penggunaan AI di bidang kesehatan memungkinkan diagnosa lebih cepat dan akurat.\n\nAI juga merevolusi pendidikan dengan pembelajaran adaptif. Industri kreatif memanfaatkan AI untuk membuat musik, desain, dan tulisan yang tak kalah dengan buatan manusia. Namun, tantangan etika dan regulasi tetap perlu diwaspadai.\n\nPemerintah menyusun kebijakan terkait penggunaan AI agar tidak disalahgunakan. Kolaborasi antara riset dan industri sangat penting untuk memastikan AI dikembangkan secara bertanggung jawab.",
            'Kesehatan': "Menjaga kesehatan mental di tengah kesibukan adalah hal penting. Strategi seperti olahraga rutin, meditasi, dan manajemen waktu efektif sangat membantu. Nutrisi juga berperan besar dalam menjaga keseimbangan suasana hati.\n\nInteraksi sosial yang sehat dan konsultasi dengan profesional jika diperlukan sangat disarankan. Aplikasi kesehatan mental kini mudah diakses dan mendukung proses pemulihan individu dari stres dan tekanan psikologis.\n\nMindfulness menjadi pendekatan populer untuk mengelola emosi dan meningkatkan kesadaran diri. Dengan langkah yang tepat, setiap orang bisa menjaga keseimbangan mental demi kualitas hidup yang lebih baik."
        }

        categories = [
            ('Politik', kategori_politik),
            ('Teknologi', kategori_teknologi),
            ('Kesehatan', kategori_kesehatan)
        ]

        artikel_list = []
        for i in range(30):
            kategori_nama, kategori_obj = categories[i % 3]
            tanggal = date(2025, 5, 1) + timedelta(days=i)
            tahun = tanggal.year
            jumlah_partai = 16 + (i % 5)

            judul = f"{kategori_nama} Update #{i + 1}"
            konten_template = base_konten[kategori_nama]
            konten = konten_template.format(tahun=tahun, jumlah_partai=jumlah_partai)

            artikel = Artikel(
                judul=judul,
                konten=konten,
                penulis='chef',
                kategori_id=kategori_obj.id,
                tanggal_publikasi=tanggal,
                status='published' if i % 2 == 0 else 'draft'
            )
            artikel_list.append(artikel)

        dbsession.add_all(artikel_list)

if __name__ == '__main__':
    main()