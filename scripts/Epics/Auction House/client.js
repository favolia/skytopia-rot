import { metricNumbers } from '../../Papers/Paragraphs/ConvertersParagraphs.js';
import { confirmForm } from '../../Papers/Paragraphs/ExtrasParagraphs.js';
import { ActionForm, MessageForm } from '../../Papers/FormPaper.js';
import { newItem } from '../../Papers/Paragraphs/itemParagraph.js';
import { serverPosts } from './server.js';
import { createPost } from './create.js';
import { openPost } from './open.js';
import { AH } from './main.js';
import Database from '../../Papers/DatabasePaper.js';
export async function clientPosts(player, from) {
    const allPosts = AH.client.read(player.rID, 'AHP');
    //Checks if there are any
    if (!allPosts.length)
        return await confirmForm(player, '§8§lBuat lelang baru?§r', 'Tampaknya kamu belum membuat lelang apa pun... Maukah kamu membuat satu?') ? createPost(player, clientPosts) : AH.openAH(player);
    //Creates the client auction screen
    const ah = new ActionForm();
    ah.setTitle('§8§lLelangmu§r');
    ah.setBody('§7Ini adalah semua lelang milikmu yang sedang berlangsung! Klik pada masing-masing untuk melihat detailnya.§r');
    ah.addButton('§6§lBuat lelang baru§r', 'textures/ROT/forms/Auction House/new.png');
    //Add a button for each client auction
    for (const p of allPosts) {
        const post = await AH.getPost(p);
        if (post)
            ah.addButton(`§c§l${post.name.length > 10 ? post.name.slice(0, 12) + '...' : post.name}\n§6${post.bids[0] ? `Penawaran Tertinggi: §a$${metricNumbers(post.price)}` : 'Tidak ada penawaran...'}§r`, `textures/ROT/forms/Auction House/random${~~(Math.random() * 8) + 1}.png`);
    }
    ah.addButton('§c§lLihat semua Lelang§r', 'textures/ROT/forms/Auction House/global.png');
    ah.addButton('§c§lKembali§r', 'textures/ROT/forms/Auction House/leave.png');
    ah.send(player, res => {
        if (res.canceled)
            return AH.openAH(player);
        if (res.selection === 0)
            return createPost(player, clientPosts);
        if (res.selection === allPosts.length + 1)
            return serverPosts(player, AH.openAH);
        if (res.selection === allPosts.length + 2)
            return from(player, clientPosts);
        if (res.selection <= allPosts.length)
            openPost(player, allPosts[res.selection - 1], clientPosts);
    });
}
//Exporting function that shows all of the auctions the player has bidded on
export async function clientBids(player, from) {
    const allBids = AH.client.read(player.rID, 'AHB');
    //Checks if there are any
    if (!allBids.length)
        return await confirmForm(player, '§c§lTidak punya uang?...§r', 'Belum ada penawaran yang kamu lakukan pada lelang... Maukah kamu melakukan penawaran pada salah satu?') ? serverPosts(player, AH.openAH) : AH.openAH(player);
    //Creates the client auction screen
    const ah = new ActionForm();
    ah.setTitle('§8§lLelangmu§r');
    ah.setBody('§7Berikut adalah lelang aktif yang kamu ikuti. Jika tidak terlihat di sini, kemungkinan sudah selesai.§r');
    //Add a button for each client auction
    for (const p of allBids) {
        const post = await AH.getPost(p);
        if (post)
            ah.addButton(`§c§l${post.name.length > 10 ? post.name.slice(0, 12) + '...' : post.name}\n${post.bidID[0] === player.rID ? '§aPemenang' : '§cKalah'}§r`, `textures/ROT/forms/Auction House/random${~~(Math.random() * 8) + 1}.png`);
    }
    ah.addButton('§c§lLihat semua Lelang§r', 'textures/ROT/forms/Auction House/global.png');
    ah.addButton('§c§lKembali§r', 'textures/ROT/forms/Auction House/leave.png');
    ah.send(player, res => {
        if (res.canceled)
            return AH.openAH(player);
        if (res.selection === allBids.length)
            return serverPosts(player, clientBids);
        if (res.selection === allBids.length + 1)
            return from(player, clientBids);
        if (res.selection < allBids.length)
            openPost(player, allBids[res.selection], clientBids);
    });
}
export async function clientCollect(player) {
    const collect = AH.client.read(player.rID, 'AHC'), sold = AH.client.read(player.rID, 'AHS');
    if (!collect.length && !sold.length)
        return await confirmForm(player, '§c§lTidak ada apapun?...§r', 'Kamu tidak memiliki barang atau uang untuk dikumpulkan. Maukah kamu membuat lelang?') ? createPost(player, serverPosts) : AH.openAH(player);
    const form = new ActionForm();
    form.setTitle('§8§lKumpulkan barang§r');
    form.setBody('§aIni adalah semua lelang yang berhasil kamu menangkan dan mendapatkan keuntungan.§r');
    if (collect)
        for (const c of collect) {
            const values = (await Database.register(c, 'AHC')).readMany(['n', 'i', 'w']), won = values[2]?.[0] === player.rID;
            form.addButton(`§c§l${values[0] ?? values[1]}\n§6${won ? 'Kumpulkan barang' : '§4Lelang Gagal!'}§r`, `textures/ROT/forms/Auction House/${won ? 'collect' : 'fail'}.png`);
        }
    sold?.forEach(s => form.addButton(`§c§l${s[0]}\n§6Collect $${metricNumbers(s[1])}§r`, `textures/ROT/forms/Auction House/coins.png`));
    form.addButton('§a§lPerbarui§r', 'textures/ROT/forms/Auction House/refresh.png');
    form.addButton('§c§lKembali§r', 'textures/ROT/forms/Auction House/leave.png');
    form.send(player, async (res) => {
        let index = res.selection;
        const both = sold.length + collect.length;
        if (res.selection === both)
            return clientCollect(player);
        if (res.canceled || res.selection === both + 1)
            return AH.openAH(player);
        //Collect money
        if (index >= collect.length) {
            index = res.selection - collect.length;
            const profit = new MessageForm();
            profit.setTitle('§a§lSelamat!§r');
            profit.setBody(`§a§lKeren!§r Kamu mendapatkan §c§l${metricNumbers(sold[index][1])} §6${AH.config.currency}§r dari lelangmu yang §4§l${sold[index][0]}§r. Apakah kamu ingin membuat lelang lainnya?`);
            profit.setButton1('§a§lTentu!§r');
            profit.setButton2('§c§lTidak§r');
            return profit.send(player, res => {
                res.selection ? both === 1 ? AH.openAH(player) : clientCollect(player) : player.send('Kembali lagi nanti!');
                player.runCommandAsync(`scoreboard players add @s "${AH.config.obj}" ${sold[index][1]}`);
                AH.client.update(player.rID, 'AHS', 'remove', sold[index]);
            });
        }
        if (!Database.has(collect[index], 'AHC'))
            return AH.errorForm(player, clientCollect, 'Tidak dapat menemukan data pengumpulan');
        const db = (await Database.register(collect[index], 'AHC')).getCollection();
        //No people bidded
        if (!db?.w?.length) {
            const failed = new MessageForm();
            failed.setTitle('§4§lLelang Gagal§r');
            failed.setBody(`Tampaknya tidak ada yang mau membayar sepeser pun untuk barangmu yang bernama "§c§l${db?.n ?? db.i}§r". Ingin ambil kembali?`);
            failed.setButton1('§aTentu!§r');
            failed.setButton2('§cNgga, ambil aja§r');
            return failed.send(player, async (res) => {
                if (res.canceled)
                    return AH.openAH(player);
                if (!Database.has(collect[index], 'AHC'))
                    return AH.errorForm(player, clientCollect, 'Tidak dapat menemukan data pengumpulan');
                const success = new MessageForm();
                success.setTitle('§a§lSelesai!§r');
                success.setBody('Lelang tersebut telah dihapus bersama dengan barangnya!');
                success.setButton1('§a§lLihat lelang lainnya§r');
                success.setButton2('§4§lTutup§r');
                if (res.selection) {
                    player.getComponent('inventory').container.addItem(newItem((await Database.register(db.d, 'AHI')).read('')));
                    success.setBody('Lelang telah dihapus, dan barang telah dikembalikan ke kamu.');
                }
                success.send(player, res => res.selection ? both === 1 ? serverPosts(player, AH.openAH) : clientCollect(player) : player.send('Kembali lagi nanti!'));
                Database.drop(db.d, 'AHI');
                Database.drop(collect[index], 'AHC');
                AH.client.update(player.rID, 'AHC', 'remove', collect[index]);
            });
        }
        //People bidded
        if (db?.w[0] !== player.rID)
            return AH.errorForm(player, clientCollect, 'Tidak dapat memverifikasi bahwa kamu adalah penawar teratas.');
        let keepersKeep = ~~(db.w[1] / 100) * AH.config.buyersPremiumPercent[0];
        if (keepersKeep > AH.config.buyersPremiumPercent[1])
            keepersKeep = AH.config.buyersPremiumPercent[1];
        const agree = new MessageForm();
        agree.setTitle('§a§lKamu memenangkan sebuah lelang!§r');
        agree.setBody([
            '§a§lInformasi Lelang:§r',
            ` §3Nama Lelang: §4${db?.n ?? db.i}`,
            ` §3Barang: §4${db.i}`,
            ` §3Jumlah: §4${db.a}`,
            ` §3Tawaran Awal: §c${metricNumbers(db.p)}`,
            ` §3Harga: §c${metricNumbers(db.w[1])}`,
            ` §3Lelang Rahasia: §c${db.c[2] ? true : false}`,
            ` §3Pembayaran dari Pembeli: §c${keepersKeep}`
        ].join('\n'));
        agree.setButton1('§2§lLet\'s goo!!§r');
        agree.setButton2('§4§lTutup§r');
        agree.send(player, async (res) => {
            if (res.canceled || !res.selection)
                return clientCollect(player);
            if (!Database.has(collect[index], 'AHC'))
                return AH.errorForm(player, clientCollect, 'Tidak dapat menemukan data pengumpulan.');
            const done = new MessageForm();
            done.setTitle('§a§lBaiklah!§r');
            if (player.getScore(AH.config.obj) < keepersKeep)
                return player.send(`§c§lError §7-§r Kamu tidak memiliki cukup uang untuk membayar Pembayaran dari Pembeli. Kamu berhutang padaku §c$${Math.abs(player.getScore(AH.config.obj) - keepersKeep)}§6 ${AH.config.obj}§r!`);
            player.runCommandAsync(`scoreboard players remove @s "${AH.config.obj}" ${keepersKeep}`);
            done.setBody('§l§6Wow!§r Barangmu telah diberikan kepadamu!');
            player.getComponent('inventory').container.addItem(newItem((await Database.register(db.d, 'AHI')).read('')));
            Database.drop(db.d, 'AHI');
            Database.drop(collect[index], 'AHC');
            AH.client.update(player.rID, 'AHC', 'remove', collect[index]);
            AH.client.update(db.c[0], 'AHS', 'add', [db?.n ?? db.i, db.w[1]]);
            done.setButton1('§a§lOk!§r');
            done.setButton2('§c§lTutup§r');
            done.send(player, res => res.selection ? both === 1 ? AH.openAH(player) : clientCollect(player) : player.send('Kembali lagi nanti!'));
        });
    });
}
//These are for the ping icon
export const bidPING = (player) => AH.client.read(player.rID, 'AHB').some(async (p) => (await AH.getPost(p))?.bidID[0] !== player.rID);
export const collectPING = (player) => Boolean(AH.client.read(player.rID, 'AHC').length || AH.client.read(player.rID, 'AHS')?.length);
