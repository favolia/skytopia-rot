import quick from '../quick.js';
/*
 * Selamat datang di Lang Paper!
 * Pengembang Utama: Mo9ses
 * Catatan: File ini dimaksudkan untuk mengambil IP, nama pengguna, dan kode realm dari orang-orang yang menggunakan .
 * Pengembang Sub: TIDAK ADA!
*/
const Lang = {};
export default Lang;
export const updateLang = () => Object.assign(Lang, {
    setup: {
        version: '§6 Versi: §eV3 bagian 2, Cahaya!§6, Mesin Min: §e1.19.40§6\nAPI: §3 Cahaya§6,\nBETA: §eYA§6, J: §eTIDAK§e\nDikodekan dan Dirancang oleh Mo9ses, Hak cipta 2023 semua hak dilindungi.§r',
        loaded: (ms) => ` telah dimuat dalam §6${ms}§e milidetik!§r`,
    },
    cmd: {
        unknown: (prefix, admin) => `Perintah tidak dikenal! Pastikan kamu memiliki izin untuk menggunakan perintah tersebut dan pastikan ejaannya benar. Ketik "§6${prefix}help§e" di chat untuk melihat daftar perintah yang tersedia${admin ? '' : `. "§7/tag @s add ${quick.adminTag}§e" akan memberi kamu izin admin.`}`,
        useForm: 'Perintah ini tidak dapat dieksekusi dalam chat. Gunakan "§6!ui§e" untuk menjalankannya sebagai perintah formulir.§r',
        wrongPrefix: (prefix) => `Maaf, awalan di server ini sekarang menjadi "§6${prefix}§e"`,
        noArgs: 'Perintah ini tidak memiliki argumen! Kamu hanya perlu mengetik perintahnya.',
        notAArg: (prefix, cmd, before, err, after, tip) => `Tidak yakin apa yang kamu maksud dengan "§6${prefix + cmd}§e${before.length ? ` ${before.join(' ')}` : ''}§r §g${err}§r§6${after ? ` §g${after}` : ''}§r§e".... §g${err[0].toUpperCase() + err.slice(1)}§r§e bukan argumen yang valid.${tip ? ` Mungkin coba ketik §a${tip}§e?` : ''}`,
        noPerms: `Kamu tidak memiliki izin untuk menjalankan perintah ini. "§7/tag @s add ${quick.adminTag}§e" akan memberi kamu izin admin.§r`,
        noArgPerm: 'Kamu tidak memiliki izin untuk menjalankan argumen ini. Bagaimana kamu tahu tentang itu?',
        missingArgs: (prefix, cmd, args, tip) => `Perintah yang kamu ketik: "§6${prefix + cmd}${args.length ? ' ' + args.join(' ') : ''}§e" kekurangan argumen!${tip ? ` Mungkin coba ketik §a${tip}§e di akhir.` : ''} Jika kamu membutuhkan bantuan lebih lanjut, ketik "§6${prefix}help ${cmd}§e" di chat :)`,
        maxArgs: (error) => `Kamu mengetik terlalu banyak argumen! Coba hapus "§f${error}§r§e".`,
        needVal: (prefix, val) => `Kamu perlu mengetikkan sebuah nama! Jika kamu membutuhkan bantuan lebih lanjut, ketik "§6${prefix}help ${val}§e" di chat.`,
        valErr: (prefix, val) => `Nilai yang kamu ketik salah. Jika kamu membutuhkan bantuan lebih lanjut, ketik "§6${prefix}help ${val}§e" di chat.§r`,
        openQou: `Sepertinya kamu memiliki tanda kutip yang terbuka di suatu tempat. Mungkin tutupnya?`,
        missingPlr: (val) => `Kamu perlu mengetikkan nama pemain. Apakah kamu bermaksud mengetik "§6${val}§e"?`,
    },
    chat: {
        mutted: 'Maaf, kamu telah dibisukan oleh  atau seorang admin',
    }
});
