import React from 'react';
import { Topic, SessionConfig } from './types';
import { 
  Network, Globe, Server, Database, Shield, 
  Mail, HardDrive, Lock, Terminal, Activity,
  Users, Clock, Cpu, FileText, Layers, Archive
} from 'lucide-react';

export const DEFAULT_CONFIG: SessionConfig = {
  id: 'default-1',
  name: 'Server Utama',
  os: 'debian',
  ipAddress: '192.168.1.10',
  hostname: 'server01',
  username: 'admin',
  domain: 'contoh.com',
  port: 22
};

export const TOPICS: Topic[] = [
  {
    id: 'network-ip',
    category: 'Jaringan',
    title: 'Konfigurasi Alamat IP',
    icon: <Network className="w-5 h-5" />,
    description: 'Mengatur alamat IP statis menggunakan /etc/network/interfaces.',
    aiPromptContext: 'Konfigurasi jaringan Linux Debian, /etc/network/interfaces, perintah ip',
    steps: [
      {
        id: 'check-ip',
        title: 'Cek IP Saat Ini',
        description: 'Verifikasi antarmuka jaringan yang aktif saat ini.',
        commandTemplate: 'ip addr show',
        highlightedVars: []
      },
      {
        id: 'edit-interfaces',
        title: 'Edit File Interfaces',
        description: 'Buka file konfigurasi jaringan.',
        commandTemplate: 'sudo nano /etc/network/interfaces',
        highlightedVars: []
      },
      {
        id: 'static-config',
        title: 'Konfigurasi IP Statis',
        description: 'Tempelkan ini ke dalam file. Ganti nama antarmuka (misal: eth0) jika perlu.',
        commandTemplate: `auto eth0
iface eth0 inet static
    address {{IP}}
    netmask 255.255.255.0
    gateway 192.168.1.1
    dns-nameservers 8.8.8.8 8.8.4.4`,
        highlightedVars: ['{{IP}}']
      },
      {
        id: 'restart-net',
        title: 'Mulai Ulang Jaringan',
        description: 'Terapkan perubahan konfigurasi.',
        commandTemplate: 'sudo systemctl restart networking',
        highlightedVars: []
      }
    ]
  },
  {
    id: 'firewall-ufw',
    category: 'Keamanan',
    title: 'Firewall (UFW)',
    icon: <Shield className="w-5 h-5" />,
    description: 'Mengelola firewall sederhana dengan Uncomplicated Firewall.',
    aiPromptContext: 'Linux UFW firewall configuration, allow deny ports, enable firewall',
    steps: [
      {
        id: 'install-ufw',
        title: 'Instalasi UFW',
        description: 'Pastikan UFW terpasang.',
        commandTemplate: 'sudo apt install ufw -y',
        highlightedVars: []
      },
      {
        id: 'allow-ssh',
        title: 'Izinkan SSH',
        description: 'PENTING: Izinkan port SSH agar tidak terkunci.',
        commandTemplate: 'sudo ufw allow {{PORT}}/tcp',
        highlightedVars: ['{{PORT}}']
      },
      {
        id: 'allow-web',
        title: 'Izinkan Web Server',
        description: 'Buka port HTTP dan HTTPS.',
        commandTemplate: 'sudo ufw allow 80/tcp\nsudo ufw allow 443/tcp',
        highlightedVars: []
      },
      {
        id: 'enable-ufw',
        title: 'Aktifkan Firewall',
        description: 'Menyalakan firewall.',
        commandTemplate: 'sudo ufw enable',
        highlightedVars: []
      },
      {
        id: 'status-ufw',
        title: 'Cek Status',
        description: 'Lihat aturan yang aktif.',
        commandTemplate: 'sudo ufw status verbose',
        highlightedVars: []
      }
    ]
  },
  {
    id: 'user-management',
    category: 'Sistem',
    title: 'Manajemen Pengguna',
    icon: <Users className="w-5 h-5" />,
    description: 'Menambah, menghapus, dan mengelola hak akses pengguna.',
    aiPromptContext: 'Linux user management, adduser, usermod, sudo privileges',
    steps: [
      {
        id: 'add-user',
        title: 'Tambah Pengguna Baru',
        description: 'Membuat akun pengguna baru dengan direktori home.',
        commandTemplate: 'sudo adduser nama_pengguna_baru',
        highlightedVars: ['nama_pengguna_baru']
      },
      {
        id: 'grant-sudo',
        title: 'Berikan Akses Sudo',
        description: 'Menambahkan pengguna ke grup sudo.',
        commandTemplate: 'sudo usermod -aG sudo nama_pengguna_baru',
        highlightedVars: ['nama_pengguna_baru']
      },
      {
        id: 'delete-user',
        title: 'Hapus Pengguna',
        description: 'Menghapus pengguna beserta direktori home-nya.',
        commandTemplate: 'sudo deluser --remove-home nama_pengguna_lama',
        highlightedVars: ['nama_pengguna_lama']
      }
    ]
  },
  {
    id: 'dns-bind9',
    category: 'Jaringan',
    title: 'DNS Server (Bind9)',
    icon: <Globe className="w-5 h-5" />,
    description: 'Setup server DNS lokal menggunakan Bind9.',
    aiPromptContext: 'Bind9 DNS server configuration on Debian, named.conf.local, zone files',
    steps: [
      {
        id: 'install-bind9',
        title: 'Instal Bind9',
        description: 'Pasang paket-paket yang diperlukan.',
        commandTemplate: 'sudo apt update && sudo apt install bind9 bind9utils bind9-doc -y',
        highlightedVars: []
      },
      {
        id: 'config-local',
        title: 'Konfigurasi Zona Lokal',
        description: 'Edit /etc/bind/named.conf.local untuk menambahkan zona Anda.',
        commandTemplate: `zone "{{DOMAIN}}" {
    type master;
    file "/etc/bind/db.{{DOMAIN}}";
};`,
        highlightedVars: ['{{DOMAIN}}']
      },
      {
        id: 'create-zone-file',
        title: 'Buat File Zona',
        description: 'Buat file database untuk domain Anda.',
        commandTemplate: `sudo cp /etc/bind/db.local /etc/bind/db.{{DOMAIN}}
sudo nano /etc/bind/db.{{DOMAIN}}`,
        highlightedVars: ['{{DOMAIN}}']
      }
    ]
  },
  {
    id: 'web-nginx',
    category: 'Web Server',
    title: 'Web Server Nginx',
    icon: <Server className="w-5 h-5" />,
    description: 'Konfigurasi web server berkinerja tinggi.',
    aiPromptContext: 'Nginx web server setup, server blocks, sites-available',
    steps: [
      {
        id: 'install-nginx',
        title: 'Instal Nginx',
        description: 'Pasang Nginx dari repositori apt.',
        commandTemplate: 'sudo apt install nginx -y',
        highlightedVars: []
      },
      {
        id: 'create-vhost',
        title: 'Buat Server Block',
        description: 'Buat konfigurasi untuk domain Anda.',
        commandTemplate: 'sudo nano /etc/nginx/sites-available/{{DOMAIN}}',
        highlightedVars: ['{{DOMAIN}}']
      },
      {
        id: 'vhost-content',
        title: 'Isi Server Block',
        description: 'Konfigurasi dasar Nginx.',
        commandTemplate: `server {
    listen 80;
    listen [::]:80;
    server_name {{DOMAIN}} www.{{DOMAIN}};
    root /var/www/{{DOMAIN}};
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}`,
        highlightedVars: ['{{DOMAIN}}']
      },
      {
        id: 'enable-site',
        title: 'Aktifkan Situs',
        description: 'Tautkan konfigurasi ke sites-enabled.',
        commandTemplate: `sudo ln -s /etc/nginx/sites-available/{{DOMAIN}} /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx`,
        highlightedVars: ['{{DOMAIN}}']
      }
    ]
  },
  {
    id: 'web-apache',
    category: 'Web Server',
    title: 'Web Server Apache2',
    icon: <Activity className="w-5 h-5" />,
    description: 'Server HTTP yang tangguh dan banyak digunakan.',
    aiPromptContext: 'Apache2 web server, virtual hosts, a2ensite',
    steps: [
      {
        id: 'install-apache',
        title: 'Instal Apache2',
        description: '',
        commandTemplate: 'sudo apt install apache2 -y',
        highlightedVars: []
      },
      {
        id: 'config-apache',
        title: 'Konfigurasi Virtual Host',
        description: 'Buat file konfigurasi.',
        commandTemplate: 'sudo nano /etc/apache2/sites-available/{{DOMAIN}}.conf',
        highlightedVars: ['{{DOMAIN}}']
      },
      {
        id: 'apache-content',
        title: 'Isi Konfigurasi',
        description: 'VirtualHost Apache standar.',
        commandTemplate: `<VirtualHost *:80>
    ServerName {{DOMAIN}}
    ServerAlias www.{{DOMAIN}}
    DocumentRoot /var/www/{{DOMAIN}}
    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>`,
        highlightedVars: ['{{DOMAIN}}']
      },
      {
        id: 'enable-apache',
        title: 'Aktifkan Situs',
        description: '',
        commandTemplate: `sudo a2ensite {{DOMAIN}}.conf
sudo systemctl reload apache2`,
        highlightedVars: ['{{DOMAIN}}']
      }
    ]
  },
  {
    id: 'dhcp-isc',
    category: 'Jaringan',
    title: 'ISC DHCP Server',
    icon: <Network className="w-5 h-5" />,
    description: 'Kelola pemberian IP secara dinamis.',
    aiPromptContext: 'ISC DHCP Server, dhcpd.conf, interfacesv4',
    steps: [
      {
        id: 'install-dhcp',
        title: 'Instal DHCP Server',
        description: '',
        commandTemplate: 'sudo apt install isc-dhcp-server -y',
        highlightedVars: []
      },
      {
        id: 'config-interface',
        title: 'Tentukan Antarmuka',
        description: 'Tentukan antarmuka mana yang didengarkan DHCP.',
        commandTemplate: 'sudo nano /etc/default/isc-dhcp-server',
        highlightedVars: []
      },
      {
        id: 'config-dhcp',
        title: 'Konfigurasi Subnet',
        description: 'Edit dhcpd.conf.',
        commandTemplate: 'sudo nano /etc/dhcp/dhcpd.conf',
        highlightedVars: []
      },
      {
        id: 'subnet-content',
        title: 'Contoh Subnet',
        description: 'Ganti detail subnet sesuai kebutuhan.',
        commandTemplate: `subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.1;
    option domain-name-servers 8.8.8.8, 8.8.4.4;
    option domain-name "{{DOMAIN}}";
}`,
        highlightedVars: ['{{DOMAIN}}']
      }
    ]
  },
  {
    id: 'file-permissions',
    category: 'Sistem',
    title: 'Izin File & Kepemilikan',
    icon: <FileText className="w-5 h-5" />,
    description: 'Mengelola hak akses file (chmod) dan kepemilikan (chown).',
    aiPromptContext: 'Linux file permissions, chmod, chown, recursive permissions',
    steps: [
      {
        id: 'chmod-basic',
        title: 'Ubah Izin (Chmod)',
        description: 'Memberikan izin baca, tulis, eksekusi (rwx). 755 umum untuk direktori web.',
        commandTemplate: 'sudo chmod 755 /var/www/{{DOMAIN}}',
        highlightedVars: ['/var/www/{{DOMAIN}}']
      },
      {
        id: 'chown-basic',
        title: 'Ubah Pemilik (Chown)',
        description: 'Mengubah pemilik file ke www-data (untuk web server).',
        commandTemplate: 'sudo chown -R www-data:www-data /var/www/{{DOMAIN}}',
        highlightedVars: ['www-data:www-data']
      },
      {
        id: 'make-exec',
        title: 'Jadikan Eksekusi',
        description: 'Membuat script bisa dijalankan.',
        commandTemplate: 'chmod +x nama_script.sh',
        highlightedVars: ['nama_script.sh']
      }
    ]
  },
  {
    id: 'storage-raid',
    category: 'Penyimpanan',
    title: 'Konfigurasi RAID',
    icon: <HardDrive className="w-5 h-5" />,
    description: 'Kelola software RAID dengan mdadm.',
    aiPromptContext: 'Linux mdadm RAID configuration, raid levels, creating arrays',
    steps: [
      {
        id: 'install-mdadm',
        title: 'Instal mdadm',
        description: '',
        commandTemplate: 'sudo apt install mdadm -y',
        highlightedVars: []
      },
      {
        id: 'create-raid',
        title: 'Buat Array RAID 1',
        description: 'Contoh membuat /dev/md0 dari sdb dan sdc.',
        commandTemplate: 'sudo mdadm --create --verbose /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc',
        highlightedVars: ['/dev/md0', '/dev/sdb', '/dev/sdc']
      },
      {
        id: 'save-raid',
        title: 'Simpan Konfigurasi',
        description: 'Persistenkan array RAID.',
        commandTemplate: 'sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf',
        highlightedVars: []
      }
    ]
  },
  {
    id: 'system-monitoring',
    category: 'Sistem',
    title: 'Monitoring & Proses',
    icon: <Cpu className="w-5 h-5" />,
    description: 'Memantau kinerja sistem dan mengelola layanan.',
    aiPromptContext: 'Linux process monitoring, htop, systemctl, journalctl',
    steps: [
      {
        id: 'install-htop',
        title: 'Instal Htop',
        description: 'Alat pemantauan interaktif yang lebih baik dari top.',
        commandTemplate: 'sudo apt install htop -y',
        highlightedVars: []
      },
      {
        id: 'check-service',
        title: 'Cek Status Layanan',
        description: 'Memeriksa apakah layanan berjalan.',
        commandTemplate: 'sudo systemctl status nama_layanan',
        highlightedVars: ['nama_layanan']
      },
      {
        id: 'view-logs',
        title: 'Lihat Log Sistem',
        description: 'Melihat log real-time dari systemd.',
        commandTemplate: 'sudo journalctl -u nama_layanan -f',
        highlightedVars: ['nama_layanan']
      }
    ]
  },
  {
    id: 'security-ssh',
    category: 'Keamanan',
    title: 'SSH & OpenSSL',
    icon: <Lock className="w-5 h-5" />,
    description: 'Akses shell aman dan pembuatan sertifikat.',
    aiPromptContext: 'SSH configuration, sshd_config, OpenSSL certificate generation',
    steps: [
      {
        id: 'ssh-config',
        title: 'Edit Konfigurasi SSH',
        description: 'Perketat keamanan SSH.',
        commandTemplate: 'sudo nano /etc/ssh/sshd_config',
        highlightedVars: []
      },
      {
        id: 'generate-keys',
        title: 'Buat Pasangan Kunci SSH',
        description: 'Jalankan ini di mesin klien.',
        commandTemplate: 'ssh-keygen -t rsa -b 4096',
        highlightedVars: []
      },
      {
        id: 'copy-id',
        title: 'Salin ID ke Server',
        description: '',
        commandTemplate: 'ssh-copy-id -p {{PORT}} {{USERNAME}}@{{IP}}',
        highlightedVars: ['{{USERNAME}}', '{{IP}}', '{{PORT}}']
      },
      {
        id: 'openssl-csr',
        title: 'Buat CSR',
        description: 'Membuat Certificate Signing Request.',
        commandTemplate: 'openssl req -new -newkey rsa:2048 -nodes -keyout {{DOMAIN}}.key -out {{DOMAIN}}.csr',
        highlightedVars: ['{{DOMAIN}}']
      }
    ]
  },
  {
    id: 'mail-stack',
    category: 'Mail',
    title: 'Server Email Stack',
    icon: <Mail className="w-5 h-5" />,
    description: 'Postfix, Dovecot, Roundcube, MariaDB.',
    aiPromptContext: 'Linux mail server, Postfix, Dovecot, Roundcube, MariaDB',
    steps: [
      {
        id: 'install-stack',
        title: 'Instal Paket',
        description: 'Pasang komponen inti email.',
        commandTemplate: 'sudo apt install postfix dovecot-core dovecot-imapd mariadb-server -y',
        highlightedVars: []
      },
      {
        id: 'configure-postfix',
        title: 'Konfigurasi Postfix',
        description: 'Edit main.cf.',
        commandTemplate: 'sudo nano /etc/postfix/main.cf',
        highlightedVars: []
      },
      {
        id: 'roundcube',
        title: 'Instal Roundcube',
        description: 'Antarmuka webmail.',
        commandTemplate: 'sudo apt install roundcube roundcube-mysql -y',
        highlightedVars: []
      }
    ]
  },
  {
    id: 'docker-basic',
    category: 'Kontainer',
    title: 'Docker Dasar',
    icon: <Layers className="w-5 h-5" />,
    description: 'Instalasi dan penggunaan dasar Docker.',
    aiPromptContext: 'Install docker on linux, docker run command, docker ps',
    steps: [
      {
        id: 'install-docker',
        title: 'Instal Docker',
        description: 'Mengunduh dan menjalankan skrip instalasi otomatis.',
        commandTemplate: 'curl -fsSL https://get.docker.com -o get-docker.sh\nsudo sh get-docker.sh',
        highlightedVars: []
      },
      {
        id: 'docker-permission',
        title: 'Izin Pengguna Docker',
        description: 'Menjalankan docker tanpa sudo (harus logout login kembali).',
        commandTemplate: 'sudo usermod -aG docker {{USERNAME}}',
        highlightedVars: ['{{USERNAME}}']
      },
      {
        id: 'run-container',
        title: 'Jalankan Kontainer Test',
        description: 'Coba jalankan nginx.',
        commandTemplate: 'docker run -d -p 8080:80 --name webserver nginx',
        highlightedVars: []
      }
    ]
  },
  {
    id: 'cron-jobs',
    category: 'Otomatisasi',
    title: 'Penjadwalan (Cron)',
    icon: <Clock className="w-5 h-5" />,
    description: 'Otomatisasi tugas berulang dengan crontab.',
    aiPromptContext: 'Linux cron jobs, crontab syntax, scheduling tasks',
    steps: [
      {
        id: 'edit-cron',
        title: 'Edit Crontab',
        description: 'Membuka editor untuk user saat ini.',
        commandTemplate: 'crontab -e',
        highlightedVars: []
      },
      {
        id: 'list-cron',
        title: 'Lihat Daftar Tugas',
        description: 'Melihat tugas yang sudah dijadwalkan.',
        commandTemplate: 'crontab -l',
        highlightedVars: []
      },
      {
        id: 'cron-example',
        title: 'Contoh Syntax',
        description: 'Jalankan script backup setiap jam 3 pagi.',
        commandTemplate: '0 3 * * * /home/{{USERNAME}}/scripts/backup.sh',
        highlightedVars: ['/home/{{USERNAME}}/scripts/backup.sh']
      }
    ]
  },
   {
    id: 'vpn',
    category: 'Keamanan',
    title: 'Server VPN',
    icon: <Shield className="w-5 h-5" />,
    description: 'Setup OpenVPN atau Wireguard.',
    aiPromptContext: 'VPN server Linux, OpenVPN, Wireguard',
    steps: [
      {
        id: 'install-openvpn',
        title: 'Instal OpenVPN',
        description: '',
        commandTemplate: 'sudo apt install openvpn easy-rsa -y',
        highlightedVars: []
      },
      {
        id: 'wg-install',
        title: 'Instal Wireguard (Alternatif)',
        description: 'Protokol VPN yang lebih baru dan cepat.',
        commandTemplate: 'sudo apt install wireguard -y',
        highlightedVars: []
      }
    ]
  }
];