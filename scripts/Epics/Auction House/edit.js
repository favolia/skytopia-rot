import { ActionForm, MessageForm, ModalForm } from "../../Papers/FormPaper.js";
import { hexToNumber, numberToHex } from "../../Papers/Paragraphs/ConvertersParagraphs.js";
import { confirmForm } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import { clientCollect } from "./client.js";
import { checkPosts } from "./interval.js";
import { openPost } from "./open.js";
import { AH } from "./main.js";
import Database from "../../Papers/DatabasePaper.js";
import Player from "../../Papers/PlayerPaper.js";
export function editPost(player, date, from) {
    const dev = new ActionForm();
    dev.setTitle('§c§lEdit Menu§r');
    dev.addButton('§7§lEdit lelang§r', 'textures/ROT/forms/Auction House/change2.png');
    dev.addButton('§c§lKembalikan barang§r', 'textures/ROT/forms/Auction House/block.png');
    dev.addButton('§e§lAkhiri lelang sekarang§r', 'textures/ROT/forms/Auction House/ultra.png');
    dev.addButton('§c§lHapus lelang§r', 'textures/ROT/forms/Auction House/garbage.png');
    dev.addButton('§c§lKembali§r', 'textures/ROT/forms/Auction House/leave.png');
    dev.send(player, async (res) => {
        if (res.selection === 4 || res.canceled)
            return openPost(player, date, from);
        if (hexToNumber(date) - new Date().getTime() <= 0)
            checkPosts();
        const post = await AH.getPost(date);
        if (!post)
            return AH.errorForm(player, from);
        if (post.creator.id !== player.rID && !player.isAdmin)
            return AH.errorForm(player, from, 'Tidak dapat memverifikasi bahwa Kamu memiliki izin untuk mengedit pos ini');
        if (!AH.verifyPost(date, post))
            return AH.errorForm(player, from);
        //Edit auction - Admin screen
        if (res.selection === 0) {
            const edit = new ModalForm(), time = AH.config.maxPostTime - post.time;
            edit.setTitle(`§l§8Edit §a${post.name.length > 10 ? post.name.slice(0, 10) + '...' : post.name}§r`);
            edit.addInput('Nama tampilan (Maks 15 karakter)', post.name, post.name);
            if (AH.config.boxNumber)
                edit.addInput('Tawaran awal', `${post.startPrice}`, `${post.startPrice}`);
            else
                edit.addSlider('Tawaran awal', AH.config.postAmount[1], AH.config.postAmount[1], AH.config.sliderStep, post.startPrice);
            edit.addSlider('Tambahkan __ jam', 0, time, 1, 0);
            edit.addToggle('Lelang diam? (sembunyikan nama)', post.creator.silent);
            return edit.send(player, async (res) => {
                if (res.canceled)
                    return openPost(player, date, from);
                if (!AH.verifyPost(date, post))
                    return AH.errorForm(player, from);
                if (!(await confirmForm(player, `§a§lKamu yakin?§r`, `§cApakah Anda yakin ingin mengubah lelang ini selamanya?§r`, '§c§lYa!§r', '§2§lTidak!§r')))
                    return openPost(player, date, from);
                const startPrice = Number(res.formValues[1]), update = {};
                //Checks if money is NaN
                if (res.formValues[1].replace(/\d/g, '') !== '' || isNaN(startPrice))
                    return await confirmForm(player, '§5Bukan angka§r', `"§5${res.formValues[2]}§r" bukan angka. Apakah Anda ingin mencoba lagi?`) ? openPost(player, date, from) : from(player, AH.openAH);
                //Checks if the amount is vaild
                if (startPrice < AH.config.postAmount[0] || startPrice > AH.config.postAmount[1])
                    return await confirmForm(player, '§5Ukuran penting?§r', `"§5${res.formValues[2]}§r" terlalu kecil atau terlalu besar! Pilih angka di antara §6${AH.config.postAmount[0]}-${AH.config.postAmount[1]}§r`) ? openPost(player, date, from) : from(player, AH.openAH);
                //Checks new item name
                if (post.name !== res.formValues[0]) {
                    if (res.formValues[0].replace(/[a-zA-Z0-9'+& ]/g, '') !== '')
                        return player.send('§c§lError §7-§r Jangan gunakan simbol, kata, atau karakter khusus dalam nama barang!');
                    if (res.formValues[0].length > 15)
                        return player.send('§c§lError §7-§r Nama tampilan lelang terlalu panjang!');
                    Object.assign(update, { name: res.formValues[0] });
                }
                //Checks starting bid
                if (startPrice !== post.startPrice) {
                    if (startPrice > post.bids[0]) {
                        const lastBidder = Player.getBy({ id: post.bidID[0] }, { from: AH.config.npcName });
                        if (lastBidder) {
                            lastBidder.send(`Pemilik lelang "§l§6${post.name}§r§e" telah mengubah penawaran awal lelang mereka sehingga penawaran Kamu telah dikembalikan.§r`);
                            lastBidder.runCommandAsync(`scoreboard players add @s "${AH.config.obj}" ${post.bids[0]}`);
                        }
                        else if (post.bidID[0])
                            AH.client.AHR.write(post.bidID[0], (AH.client.AHR.read(post.bidID[0]) || 0) + post.bids[0]);
                        Object.assign(update, { bidData: {} });
                    }
                    Object.assign(update, { startPrice: startPrice });
                }
                if (res.formValues[3] !== post.creator.silent)
                    Object.assign(update, { silent: res.formValues[3] });
                if (res.formValues[2] === 0) {
                    if (!Object.keys(update).length)
                        return player.send('§c§lError §e- Tidak ada yang berubah!§r');
                    await AH.updatePost(date, update);
                    return openPost(player, date, from);
                }
                const item = (await Database.register(date, 'AHI')).read('');
                Database.drop(date, 'AHP');
                Database.drop(date, 'AHI');
                const newDate = await AH.publishPost(player, item, {
                    name: res.formValues[0],
                    itemName: post.itemName,
                    price: startPrice,
                    silent: Boolean(res.formValues[3]),
                    time: post.time + parseInt(res.formValues[2])
                });
                await AH.updatePost(newDate, {
                    bidData: update.hasOwnProperty('bidData') ? update.bidData : post.bidData,
                    removedIDs: post.removedIDs
                });
                AH.openAH(player);
            });
        }
        if (!(await confirmForm(player, '§4§lKamu yakin?§r', '§cApakah Kamu yakin ingin melakukan tindakan ini?§r', '§c§lAku yakin!§r', '§2§lBatal!§r')))
            return openPost(player, date, from);
        //Return item
        if (res.selection === 1) {
            const id = numberToHex(new Date().getTime() + (AH.config.maxHoldTime * 3.6e+6)), success = new MessageForm(), db = await Database.register(id, 'AHC');
            if (post.name !== post.itemName)
                db.write('n', post.name);
            db.writeMany({
                i: post.itemName,
                d: date,
                a: post.amount,
                p: post.startPrice,
                c: [post.creator.id, post.creator.name, post.creator.silent ? 1 : 0]
            });
            AH.client.update(player.rID, 'AHC', 'add', id);
            Database.drop(date, 'AHP');
            const lastBidder = Player.getBy({ id: post.bidID[0] }, { from: AH.config.npcName });
            if (lastBidder)
                lastBidder.runCommandAsync(`scoreboard players add @s "${AH.config.obj}" ${post.bids[0]}`);
            else if (post.bidID[0])
                AH.client.AHR.write(post.bidID[0], (AH.client.AHR.read(post.bidID[0]) || 0) + post.bids[0]);
            success.setTitle('§a§lSelamat :)!§r');
            success.setBody(`§l§aBerhasil!§r Barang ini akan dikembalikan.`);
            success.setButton1('§aOk!§r');
            success.setButton2('§c§lTutup§r');
            return success.send(player, res => res.selection && post.creator.id === player.rID ? clientCollect(player) : from(player, AH.openAH));
        }
        //End auction now
        if (res.selection === 2) {
            const id = numberToHex(new Date().getTime() + (AH.config.maxHoldTime * 3.6e+6)), db = await Database.register(id, 'AHC'), target = post.bidID[0] ? post.bidID[0] : post.creator.id;
            if (post.name !== post.itemName)
                db.write('n', post.name);
            if (post.bidID[0])
                db.write('w', [post.bidID[0], post.bids[0]]);
            db.writeMany({
                i: post.itemName,
                d: date,
                a: post.amount,
                p: post.startPrice,
                c: [post.creator.id, post.creator.name, post.creator.silent ? 1 : 0]
            });
            AH.client.update(target, 'AHC', 'add', id);
            Database.drop(date, 'AHP');
            const success = new MessageForm();
            success.setTitle('§4§lSelamat :)!§r');
            success.setBody(`§l§cBerhasil!§r Lelang telah berakhir.`);
            success.setButton1('§aOk!§r');
            success.setButton2('§c§lTutup§r');
            return success.send(player, res => res.selection && from(player, AH.openAH));
        }
        Database.drop(date, 'AHP');
        Database.drop(date, 'AHI');
        const success = new MessageForm();
        success.setTitle('§4§lSelamat ;(!§r');
        success.setBody(`§l§cBerhasil!§r Lelang §c${post.name}§r telah dihapus dan dienyahkan!`);
        success.setButton1('§aOk!§r');
        success.setButton2('§c§lTutup§r');
        return success.send(player, res => res.selection && from(player, AH.openAH));
    });
}
