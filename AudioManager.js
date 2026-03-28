export function PlayAudio(dir)
{
    let audio = new Audio(dir);
    audio.play();
    return audio;
}
export async function StopAudio(audio)
{
    audio.pause();
    audio.currentTime = 0;
    return null;
}