import { world } from "@minecraft/server";
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import Database from "../../Papers/DatabasePaper.js";
import quick from "../../quick.js";
let home = null;
(async function () {
    home = await Database.registry('homes');
})();
const cmd = Commands.create({
    name: 'home',
    description: 'Setel rumah dan teleport ke sana.',
    category: 'Fantasy',
});
cmd.startingArgs(['set', 'remove', 'tp']);
cmd.staticType('set', 'set', (plr, homeName) => {
    if (homeName.includes('$-$'))
        return plr.error('Kamu tidak dapat menggunakan karakter "$-$" dalam nama rumahmu.');
    const pHomes = home.findMany(Number(plr.rID));
    if (pHomes.length >= quick.maxHomes)
        return plr.error('Kamu telah mencapai batas maksimum rumah yang diizinkan: ' + quick.maxHomes);
    if (pHomes.length && pHomes.some(x => x.split('$-$')[0] === homeName))
        return plr.error('Kamu sudah memiliki sebuah rumah dengan nama tersebut!');
    if (!quick.homeDims.includes(plr.dimension.id))
        return plr.error('Kamu tidak dapat memiliki sebuah rumah di dimensi ini!');
    home.write(`${homeName}$-$${~~(plr.location.x)}$-$${~~(plr.location.y)}$-$${~~(plr.location.z)}$-$${plr.dimension.id}$-$${plr.rID}`, Number(plr.rID));
    plr.send(`Kamu telah berhasil membuat rumah dengan nama §a${homeName}§e di koordinat ${~~(plr.location.x)} ${~~(plr.location.y)} ${~~(plr.location.z)}`);
});
cmd.staticType('remove', 'remove', (plr, homeName) => {
    const pHomes = home.findMany(Number(plr.rID));
    if (!pHomes.length)
        return plr.error('Kamu bahkan tidak memiliki rumah?');
    const val = pHomes.find(x => x.split('$-$')[0] === homeName);
    if (!val)
        return plr.error('Kamu tidak memiliki rumah dengan nama tersebut!');
    home.delete(val);
    plr.send(`Kamu berhasil menghapus rumah §a${homeName}§e.`);
});
cmd.staticType('tp', 'teleport', (plr, homeName) => {
    const pHomes = home.findMany(Number(plr.rID));
    if (!pHomes.length)
        return plr.error('Kamu bahkan tidak memiliki rumah?');
    const val = pHomes.find(x => x.split('$-$')[0] === homeName);
    if (!val)
        return plr.error('Kamu tidak memiliki rumah dengan nama tersebut!');
    const sp = val.split('$-$');
    const x = Number(sp[1]), y = Number(sp[2]), z = Number(sp[3]), d = sp[4];
    plr.addTag(quick.epics['Automod'].protections.teleport.skip);
    plr.teleport({ x, y, z }, { dimension: world.getDimension(d), rotation: { x: plr.getRotation().x, y: plr.getRotation().y } });
    plr.send(`Berhasil melakukan teleportasi ke §a${homeName}.`);
});
