"use client"
import { Renderer, Triangle, Program, Color, Mesh } from 'ogl';
import React, { useRef, useEffect } from 'react';

var styles = {"container":"uvc__container"};

var vert = "attribute vec2 uv;\r\nattribute vec2 position;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = uv;\r\n    gl_Position = vec4(position, 0, 1);\r\n}";

var frag = "precision highp float;\r\n\r\nuniform float uTime;\r\nuniform vec3 uResolution;\r\n\r\nvarying vec2 vUv;\r\n\r\nmat2 rot(float a) {\r\n    float c = cos(a), s = sin(a);\r\n    return mat2(c,s,-s,c);\r\n}\r\n\r\nconst float pi = acos(-1.0);\r\nconst float pi2 = pi*2.0;\r\n\r\nvec2 pmod(vec2 p, float r) {\r\n    float a = atan(p.x, p.y) + pi/r;\r\n    float n = pi2 / r;\r\n    a = floor(a/n)*n;\r\n    return p*rot(-a);\r\n}\r\n\r\nfloat box( vec3 p, vec3 b ) {\r\n    vec3 d = abs(p) - b;\r\n    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));\r\n}\r\n\r\nfloat ifsBox(vec3 p) {\r\n    for (int i=0; i<5; i++) {\r\n        p = abs(p) - 1.0;\r\n        p.xy *= rot(uTime*0.3);\r\n        p.xz *= rot(uTime*0.1);\r\n    }\r\n    p.xz *= rot(uTime);\r\n    return box(p, vec3(0.4,0.8,0.3));\r\n}\r\n\r\nfloat map(vec3 p, vec3 cPos) {\r\n    vec3 p1 = p;\r\n    p1.x = mod(p1.x-5., 10.) - 5.;\r\n    p1.y = mod(p1.y-5., 10.) - 5.;\r\n    p1.z = mod(p1.z, 16.)-8.;\r\n    p1.xy = pmod(p1.xy, 5.0);\r\n    return ifsBox(p1);\r\n}\r\n\r\nvoid main() {\r\n    vec2 p = (vUv * 2.0 - 1.0) * vec2(uResolution.z, 1.0);\r\n\r\n    vec3 cPos = vec3(0.0,0.0, -3.0 * uTime);\r\n    vec3 cDir = normalize(vec3(0.0, 0.0, -1.0));\r\n    vec3 cUp  = vec3(sin(uTime), 1.0, 0.0);\r\n    vec3 cSide = cross(cDir, cUp);\r\n\r\n    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir);\r\n\r\n    float acc = 0.0;\r\n    float acc2 = 0.0;\r\n    float t = 0.0;\r\n    \r\n    for (int i = 0; i < 99; i++) {\r\n        vec3 pos = cPos + ray * t;\r\n        float dist = map(pos, cPos);\r\n        dist = max(abs(dist), 0.02);\r\n        float a = exp(-dist*3.0);\r\n        if (mod(length(pos)+24.0*uTime, 30.0) < 3.0) {\r\n            a *= 2.0;\r\n            acc2 += a;\r\n        }\r\n        acc += a;\r\n        t += dist * 0.5;\r\n    }\r\n\r\n    vec3 col = vec3(acc * 0.005, acc * 0.02 + acc2*0.004, acc * 0.003 + acc2*0.001);\r\n    gl_FragColor = vec4(col, 1.0 - t * 0.03);\r\n}";

function PhantomStar(props) {
    const ctnDom = useRef(null);
    useEffect(() => {
        if (!ctnDom.current)
            return;
        const ctn = ctnDom.current;
        const renderer = new Renderer({
            alpha: true,
            depth: false,
        });
        const gl = renderer.gl;
        function resize() {
            renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
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
            transparent: true,
        });
        const mesh = new Mesh(gl, { geometry, program });
        let animateId;
        function update(t) {
            animateId = requestAnimationFrame(update);
            program.uniforms.uTime.value = t * 0.001;
            renderer.render({ scene: mesh });
        }
        animateId = requestAnimationFrame(update);
        ctn.appendChild(gl.canvas);
        return () => {
            cancelAnimationFrame(animateId);
            window.removeEventListener("resize", resize);
            ctn.removeChild(gl.canvas);
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
    }, []);
    return (React.createElement("div", { ref: ctnDom, className: styles.container, style: {
            width: "100%",
            height: "100%",
        }, ...props }));
}

export { PhantomStar };
