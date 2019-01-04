var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const mlabURI = 'mongodb://hieudu0ngtrung:duongtrunghieu01@ds129233.mlab.com:29233/bloghieudu0ng'
const dbName = 'bloghieudu0ng';

const connectdb = mongoose.connect(mlabURI,{
	reconnectTries : Number.MAX_VALUE,
	autoReconnect : true,
	useNewUrlParser: true
}, (error) => {
	if(error){
		console.log("Error " + error);
	}else{
		console.log("kết nối với server database thành công")
	}
});

module.exports = connectdb;