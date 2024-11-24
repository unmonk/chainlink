"use client"
import { Renderer, Triangle, Program, Color, Mesh } from 'ogl';
import React, { useRef, useEffect } from 'react';

var styles = {"gradient-canvas":"uvc__gradient-canvas"};

var vert = "\r\nattribute vec2 uv;\r\nattribute vec2 position;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = uv;\r\n    gl_Position = vec4(position, 0, 1);\r\n}";

var frag = "precision highp float;\r\n\r\nuniform float uTime;\r\nuniform vec3 uResolution;\r\n\r\nvarying vec2 vUv;\r\n\r\n// Simplex 2D noise\r\nvec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }\r\n\r\nfloat snoise(vec2 v) {\r\n    const vec4 C = vec4(0.211324865405187, 0.366025403784439,\r\n        -0.577350269189626, 0.024390243902439);\r\n    vec2 i  = floor(v + dot(v, C.yy) );\r\n    vec2 x0 = v -   i + dot(i, C.xx);\r\n    vec2 i1;\r\n    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\r\n    vec4 x12 = x0.xyxy + C.xxzz;\r\n    x12.xy -= i1;\r\n    i = mod(i, 289.0);\r\n    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\r\n        + i.x + vec3(0.0, i1.x, 1.0 ));\r\n    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),\r\n        dot(x12.zw,x12.zw)), 0.0);\r\n    m = m*m ;\r\n    m = m*m ;\r\n    vec3 x = 2.0 * fract(p * C.www) - 1.0;\r\n    vec3 h = abs(x) - 0.5;\r\n    vec3 ox = floor(x + 0.5);\r\n    vec3 a0 = x - ox;\r\n    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\r\n    vec3 g;\r\n    g.x  = a0.x  * x0.x  + h.x  * x0.y;\r\n    g.yz = a0.yz * x12.xz + h.yz * x12.yw;\r\n    return 130.0 * dot(m, g);\r\n}\r\n\r\nvoid main() {\r\n    vec2 uv = vUv;\r\n    \r\n    // Create multiple layers of waves\r\n    float t = uTime * 0.4;\r\n    \r\n    // Base wave layer\r\n    float wave1 = snoise(vec2(uv.x * 3.0 + t, uv.y * 2.0)) * 0.5;\r\n    float wave2 = snoise(vec2(uv.x * 5.0 - t * 0.8, uv.y * 3.0)) * 0.25;\r\n    float wave3 = snoise(vec2(uv.x * 8.0 + t * 0.4, uv.y * 4.0)) * 0.125;\r\n    \r\n    float waves = wave1 + wave2 + wave3;\r\n    \r\n    // Create foam effect at wave peaks\r\n    float foam = smoothstep(0.4, 0.8, waves);\r\n    \r\n    // Deep water color\r\n    vec3 deepColor = vec3(0.0, 0.1, 0.2);\r\n    // Shallow water color\r\n    vec3 shallowColor = vec3(0.1, 0.4, 0.6);\r\n    // Foam color\r\n    vec3 foamColor = vec3(0.8, 0.8, 0.8);\r\n    \r\n    // Mix colors based on wave height\r\n    vec3 waterColor = mix(deepColor, shallowColor, waves + 0.5);\r\n    vec3 finalColor = mix(waterColor, foamColor, foam);\r\n    \r\n    // Add subtle shoreline gradient\r\n    float shoreline = smoothstep(0.0, 0.8, uv.y);\r\n    finalColor = mix(vec3(0.8, 0.8, 0.7), finalColor, shoreline);\r\n    \r\n    gl_FragColor = vec4(finalColor, 1.0);\r\n}";

function Ocean(props) {
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

export { Ocean };
