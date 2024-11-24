"use client"
import { Renderer, Triangle, Program, Color, Mesh } from 'ogl';
import React, { useRef, useEffect } from 'react';

var styles = {"gradient-canvas":"uvc__gradient-canvas"};

var vert = "\r\nattribute vec2 uv;\r\nattribute vec2 position;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = uv;\r\n    gl_Position = vec4(position, 0, 1);\r\n}";

var frag = "precision highp float;\r\n\r\nuniform float uTime;\r\nuniform vec3 uResolution;\r\n\r\nvarying vec2 vUv;\r\n\r\n// Hexagon function returns { 2d cell id, distance to border, distance to center }\r\nvec4 hexagon(vec2 p) {\r\n    vec2 q = vec2(p.x * 2.0 * 0.5773503, p.y + p.x * 0.5773503);\r\n    \r\n    vec2 pi = floor(q);\r\n    vec2 pf = fract(q);\r\n\r\n    float v = mod(pi.x + pi.y, 3.0);\r\n\r\n    float ca = step(1.0, v);\r\n    float cb = step(2.0, v);\r\n    vec2  ma = step(pf.xy, pf.yx);\r\n    \r\n    // distance to borders\r\n    float e = dot(ma, 1.0-pf.yx + ca*(pf.x+pf.y-1.0) + cb*(pf.yx-2.0*pf.xy));\r\n\r\n    // distance to center    \r\n    p = vec2(q.x + floor(0.5+p.y/1.5), 4.0*p.y/3.0) * 0.5 + 0.5;\r\n    float f = length((fract(p) - 0.5) * vec2(1.0, 0.85));        \r\n    \r\n    return vec4(pi + ca - cb*ma, e, f);\r\n}\r\n\r\nfloat hash1(vec2 p) { \r\n    float n = dot(p, vec2(127.1, 311.7));\r\n    return fract(sin(n) * 43758.5453);\r\n}\r\n\r\nfloat noise(vec2 p) {\r\n    vec2 i = floor(p);\r\n    vec2 f = fract(p);\r\n    f = f * f * (3.0 - 2.0 * f);\r\n    \r\n    float a = hash1(i);\r\n    float b = hash1(i + vec2(1.0, 0.0));\r\n    float c = hash1(i + vec2(0.0, 1.0));\r\n    float d = hash1(i + vec2(1.0, 1.0));\r\n    \r\n    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);\r\n}\r\n\r\nvoid main() {\r\n    vec2 uv = vUv;\r\n    vec2 pos = (2.0 * vUv - 1.0) * vec2(uResolution.z, 1.0);\r\n\r\n    // distort\r\n    pos *= 1.2 + 0.15 * length(pos);\r\n\r\n    // gray\r\n    vec4 h = hexagon(8.0 * pos + 0.5 * uTime);\r\n    float n = noise(0.3 * h.xy + uTime * 0.1);\r\n    vec3 col = 0.15 + 0.15 * hash1(h.xy + 1.2) * vec3(1.0);\r\n    col *= smoothstep(0.10, 0.11, h.z);\r\n    col *= smoothstep(0.10, 0.11, h.w);\r\n    col *= 1.0 + 0.15 * sin(40.0 * h.z);\r\n    col *= 0.75 + 0.5 * h.z * n;\r\n\r\n    // shadow\r\n    h = hexagon(6.0 * (pos + 0.1 * vec2(-1.3, 1.0)) + 0.6 * uTime);\r\n    col *= 1.0 - 0.8 * smoothstep(0.45, 0.451, noise(0.3 * h.xy + uTime * 0.1));\r\n\r\n    // green (previously red)\r\n    h = hexagon(6.0 * pos + 0.6 * uTime);\r\n    n = noise(0.3 * h.xy + uTime * 0.1);\r\n    vec3 colb = 0.9 + 0.8 * sin(hash1(h.xy) * 1.5 + 2.0 + vec3(1.0, 0.1, 1.1));\r\n    colb *= smoothstep(0.10, 0.11, h.z);\r\n    colb *= 1.0 + 0.15 * sin(40.0 * h.z);\r\n\r\n    col = mix(col, colb, smoothstep(0.45, 0.451, n));\r\n    col *= 2.5/(2.0 + col);\r\n    col *= pow(16.0 * uv.x * (1.0-uv.x) * uv.y * (1.0-uv.y), 0.1);\r\n\r\n    gl_FragColor = vec4(col, 1.0);\r\n}";

function Hexagons(props) {
    const ctnDom = useRef(null);
    useEffect(() => {
        if (!ctnDom.current) {
            return;
        }
        const ctn = ctnDom.current;
        const renderer = new Renderer();
        const gl = renderer.gl;
        gl.clearColor(1, 1, 1, 1);
        function resize() {
            const scale = 1;
            renderer.setSize(ctn.offsetWidth * scale, ctn.offsetHeight * scale);
        }
        window.addEventListener("resize", resize, false);
        resize();
        const geometry = new Triangle(gl);
        const program = new Program(gl, {
            vertex: vert,
            fragment: frag,
            uniforms: {
                uTime: { value: 0 },
                uResolution: {
                    value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height),
                },
            },
        });
        const mesh = new Mesh(gl, { geometry, program });
        let animateId;
        animateId = requestAnimationFrame(update);
        function update(t) {
            animateId = requestAnimationFrame(update);
            program.uniforms.uTime.value = t * 0.001;
            renderer.render({ scene: mesh });
        }
        ctn.appendChild(gl.canvas);
        return () => {
            cancelAnimationFrame(animateId);
            window.removeEventListener("resize", resize);
            ctn.removeChild(gl.canvas);
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
    }, []);
    return (React.createElement("div", { ref: ctnDom, className: styles.gradientCanvas, style: {
            width: "100%",
            height: "100%",
        }, ...props }));
}

export { Hexagons };
