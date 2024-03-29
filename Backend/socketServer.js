const { Server } = require('socket.io');
const ytdl = require('ytdl-core');
const ytsr = require('yt-search');
const httpServer = require('./server')

const rooms = new Map();

const io = new Server(httpServer, {
    cors: {
        origin: 'https://rollingrocky360.github.io',
    }
});

function handleConnection(socket) {

    let { _room_id, _user } = socket.handshake.query;
    console.log('connected');

    socket.on('error', console.log);

    socket.on('disconnect', () => {
        console.log(`${_user?.username} disconnected`);
        if (!_room_id) return;
        
        const room = rooms.get(_room_id);
        room.users = room.users.filter(user => user._id !== _user._id);
        if (room.users.length === 0) {
            rooms.delete(_room_id);
            console.log('room ' + _room_id + ' deleted');
        }
        socket.leave(_room_id);
        io.to(_room_id).emit('left', _user);
        _room_id = _user = undefined;
    });

    socket.on('leave', () => {
        const room = rooms.get(_room_id);
        room.users = room.users.filter(user => user._id !== _user._id);
        if (room.users.length === 0) {
            rooms.delete(_room_id);
            console.log('Room ' + _room_id + ' deleted');
        }
        socket.to(_room_id).emit('left', _user);
        socket.leave(_room_id);
        _room_id = _user = undefined;
    })
    
    socket.on('search', async msg => {
        const searchResponse = await ytsr(msg.keyword);
        const results = searchResponse.videos
            .map(video => {
                return {
                    id: video.id,
                    name: video.title,
                    url: video.url,
                    author: video.author.name,
                    thumbnailUrl: video.thumbnail,
                    dur: video.seconds,
                }
            })

        socket.emit('search-results', results)
    })

    socket.on('add', async msg => {
        const info = await ytdl.getInfo(msg.url);
        const items = ytdl.filterFormats(info.formats, 'audioonly');

        const vd = info.videoDetails;

        song = {
            id: vd.videoId,
            name: vd.title,
            url: items[0].url,
            dur: parseInt(vd.lengthSeconds),
            thumbnailUrl: vd.thumbnails[0].url,
            author: vd.author.name
        }
        
        io.to(_room_id).emit('add', { song, userId: _user._id });
    });

    socket.on('play', msg => {
        io.to(_room_id).emit('play');
    });

    socket.on('pause', msg => {
        io.to(_room_id).emit('pause');
    });

    socket.on('remove', song => {
        io.to(_room_id).emit('remove', song);
    })

    socket.on('ready', () => {
        let room = rooms.get(_room_id);
       
        if (++room.ready === room.users.length) {
            room.ready = 0;
            io.to(_room_id).emit('play');
        }
    })

    socket.on('skip', () => {
        io.to(_room_id).emit('skip');
    });

    socket.on('message', msg => {
        socket.to(_room_id).emit('message', msg);
    });

    socket.on('join', ({ room, user }) => {
        if (!rooms.has(room)) {
            socket.emit('room-failure', 'No such room exists');
            return;
        }
        
        socket.join(room);
        _user = user
        _room_id = room;
        const length = rooms.get(room).users.push(user);
        socket.emit('room-success', {
            room,
            users: rooms.get(room).users.slice(0, length-1),
        });
        socket.to(room).emit('join', user);
    });

    socket.on('create', ({ room, user }) => {
        if (rooms.has(room)) {
            socket.emit('room-failure', 'Room already exists');
            return;
        }
        
        socket.join(room);
        _user = user;
        _room_id = room;
        rooms.set(room, {
            users: [user],
            ready: 0,
        });
        socket.emit('room-success', { room });

        console.log('Room ' + room + ' Created by ' + user.username);
    })
}

io.on('connection', handleConnection);

httpServer.listen(3000);