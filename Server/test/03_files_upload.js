var should = require('should');
var sconfig = require('./../dist/config.json');
var net = require('net');
var fs = require('fs');

describe("FILE upload TCP:", () => {
    var client, client1;
    it('should say file size error', (done) => {
        var client = new net.Socket();
        client.connect(sconfig.image_server.tcpport, 'fileserver', () => {
            client.on('data', (data) => {
                var d = data.toString();
                if(d.indexOf('FILE LIMITATION ERROR:') > -1) {
                    done();
                }
            });
            client.write('FILE 0 test.txt\n');
        });
    });
    it('should say file size error', (done) => {
        var client = new net.Socket();
        client.connect(sconfig.image_server.tcpport, 'fileserver', () => {
            client.on('data', (data) => {
                var d = data.toString();
                if(d.indexOf('FILE LIMITATION ERROR:') > -1) {
                    done();
                }
            });
            client.write('FILE '+(sconfig.fileSizeLimit+1)+' test.txt\n');
        });
    });
    it('should upload file', function(done) {
        this.timeout(10000);
        var client = new net.Socket();

        client.connect(sconfig.image_server.tcpport, 'fileserver', () => {
            client.on('data', (data) => {
                let d = data.toString();
                if(d.indexOf(':'+sconfig.ip+' FILE :http') > -1) {
                    done();
                }
            });
            fs.readFile('./test/smile.png', (err, data) => {
                client.write('FILE '+data.length+ ' smile.png\n');
                client.write(data, 'binary');
            });
        });
    });
});