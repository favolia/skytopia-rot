import Commands from "../../Papers/CommandPaper/CommandPaper.js";
import { ban } from "./ban.js";
const cmd = Commands.create({
    name: 'unban',
    category: 'Management'
});
cmd.startingArgs('player');
cmd.playerType('player', (plr, val) => {
    const date = ban.regExpire.find(Number(val.rID));
    const reason = ban.regReason.find(Number(val.rID));
    if (!date)
        return plr.error(`§a${val.name}§e tidak banned`);
    plr.send(`§a${val.name}§e telah di unban!`);
    ban.regExpire.delete(date);
    ban.regReason.delete(reason);
    console.warn(`Pemain §c${val.name}§r dengan ID §c${val.rID}§r telah dibebaskan dari unbanned!`);
}, false, undefined, { self: false });
