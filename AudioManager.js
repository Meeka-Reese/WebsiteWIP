export function PlayAudio(dir)
{
    let audio = new Audio(dir);
    audio.play();
    return audio;
}
export function StopAudio(audio)
{
    audio.stop();
    return null;
}