import { ActionForm, MessageForm } from "../../Papers/FormPaper.js";
import { MS, numberToHex } from "../../Papers/Paragraphs/ConvertersParagraphs.js";
import { confirmForm } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import { AH } from "./main.js";
import Database from "../../Papers/DatabasePaper.js";
import Player from "../../Papers/PlayerPaper.js";
export function managementForm(player) {
    if (!player.isAdmin)
        return AH.errorForm(player, managementForm, 'Pemain tidak memiliki akses ke formulir ini');
    const dev = new ActionForm();
    dev.setTitle('§c§lManagement Page§r');
    dev.setBody('§c§cSelamat datang di Halaman Manajemen!§r');
    dev.addButton('§c§lKembalikan semua barang§r', 'textures/ROT/forms/Auction House/block.png');
    dev.addButton('§e§lMengakhiri semua lelang§r', 'textures/ROT/forms/Auction House/ultra.png');
    dev.addButton('§8§lMenghapus semua lelang§r', 'textures/ROT/forms/Auction House/garbage.png');
    dev.addButton('§c§lKembali§r', 'textures/ROT/forms/Auction House/leave.png');
    dev.send(player, async (res) => {
        if (res.selection === 3 || res.canceled)
            return AH.openAH(player);
        if (!(await confirmForm(player, '§4§lKamu yakin?§r', '§cApakah Anda yakin ingin melakukan tindakan ini?§r', '§c§lAku yakin!§r', '§2§lBatal!§r')))
            return AH.openAH(player);
        //Return all items and money screen and code
        if (res.selection === 0) {
            for (const p of Database.allTables('AHP')) {
                const post = await AH.getPost(p), id = numberToHex(new Date().getTime() + (AH.config.maxHoldTime * 3.6e+6));
                ;
                if (!post)
                    continue;
                const db = await Database.register(id, 'AHC');
                if (post.name !== post.itemName)
                    db.write('n', post.name);
                db.writeMany({
                    i: post.itemName,
                    d: p,
                    a: post.amount,
                    p: post.startPrice,
                    c: [post.creator.id, post.creator.name, post.creator.silent ? 1 : 0]
                });
                AH.client.update(player.rID, 'AHC', 'add', id);
                Database.drop(p, 'AHP');
                const lastBidder = Player.getBy({ id: post.bidID[0] }, { from: AH.config.npcName });
                if (lastBidder)
                    lastBidder.runCommandAsync(`scoreboard players add @s "${AH.config.obj}" ${post.bids[0]}`);
                else if (post.bidID[0])
                    AH.client.AHR.write(post.bidID[0], (AH.client.AHR.read(post.bidID[0]) || 0) + post.bids[0]);
            }
            const success = new MessageForm();
            success.setTitle('§4§lSelamat :)!§r');
            success.setBody(`§l§cBerhasil!§r Semua barang dan uang lelang telah diminta untuk dikembalikan. Ingat, jika mereka tidak mengumpulkan barangnya dalam §c${MS(AH.config.maxHoldTime * 3.6e+6)} jam§r, atau jika mereka tidak menerima barangnya, mereka §4TIDAK AKAN§r mendapatkannya kembali!`);
            success.setButton1('Ok!');
            success.setButton2('§c§lTutup§r');
            return success.send(player, res => res.selection && AH.openAH(player));
        }
        //End all auctions
        if (res.selection === 1) {
            for (const p of Database.allTables('AHP')) {
                const post = await AH.getPost(p), id = numberToHex(new Date().getTime() + (AH.config.maxHoldTime * 3.6e+6));
                if (!post)
                    continue;
                const db = await Database.register(id, 'AHC'), target = post.bidID[0] ? post.bidID[0] : post.creator.id;
                if (post.name !== post.itemName)
                    db.write('n', post.name);
                if (post.bidID[0])
                    db.write('w', [post.bidID[0], post.bids[0]]);
                db.writeMany({
                    i: post.itemName,
                    d: p,
                    a: post.amount,
                    p: post.startPrice,
                    c: [post.creator.id, post.creator.name, post.creator.silent ? 1 : 0]
                });
                AH.client.update(target, 'AHC', 'add', id);
                Database.drop(p, 'AHP');
            }
            const success = new MessageForm();
            success.setTitle('§e§lSelamat :)!§r');
            success.setBody('§l§aBerhasil!§r Semua lelang telah selesai.');
            success.setButton1('Ok!');
            success.setButton2('§c§lTutup§r');
            return success.send(player, res => res.selection && AH.openAH(player));
        }
        //Delete all auctions
        AH.reg.AHP[1].clear();
        AH.reg.AHB[1].clear();
        AH.reg.AHC[1].clear();
        AH.reg.AHS[1].clear();
        Database.allTables('AHI').forEach(i => Database.drop(i, 'AHI'));
        Database.allTables('AHP').forEach(i => Database.drop(i, 'AHP'));
        Database.allTables('AHC').forEach(i => Database.drop(i, 'AHC'));
        const success = new MessageForm();
        success.setTitle('§4§lSelamat ;(!§r');
        success.setBody('§l§cBerhasil!§r Semua lelang telah dihapus, dan uang telah dikembalikan.');
        success.setButton1('Ok!');
        success.setButton2('§c§lTutup§r');
        return success.send(player, res => res.selection && AH.openAH(player));
    });
}
;
