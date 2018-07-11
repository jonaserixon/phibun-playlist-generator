const millisToMinutesAndSeconds = (millis) => {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

const randomTracklist = (count, array) => {
    const tmp = array.slice(array);
    const tracks = [];
    
    for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * tmp.length);
        const removed = tmp.splice(index, 1);
        tracks.push(removed[0]);
    }
    return tracks;
}

module.exports = {
    millisToMinutesAndSeconds,
    randomTracklist
}