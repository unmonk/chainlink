"use client"
import { Renderer, Triangle, Program, Color, Mesh } from 'ogl';
import React, { useRef, useEffect } from 'react';

var styles = {"gradient-canvas":"uvc__gradient-canvas"};

var vert = "\r\nattribute vec2 uv;\r\nattribute vec2 position;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = uv;\r\n    gl_Position = vec4(position, 0, 1);\r\n}";

var frag = "precision highp float;\r\n\r\nuniform float uTime;\r\nuniform vec3 uResolution;\r\n\r\nvarying vec2 vUv;\r\n\r\nvec3 palette(float t) {\r\n    vec3 a = vec3(0.5, 0.5, 0.5);\r\n    vec3 b = vec3(0.5, 0.5, 0.5);\r\n    vec3 c = vec3(1.0, 1.0, 1.0);\r\n    vec3 d = vec3(0.263,0.416,0.557);\r\n    return a + b*cos(6.28318*(c*t+d));\r\n}\r\n\r\nmat2 rotation(float angle) {\r\n    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));\r\n}\r\n\r\nvoid main() {\r\n    // Convert vUv coordinates to match ShaderToy's coordinate system\r\n    vec2 fragCoord = vUv * uResolution.xy;\r\n    vec2 p = vUv - 0.5;\r\n    vec2 uv = (fragCoord * 2.0 - uResolution.xy) / uResolution.y;\r\n    vec2 uv2 = uv;\r\n    vec3 r2 = normalize(vec3(uv, 1.1 - dot(uv, uv) * 4.002 * cos(uTime)));\r\n    vec2 uv0 = uv;\r\n    vec3 finalColor = vec3(0.0);\r\n    \r\n    vec3 c = vec3(0.0);\r\n    uv2 *= rotation(uTime);\r\n    uv += r2.xy;\r\n    \r\n    // First effect layer\r\n    for(int i = 0; i < 40; i++) {\r\n        float t = 6.28318 * float(i) / 20.0 * uTime * 0.1;\r\n        float x = cos(t * 1.5);\r\n        float y = sin(t + cos(uTime / 1.0));\r\n        vec2 o = 0.2 * vec2(x, y);\r\n        c += 0.01 / (length(p - o)) * vec3(0.2);\r\n    }\r\n    \r\n    // Second effect layer\r\n    for(float i = 0.0; i < 5.0; i++) {\r\n        uv = fract(uv * 2.5) - 0.5;\r\n        uv *= rotation(2.0 * 6.28318 * (0.3 - clamp(length(uv2), 0.0, 0.3)));\r\n        uv *= vec2(fract(log(length(uv.xy)) + uTime * 0.25));\r\n        uv2 += r2.xy;\r\n        uv += uv2;\r\n        \r\n        float d = length(uv) * exp(-length(uv0));\r\n        vec3 col = palette(length(uv0) + i * 0.4 + uTime * 0.4);\r\n        \r\n        d = sin(d * 8.0 + uTime) / 8.0;\r\n        d = abs(d);\r\n        d = pow(0.01 / d, 1.2);\r\n        \r\n        finalColor += col * d;\r\n    }\r\n    \r\n    gl_FragColor = vec4(finalColor, 1.0);\r\n}";

function Mandala(props) {
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
            // camera.perspective({
            //   aspect: gl.canvas.width / gl.canvas.height,
            // });
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
            // Don't need a camera if camera uniforms aren't required
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

export { Mandala };
