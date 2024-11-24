"use client"
import { Renderer, Triangle, Program, Color, Mesh } from 'ogl';
import React, { useRef, useEffect } from 'react';

var styles = {"gradient-canvas":"uvc__gradient-canvas"};

var vert = "attribute vec2 uv;\r\nattribute vec2 position;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = uv;\r\n    gl_Position = vec4(position, 0, 1);\r\n}";

var frag = "precision highp float;\r\n\r\nuniform float uTime;\r\nuniform vec3 uResolution;\r\nvarying vec2 vUv;\r\n\r\n#define tau 6.2831853\r\n\r\nmat2 makem2(float theta) {\r\n    float c = cos(theta);\r\n    float s = sin(theta);\r\n    return mat2(c, -s, s, c);\r\n}\r\n\r\nfloat rand(vec2 n) {\r\n    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\r\n}\r\n\r\nfloat noise(vec2 p) {\r\n    vec2 ip = floor(p);\r\n    vec2 u = fract(p);\r\n    u = u*u*(3.0-2.0*u);\r\n    \r\n    float res = mix(\r\n        mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),\r\n        mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x),\r\n        u.y);\r\n    return res*res;\r\n}\r\n\r\nfloat fbm(vec2 p) {\r\n    float z = 2.0;\r\n    float rz = 0.0;\r\n    vec2 bp = p;\r\n    for (float i = 1.0; i < 6.0; i++) {\r\n        rz += abs((noise(p)-0.5)*2.0)/z;\r\n        z = z*2.0;\r\n        p = p*2.0;\r\n    }\r\n    return rz;\r\n}\r\n\r\nfloat dualfbm(vec2 p) {\r\n    float time = uTime * 0.15;\r\n    vec2 p2 = p * 0.7;\r\n    vec2 basis = vec2(\r\n        fbm(p2 - time * 1.6),\r\n        fbm(p2 + time * 1.7)\r\n    );\r\n    basis = (basis - 0.5) * 0.2;\r\n    p += basis;\r\n    \r\n    return fbm(p * makem2(time * 0.2));\r\n}\r\n\r\nfloat circ(vec2 p) {\r\n    float r = length(p);\r\n    r = log(sqrt(r));\r\n    return abs(mod(r*4.0, tau)-3.14)*3.0+0.2;\r\n}\r\n\r\nvoid main() {\r\n    vec2 fragCoord = vUv * uResolution.xy;\r\n    vec2 p = (fragCoord / uResolution.xy) - 0.5;\r\n    p.x *= uResolution.x/uResolution.y;\r\n    p *= 4.0;\r\n    \r\n    float rz = dualfbm(p);\r\n    \r\n    p /= exp(mod(uTime * 1.5, 3.14159));\r\n    rz *= pow(abs((0.1-circ(p))), 0.9);\r\n    \r\n    vec3 col = vec3(0.2, 0.1, 0.4)/rz;\r\n    col = pow(abs(col), vec3(0.99));\r\n    \r\n    gl_FragColor = vec4(col, 1.0);\r\n}";

function Hip(props) {
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

export { Hip };
