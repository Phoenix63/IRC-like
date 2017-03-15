import cluster from 'cluster';

if(cluster.isMaster) {
    require('./app/master').run(cluster);
} else {
    require('./app/server').run(cluster);
}