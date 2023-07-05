export default function wait(time){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time*1000);
    })
}