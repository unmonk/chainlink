"use client"
import { Renderer, Triangle, Program, Color, Mesh } from 'ogl';
import React, { useRef, useEffect } from 'react';

var styles = {"gradient-canvas":"uvc__gradient-canvas"};

var vert = "\r\nattribute vec2 uv;\r\nattribute vec2 position;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = uv;\r\n    gl_Position = vec4(position, 0, 1);\r\n}";

var frag = "precision highp float;\r\n\r\nuniform float uTime;\r\nuniform vec3 uColor;\r\nuniform vec3 uResolution;\r\n\r\nvarying vec2 vUv;\r\n\r\nfloat colormap_red(float x) {\r\n    if (x < 0.2) {\r\n        return mix(0.0, 0.85, x/0.2);\r\n    } else if (x < 0.6) {\r\n        return mix(0.85, 1.0, (x - 0.2)/0.4);\r\n    } else {\r\n        return 1.0;\r\n    }\r\n}\r\n\r\nfloat colormap_green(float x) {\r\n    if (x < 0.2) {\r\n        return x * 0.3;\r\n    } else if (x < 0.6) {\r\n        return mix(0.06, 0.55, (x - 0.2)/0.4);\r\n    } else {\r\n        return mix(0.55, 0.85, (x - 0.6)/0.4);\r\n    }\r\n}\r\n\r\nfloat colormap_blue(float x) {\r\n    if (x < 0.2) {\r\n        return x * 0.02;\r\n    } else if (x < 0.6) {\r\n        return x * 0.05;\r\n    } else {\r\n        return mix(0.03, 0.2, (x - 0.6)/0.4);\r\n    }\r\n}\r\n\r\nvec4 colormap(float x) {\r\n    return vec4(colormap_red(x), colormap_green(x), colormap_blue(x), 1.0);\r\n}\r\n\r\n// https://iquilezles.org/articles/warp\r\n/*float noise( in vec2 x )\r\n{\r\n    vec2 p = floor(x);\r\n    vec2 f = fract(x);\r\n    f = f*f*(3.0-2.0*f);\r\n    float a = textureLod(iChannel0,(p+vec2(0.5,0.5))/256.0,0.0).x;\r\n\tfloat b = textureLod(iChannel0,(p+vec2(1.5,0.5))/256.0,0.0).x;\r\n\tfloat c = textureLod(iChannel0,(p+vec2(0.5,1.5))/256.0,0.0).x;\r\n\tfloat d = textureLod(iChannel0,(p+vec2(1.5,1.5))/256.0,0.0).x;\r\n    return mix(mix( a, b,f.x), mix( c, d,f.x),f.y);\r\n}*/\r\n\r\n\r\nfloat rand(vec2 n) {\r\n    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\r\n}\r\n\r\nfloat noise(vec2 p){\r\n    vec2 ip = floor(p);\r\n    vec2 u = fract(p);\r\n    u = u*u*(3.0-2.0*u);\r\n\r\n    float res = mix(\r\n    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),\r\n    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);\r\n    return res*res;\r\n}\r\n\r\nconst mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );\r\n\r\nfloat fbm(vec2 p) {\r\n    float f = 0.0;\r\n    float time = uTime * 0.8;\r\n    \r\n    f += 0.500000*noise(p + vec2(time * 0.2, time * 1.8)); p = mtx*p*2.02;\r\n    f += 0.350000*noise(p + vec2(-time * 0.15, time * 1.2)); p = mtx*p*2.01;\r\n    f += 0.175000*noise(p + vec2(time * 0.08, time * 0.6)); p = mtx*p*2.03;\r\n    f += 0.087500*noise(p + vec2(-time * 0.05, time * 0.3)); p = mtx*p*2.01;\r\n    f += 0.043750*noise(p + vec2(sin(time * 0.3) * 0.3, time * 0.15)); p = mtx*p*2.04;\r\n    f += 0.021875*noise(p + vec2(sin(time * 0.2) * 0.15, time * 0.08));\r\n\r\n    return f/1.178125;\r\n}\r\n\r\nfloat pattern(vec2 p) {\r\n    vec2 q = vec2(p.x, p.y * 2.0);\r\n    float f = fbm(q + fbm(q + fbm(q) * 3.0) * 2.5);\r\n    \r\n    float smoke = fbm(q * 0.4 + vec2(uTime * 0.15, uTime * 0.25));\r\n    smoke *= (1.2 - p.y * 0.4);\r\n    \r\n    float highlights = fbm(q * 2.2 + vec2(uTime * 0.25, uTime * 0.35));\r\n    highlights *= smoothstep(0.15, 0.7, p.y);\r\n    \r\n    return (f * (1.0 - p.y * 0.6) - smoke * 0.7 + highlights * 0.25) * 1.1;\r\n}\r\n\r\nvoid main() {\r\n    vec2 uv = vUv.xy*uResolution.xy/uResolution.x;\r\n    uv.y = 1.0 - uv.y;\r\n    uv *= vec2(0.8, 1.0);\r\n    uv.y -= 0.2;\r\n    \r\n    float shade = pattern(uv * 1.8);\r\n    shade += (1.0 - smoothstep(0.0, 0.4, uv.y)) * 0.2;\r\n    shade = pow(shade, 1.4);\r\n    shade = clamp(shade * 0.9, 0.0, 1.0);\r\n    \r\n    gl_FragColor = vec4(colormap(shade).rgb, shade);\r\n}";

function Inferno(props) {
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
                uColor: { value: new Color(0.1, 0.05, 0.02) },
                uResolution: {
                    value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height),
                },
                uSmokeIntensity: { value: 2.0 },
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

export { Inferno };
