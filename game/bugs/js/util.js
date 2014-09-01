function rad(qdeg){
    return qdeg*Math.PI/180;//(qdeg * 1.745329E-002);
}
function deg(qrad){
    return qrad*180/Math.PI;//(qrad * 57.295780);
}
function findang(dx, dy) {
    return (deg(Math.atan2(dy, dx)))
}
function random(max) {
    return parseInt(Math.random()*max);
}