var socket = require('socket.io-client')('http://192.170.1.14:9080');
var fs = require('fs');
var parser = require('xml2json');
var sys = require('sys');
var exec = require('child_process').exec;

var name = process.argv[2] || 'Serveur 1';
console.log("VM "+name+" is started");

socket.on('waiting', function(){
	var waiting = 600;
	exec('phoronix-test-suite info apache', function(error, stdout, stderr){
		var data = stdout;
        var re = /Estimated Run-Time:[\s]+(\d+)[\s]+Seconds/g;
        result = re.exec(data);
        waiting = result[1];
        socket.emit('waiting', waiting);
	});
});

socket.on('simulate', function(id){
	console.log('Simulation start for client '+id);

	var id = 'BhUt06iOtab1KKz6AAC9';
	var idpath = id.replace('_', '').replace('-', '').toLowerCase();

	//exec('echo "'+id+'" | /chill_project/scripts/launch_test.sh', function(error, stdout, stderr) {
		fs.readFile('/var/lib/phoronix-test-suite/test-results/'+idpath+'/composite.xml', 'utf-8', function(err, data){
			if(err)
				console.log(err);

			var json = JSON.parse(parser.toJson(data));
			var hardware = json.PhoronixTestSuite.System.Hardware;
			var re = /Hz \((\d+) Core[s]?\), Motherboard/g;
			var core = re.exec(hardware)[1];
			re = /Memory: (\d+) x (\d+) MB DRAM/g;
			var ramtemp = re.exec(hardware);
			var ram = ramtemp[1] * ramtemp[2];
			re = /Disk: ([\d]+)GB/g;
			var disk = re.exec(hardware)[1];

			var result = {
				capacity: parseInt(json.PhoronixTestSuite.Result.Data.Entry.Value),
				name: name,
				core: parseInt(core),
				ram: parseInt(ram),
				disk: parseInt(disk)
			}

			console.log('Sending simulation result sent for client '+id);
			socket.emit('response', result);

		});
	//});
});