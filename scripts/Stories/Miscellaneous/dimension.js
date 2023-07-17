import { world } from '@minecraft/server';
import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import quick from '../../quick.js';
const cmd = Commands.create({
    name: 'dimension',
    description: 'Teleportasi ke dimensi tertentu.',
    aliases: ['dim', 'mins', 'place'],
    category: 'Miscellaneous',
    admin: true,
    developers: ['Aex66', 'Mo9ses']
});
cmd.startingArgs('dimension');
cmd.dynamicType('dimension', ['overworld', 'nether', 'end'], (sender, dim, args) => {
    const loc = args[1], rot = args[0].getRotation();
    args[0].addTag(quick.epics['Automod'].protections.teleport.skip);
    args[0].teleport(loc, { dimension: world.getDimension(dim === 'end' ? 'the end' : dim), rotation: { x: rot.x, y: rot.y } });
    args[0].send(`Kamu telah diteleportasi ke dimensi §6${dim}§e di koordinat §6${~~loc.x}§e, §6${~~loc.y}§e, §6${~~loc.z}§e!`);
    if (sender.name !== args[0].name)
        sender.send(`§c${args[0].name}§e telah diteleportasi ke dimensi §6${dim}§e di koordinat §6${~~loc.x}§e, §6${~~loc.y}§e, §6${~~loc.z}§e`);
}, 'player');
cmd.playerType('player', null, true, 'location');
cmd.locationType('location', null);
