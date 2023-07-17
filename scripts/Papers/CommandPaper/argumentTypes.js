export const staticBook = {
    create: {
        des: 'Buat metode',
        val: ['create', 'c-', 'make', 'new', 'm-'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    delyeet: {
        des: 'Menghapus barang-barang Saya',
        val: ['delete', 'delyeet', 'd-', 'yeet'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    add: {
        des: 'Menambahkan barang-barang',
        val: ['add', 'a-', 'push'],
        con: (val) => true,
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    remove: {
        des: 'Menghapus barang-barang',
        val: ['remove', 'r-', 'rem', 're', 'delete'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    save: {
        des: 'Menyimpan barang-barang',
        val: ['save', 's-', 'sav'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    list: {
        des: 'Melihat barang-barang',
        val: ['list', 'l-', 'lis', 'tell'],
        con: (val) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    sell: {
        des: 'Menjual barang-barang',
        val: [`sell`, 's-'],
        con: (val) => val /* You can write code here to make sure it's a Minecraft item without writing it every time inside a commond*/,
        err: 'That is not a Minecraft item'
    },
    teleport: {
        des: 'Koordinat relatif',
        val: ['tp', 'teleport', 'go', 'go-to'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    send: {
        des: 'Kirim',
        val: ['send'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    accept: {
        des: 'Terima',
        val: ['accept', 'ac', 'ok'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    decline: {
        des: 'Tolak',
        val: ['deny', 'decline', 'no', 'cancel'],
        con: (val) => val.replace(/[a-zA-Z0-9-_ ]/g, '') === '',
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    play: {
        des: 'Bermain',
        val: ['play', 'p', 'start'],
        con: (val) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    try: {
        des: 'Mencoba',
        val: ['try', 'tryo', 'tr'],
        con: (val) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    quit: {
        des: 'Keluar',
        val: ['quit', 'q', 'qu'],
        con: (val) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    set: {
        des: 'Menambahkan',
        val: ['set', 'push', 'put'],
        con: (val) => val ? val.replace(/[a-zA-Z0-9-_ ]/g, '') === '' : true,
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    rename: {
        des: '',
        val: ['rename', 'name', 'rn', 'rname'],
        con: () => true,
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    join: {
        desc: '',
        val: ['join', 'enter'],
        con: () => true,
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    replace: {
        desc: '',
        val: ['replace'],
        con: () => true,
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    toggle: {
        desc: '',
        val: ['toggle'],
        con: () => true,
        err: 'Kamu tidak bisa menggunakan karakter khusus!'
    },
    top: {
        desc: '',
        val: ['top'],
        con: () => true,
        err: ''
    },
} /* as { [key: string]: { des: string, val: string[], con?: (val: string) => boolean, err?: string }}*/;
export const staticKeys = Object.keys(staticBook), staticValues = staticKeys.map((key) => staticBook[key].val).flat();
