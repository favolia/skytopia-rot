import { ActionForm, ModalForm } from "../../Papers/FormPaper.js";
import { hexToNumber, metricNumbers, MS } from "../../Papers/Paragraphs/ConvertersParagraphs.js";
import { confirmForm } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import { checkPosts } from "./interval.js";
import { editPost } from "./edit.js";
import { AH } from "./main.js";
import Player from '../../Papers/PlayerPaper.js';
import quick from "../../quick.js";
//Defining very much needed variables
const config = quick.epics['Auction House'];
//Opening the post XD
export async function openPost(player, date, from) {
    if (hexToNumber(date) - new Date().getTime() <= 0)
        checkPosts();
    //Checks if post now exists
    const post = await AH.getPost(date);
    if (!post)
        return AH.errorForm(player, from);
    //Calculating price?
    let keepersKeep = ~~(post.price / 100) * config.buyersPremiumPercent[0];
    if (keepersKeep > config.buyersPremiumPercent[1])
        keepersKeep = config.buyersPremiumPercent[1];
    //Setting the post up
    const view = new ActionForm();
    view.setTitle(`§l§1${post.name.length > 10 ? post.name.slice(0, 10) + '...' : post.name}§8 Lelang§r`);
    view.setBody([
        '§a§lInformasi lelang:§r',
        config.namePost ? `\n §3Nama lelang: §c${post.name}` : '',
        `\n §3Barang: §4${post.itemName}`,
        `\n §3Enchants: §e${post.enchants.length ? post.enchants.map(e => `${e[0]}: §a${e[1]}`).join('§3, §e') : '§4Tidak ada'}`,
        `\n §3Jumlah: §4${post.amount}`,
        `${post.bids[0] ? `\n §3Tawaran tertinggi: §4${metricNumbers(post.price)}` : ''}`,
        `\n §3Harga awal: §c${metricNumbers(post.startPrice)}`,
        `\n §3Penawar (Tertinggi ke terendah): §4${post.bidName.length ? post.bidName.map((n, i) => post.bidID[i] === player.rID ? '§l§6Kamu§r' : post.bidSilent[i] ? `${player.isAdmin ? `${post.creator.name} ` : ''}§c(Tersembunyi)` : n).join('§3, §c') : '§aTidak ada orang!'}`,
        `\n §3Premi pembeli: §c${keepersKeep}`,
        `\n §3Oleh: §c${post.creator.id === player.rID ? '§l§6Kamu§r' : post.creator.silent ? `${player.isAdmin ? `${post.creator.name} ` : ''}§c(Tersembunyi)` : post.creator.name}`,
        `\n §3Berakhir dalam: §4${MS(hexToNumber(date) - new Date().getTime())}`,
        '\n§rIngin barang tersebut? Tempatkan penawaran di bawah ini!'
    ].join(''));
    if (post.bidID[0] === player.rID)
        view.addButton('§4§lHapus tawaran§r', 'textures/ROT/forms/Auction House/garbage.png');
    else if (post.creator.id === player.rID)
        view.addButton('§9§lEdit Lelang§r', 'textures/ROT/forms/Auction House/change.png');
    else
        view.addButton('§6§lTawar!§r', 'textures/ROT/forms/Auction House/bid.png');
    view.addButton('§c§lKembali§r', 'textures/ROT/forms/Auction House/leave.png');
    if (player.isAdmin && post.creator.id !== player.rID)
        view.addButton('§4§lDev menu§r', 'textures/ROT/forms/Auction House/dev.png');
    view.send(player, async (res) => {
        if (res.selection === 1)
            return from(player, AH.openAH);
        if (res.canceled)
            return AH.openAH(player);
        if (res.selection === 2)
            return editPost(player, date, from);
        if (post.creator.id === player.rID)
            return editPost(player, date, from);
        const price = post.price + 1;
        //Remove bid code
        if (post.bidID[0] === player.rID) {
            if (post.removedIDs.includes(player.rID) || (post.bidID[1] && !Player.getBy({ id: post.bidID[1] })))
                return await confirmForm(player, '§4§lTidak bisa menghapus§r', '§cIngat, Kamu hanya dapat menghapus penawaran dari sebuah lelang sekali, dan hanya jika penawar terakhir sedang online.§r', '§eOk ;(§r', '§l§4Tutup§r') ? openPost(player, date, from) : player.send('Kembali lagi nanti!');
            if (await confirmForm(player, '§c§lHapus penawaran?§r', `Apakah Kamu yakin ingin menghapus penawaran Kamu dari §c${post.name}§r? Ini mungkin §4§lkesempatan terakhir§r Kamu untuk memenangkan barang ini.\n\nKamu hanya dapat menghapus penawaran Kamu §4§lSEKALI§r dan jika penawar terakhir §a§lsedang online§r.`, '§a§lUps! Salah tombol...§r', '§c§lYa, aku butuh uangnya...§r'))
                return openPost(player, date, from);
            if (!AH.verifyPost(date, post))
                return AH.errorForm(player, from);
            const lastBidder = Player.getBy({ id: post.bidID[1] });
            if (lastBidder) {
                lastBidder.send(`§c${post.bidSilent[0] ? '§cTersembunyi' : player.name}§e cukup menghapus penawaran mereka pada lelang "§l§6${post.name}§r§e" dan Kamu sekarang adalah penawar tertinggi!§r`);
                lastBidder.runCommandAsync(`scoreboard players remove @s "${config.obj}" ${post.bids[1]}`);
            }
            //Deletes player from post
            AH.updatePost(date, { bidData: removeBid(date, post, player), removedIDs: post.removedIDs.concat(player.rID) });
            return openPost(player, date, from);
        }
        //Add bid screen
        if (player.getScore(config.obj) < price)
            return await confirmForm(player, '§4§lDana tidak mencukupi§r', `Kamu bahkan tidak punya uang yang cukup untuk menawar barang ini! Kamu memerlukan setidaknya §c${Math.abs(player.getScore(config.obj) - price)}§r lebih §6${config.currency}§r!`, '§eOk ;(§r', '§l§4Tutup§r') ? openPost(player, date, from) : player.send('Kembali lagi nanti!');
        //Creating bidding form
        const bid = new ModalForm();
        bid.setTitle(`§l§8Menawar pada §c${post.name.length > 10 ? post.name.slice(0, 10) + '...' : post.name}§r`);
        if (config.boxNumber)
            bid.addInput('Jumlah penawaran', `§6${price}-${player.getScore(config.obj)}§r`, price.toString());
        else
            bid.addSlider('Jumlah penawaran', price, player.getScore(config.obj), config.sliderStep, price);
        bid.addToggle('Tawar Diam (sembunyikan nama)', false);
        bid.send(player, async (res) => {
            if (res.canceled)
                return openPost(player, date, from);
            if (hexToNumber(date) - new Date().getTime() <= 0)
                checkPosts();
            const post = await AH.getPost(date), sent = Number(res.formValues[0]), silent = res.formValues[1];
            if (!post)
                return AH.errorForm(player, from);
            //Checks if the money they inputted is a number
            if (res.formValues[0].replace(/\d/g, '') !== '' || isNaN(sent))
                return await confirmForm(player, '§5Bukan angak§r', `"§5${res.formValues[0]}§r" itu bukan angka, Mau mencoba lagi?`) ? openPost(player, date, from) : from(player, AH.openAH);
            //Check if they have the moeny and if it's vaild
            if (sent < price || sent > player.getScore(config.obj))
                return await confirmForm(player, '§5Ukuran penting?§r', `"§5${res.formValues[0]}§r" Terlalu kecil atau terlalu besar! Pilih angka di antara §6${price}-${player.getScore(config.obj)}`) ? openPost(player, date, from) : from(player, AH.openAH);
            //Confirming and updating the post
            if (!(await confirmForm(player, `§a§lKamu yakin?§r`, `Apakah kamu yakin ingin menawar §a$${metricNumbers(sent)} §6${config.currency}§r pada §c§l${post.name}§r?`)))
                return openPost(player, date, from);
            if (!AH.verifyPost(date, post))
                return AH.errorForm(player, from);
            await AH.updatePost(date, { bidData: addBid(date, post, player, sent, silent) });
            openPost(player, date, from);
        });
    });
}
;
function addBid(date, post, player, sent, silent) {
    const lastBidder = Player.getBy({ id: post.bidID[0] }, { from: config.npcName });
    player.runCommandAsync(`scoreboard players remove @s "${config.obj}" ${sent}`);
    if (lastBidder) {
        lastBidder.send(`§c${silent ? '§c(Tersembunyi)' : player.name}§e baru saja mengalahkan penawaran Kamu pada lelang §l§6${post.name}§r§e!§r`);
        lastBidder.runCommandAsync(`scoreboard players add @s "${config.obj}" ${post.bids[0]}`);
    }
    else if (post.bidID[0])
        AH.client.AHR.write(post.bidID[0], (AH.client.AHR.read(post.bidID[0]) || 0) + post.bids[0]);
    AH.client.update(player.rID, 'AHB', 'add', date);
    delete post.bidData[player.rID];
    return Object.assign(post.bidData, { [player.rID]: [player.name, sent, silent ? 1 : 0] });
}
function removeBid(date, post, player) {
    player.runCommandAsync(`scoreboard players add @s "${config.obj}" ${post.bids[0]}`);
    AH.client.update(player.rID, 'AHB', 'remove', date);
    delete post.bidData[player.rID];
    return post.bidData;
}
