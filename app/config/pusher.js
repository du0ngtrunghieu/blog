var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '654336',
  key: '16a7d55c1da0c140f2ed',
  secret: '246bbf0c8b0b11b3d8e8',
  cluster: 'ap1',
  encrypted: true
});

module.exports ={
     pusher : pusher
}