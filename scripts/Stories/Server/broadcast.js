import Commands from '../../Papers/CommandPaper/CommandPaper.js';
import Server from '../../Papers/ServerPaper.js';
const cmd = Commands.create({
    name: 'broadcast',
    description: 'Menyiarkan pesan ke seluruh server.',
    aliases: ['b', 'bc', 'cast', 'console', 'bbcnews'],
    admin: true,
    category: 'Server',
    developers: ['Aex66']
});
cmd.startingArgs('msg');
cmd.unknownType('msg', (_, val) => Server.broadcast(val.join(' ')), 256);
