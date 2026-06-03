#version 300 es
    precision mediump float;    
    uniform vec4 objCol;
    out vec4 fragColor;
 
    void main()
    {
        fragColor = objCol;
    }