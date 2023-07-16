/*
ROT Developers and Contributors:
Moises (OWNER/CEO/Developer),
Aex66 (Developer)
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
__________ ___________________
\______   \\_____  \__    ___/
 |       _/ /   |   \|    |
 |    |   \/    |    \    |
 |____|_  /\_______  /____|
        \/         \/
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
© Copyright 2023 all rights reserved by Mo9ses. Do NOT steal, copy the code, or claim it as yours!
Please message Mo9ses#8583 on Discord, or join the ROT discord: https://discord.com/invite/2ADBWfcC6S
Docs: https://docs.google.com/document/d/1hasFU7_6VOBfjXrQ7BE_mTzwacOQs5HC21MJNaraVgg
Website: https://www.rotmc.ml
Thank you!
*/
import { EnchantmentTypes } from "@minecraft/server";
import { metricNumbers } from "../../Papers/Paragraphs/ConvertersParagraphs.js";
import { confirmForm } from "../../Papers/Paragraphs/ExtrasParagraphs.js";
import { getItemData } from "../../Papers/Paragraphs/itemParagraph.js";
import { MessageForm, ModalForm } from "../../Papers/FormPaper.js";
import { serverPosts } from "./server.js";
import { AH } from "./main.js";
import Database from "../../Papers/DatabasePaper.js";
//The form that opens when you are creating a auction
export async function createPost(player, from, data) {
    //Checks if the player has reached their max auction limit
    const clientPosts = AH.client.read(player.rID, 'AHP');
    if (clientPosts.length >= AH.config.maxClientPosts)
        return player.send('§c§lError §7-§r Kamu telah mencapai batas maksimum jumlah lelang yang bisa kamu jalankan secara bersamaan. Hapus salah satu lelang atau tunggu hingga barang tersebut dilelang.');
    const allPosts = Database.allTables('AHP');
    //Checks if we reached the max auctions
    if (allPosts?.length >= AH.config.maxPosts)
        return player.send('§c§lError §7-§r Server telah mencapai batas maksimum lelang aktif. Silakan kembali nanti.');
    const inventory = player.getComponent('minecraft:inventory').container, item = inventory.getItem(player.selectedSlot);
    //Checks if the item exists
    if (!item || !item?.typeId || !item.amount)
        return player.send('§c§lError §7-§r Kamu harus memegang barang yang ingin kamu lelang.');
    //Checks if the item ID is not on the list of prohibited items
    if (AH.config.bannedItems.includes(item.typeId))
        return player.send('§c§lError §7-§r Kamu tidak dapat menjadikan barang ini sebagai barang lelang XD');
    const itemData = getItemData(item);
    //Check enchants
    if (itemData.enchantments?.some(e => e.level > EnchantmentTypes.get(e.id).maxLevel))
        return player.send('§c§lError §7-§r Item ini memiliki nilai enchantment ilegal.');
    //Confirm create auction screen
    const itemName = item.typeId.match(/:([\s\S]*)$/)[1].replace(/[\W_]/g, ' ').split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    if (!(await confirmForm(player, '§8§lApakah kamu ingin melelang barang ini?§r', `Apakah kamu benar-benar ingin melelang §l§c${item.amount} ${itemName}(s)§r? Kamu hanya dapat melelang barang-barang yang sedang kamu pegang.`)))
        return clientPosts.length ? from(player, AH.openAH) : AH.openAH(player);
    //Creating the auction Modalform
    const auction = new ModalForm(), oldData = data ?? {};
    auction.setTitle('§a§lMembuat lelang§r');
    auction.addInput('Nama tampilan (Maks 15 karakter)', oldData.name ?? itemName, oldData.name ?? itemName);
    if (AH.config.boxNumber)
        auction.addInput('Tawaran awal', `${AH.config.postAmount[0]}-${AH.config.postAmount[1]}`, oldData?.price?.toString() ?? AH.config.postAmount[0].toString());
    else
        auction.addSlider('Tawaran awal', AH.config.postAmount[0], AH.config.postAmount[1], AH.config.sliderStep, oldData?.price ?? AH.config.postAmount[0]);
    auction.addSlider('Tutup lelang dalam __ jam', 1, AH.config.maxPostTime, 1, oldData?.close ?? (~~(AH.config.maxPostTime / 2) || 1));
    auction.addToggle('Lelang diam? (sembunyikan nama)', oldData?.silent ?? false);
    auction.send(player, async (res) => {
        if (res.canceled)
            return clientPosts.length ? from(player, AH.openAH) : AH.openAH(player);
        const newData = { name: res.formValues[0], price: res.formValues[1], close: res.formValues[2], silent: res.formValues[3] };
        const money = Number(res.formValues[1]);
        //Checks if money is NaN
        if (res.formValues[1].replace(/\d/g, '') !== '' || isNaN(money))
            return await confirmForm(player, '§5Bukan angka§r', `"§c${res.formValues[1]}§r" bukan angka. Apakah kamu ingin mencoba lagi?`) ? createPost(player, from, newData) : AH.openAH(player);
        //Checks if the amount is vaild
        if (money < AH.config.postAmount[0] || money > AH.config.postAmount[1])
            return await confirmForm(player, '§5Ukuran penting?§r', `"§5${res.formValues[1]}§r" terlalu kecil atau terlalu besar! Pilih angka di antara §6${AH.config.postAmount[0]}-${AH.config.postAmount[1]}`) ? createPost(player, from, newData) : AH.openAH(player);
        //Checks if they have enough money to create the auction
        let keepersKeep = ~~(money / 100) * AH.config.createPostPercent[0], postName = itemName;
        if (keepersKeep > AH.config.createPostPercent[1])
            keepersKeep = AH.config.createPostPercent[1];
        if (player.getScore(AH.config.obj) < keepersKeep)
            return player.send(`§c§lError §7-§r Kamu tidak memiliki cukup uang untuk melelang barang ini. Kamu perlu membayar saya §c${Math.abs(player.getScore(AH.config.obj) - keepersKeep)}§6 ${AH.config.currency}§r atau menurunkan harganya.`);
        //Checks if the item name is vaild
        if (itemName != res.formValues[0]) {
            if (res.formValues[0].replace(/[a-zA-Z0-9'+& ]/g, '') !== '')
                return player.send('§c§lError §7-§r Jangan gunakan simbol, kata, atau karakter khusus dalam nama barang!');
            if (res.formValues[0].length > 15)
                return player.send('§c§lError §7-§r Nama tampilan lelang terlalu panjang!');
            postName = res.formValues[0];
        }
        //Adding auction and other stuff
        if (JSON.stringify(getItemData(inventory.getItem(player.selectedSlot))) !== JSON.stringify(itemData))
            return player.send('§c§lError §7-§r Lelang tidak dapat dibuat karena kamu kehilangan barangnya!');
        AH.publishPost(player, itemData, {
            name: AH.config.namePost ? postName : itemName,
            itemName: itemName,
            price: money,
            time: res.formValues[2],
            silent: res.formValues[3]
        });
        //Taking item and removing money
        inventory.setItem(player.selectedSlot);
        player.runCommandAsync(`scoreboard players remove @s "${AH.config.obj}" ${keepersKeep}`);
        const success = new MessageForm();
        success.setTitle('§a§lSelamat!§r');
        success.setBody(`§l§aBerhasil!§r §l§c${item.amount} ${itemName}(s)§r akan berada dalam sebuah lelang dengan penawaran awal sebesar §a$${metricNumbers(res.formValues[1])}§6 ${AH.config.currency}§r dengan nama tampilan "§c${res.formValues[0]}§r"! Apakah Anda ingin melihat lelangnya?`);
        success.setButton1('Tentu!');
        success.setButton2('Tidak');
        success.send(player, res => res.selection ? serverPosts(player, from) : from(player, AH.openAH));
    });
}
