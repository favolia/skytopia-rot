import { system } from "@minecraft/server";
import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import Database from "../../Papers/DatabasePaper.js";
import { world } from "@minecraft/server";
import quick from "../../quick.js";
import Player from "../../Papers/PlayerPaper.js";
const cmd = Commands.create({
    name: 'lockdimension',
    aliases: ['lockdim', 'lockd'],
    category: 'Server'
});
cmd.startingArgs(['dim']);
let lockReg = null;
(async function () {
    lockReg = await Database.registry('lockDim');
})();
cmd.dynamicType('dim', ['the end', 'nether'], async (plr, val) => {
    const value = lockReg.read(val) ?? 0;
    if (!value)
        lockReg.write(val, 1);
    else
        lockReg.write(val, 0);
    plr.send(`Berhasil ${value ? 'membuka kunci' : 'mengunci'} dimensi §a${val}§e.`);
});
system.runInterval(async () => {
    if (!lockReg)
        return;
    for (const player of world.getPlayers()) {
        if (Player.isAdmin(player) || !player?.dimension)
            continue;
        const val = lockReg.read(player.dimension.id.replace('minecraft:', ''));
        if (!val)
            continue;
        player.sendMessage(`§cDimensi ini tidak diizinkan!`);
        player.teleport(quick.dimNotAllowedLoc.loc, { dimension: world.getDimension(quick.dimNotAllowedLoc.dim) });
    }
});
