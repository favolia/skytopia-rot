import Commands from "../../Papers/CommandPaper/CommandPaper.js";
const cmd = Commands.create({
    name: 'inven',
    description: 'Perintah ini akan memungkinkanmu untuk melihat inventaris pemain lain.',
    aliases: ['inventory', 'see', 'inven-see', 'inven-see', 'inv'],
    category: 'Management',
    admin: true,
    developers: ['Mo9ses']
});
cmd.startingArgs(['inv', 'chat']);
cmd.playerType('plr', null, true, [], { self: false });
cmd.dynamicType('inv', ['inv', 'inven', 'inventory'], (plr, _, target) => {
    const tarInv = target[0].getComponent('inventory').container, plrInv = plr.getComponent('inventory').container;
    plrInv.clearAll();
    for (let i = 0; i < tarInv.size; i++) {
        const item = tarInv.getItem(i);
        if (!item)
            continue;
        plrInv.setItem(i, item.clone());
    }
    plr.send(`Inventaris kamu telah digantikan dengan salinan persis dari inventaris §c${target[0].name}§e.`);
}, 'plr');
cmd.dynamicType('chat', ['chat', 'cht', 'text', 'txt'], (plr, _, target) => {
    const items = [], tarInv = target[0].getComponent('inventory').container;
    for (let i = 0; i < tarInv.size; i++) {
        const item = tarInv.getItem(i);
        if (!item)
            continue;
        items.push(`§a${item.type.id}§b >§e jumlah: §a${item.amount}§e, lore: §a${item.getLore().join(' §e(baris berikutnya)§a ') || '§cnone'}`);
    }
    plr.sendMessage(items.join('\n'));
    plr.send(`Inventory §c${target[0].name}§e telah dipaparkan di chat. Harap diingat bahwa ini tidak seakurat membuat salinan di Inventorymu sendiri.`);
}, 'plr');
