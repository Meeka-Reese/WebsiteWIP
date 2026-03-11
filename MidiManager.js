
export class MidiObj
{
    constructor()
    {
        this.Player = new MidiPlayer.Player(this.MidiCallback());
    }
    async LoadFile(dir)
    {
        const Response = await fetch(dir);
        const Buffer = await Response.arrayBuffer();
        this.Player.loadArrayBuffer(Buffer);
        console.log("Midi Buffer Loaded");
    }
    StartMidi()
    {
        this.Player.play();
        console.log("Midi clip starting");
    }
    StopMidi()
    {
        this.Player.stop();
    }
    MidiCallback()
    {
        console.log("Midi Event has occured");
    }

}

