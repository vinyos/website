"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type * as Three from "three";
import { createTimeline } from "animejs";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import mesh from "./mesh.json";
import { CHAPTERS, DETAILS, LOGIN_URL, SIGNUP_URL, STOPS } from "./story";
import { CSS } from "./motion-style";
import { featureVertices, FEATURE_TOKENS, type Feature } from "./feature-surfaces";
import { convexHull, placeAnnotation, type Point, type Rect } from "./annotation-layout";
import { ScrollMotion } from "./scroll-motion";
import DrawingExplorer from "./DrawingExplorer";

export default function HeroMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const badges = useRef<(HTMLDivElement | null)[]>([]);
  const lines = useRef<(SVGPathElement | null)[]>([]);
  const dots = useRef<(SVGCircleElement | null)[]>([]);
  const progressBar = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [reduced, setReduced] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const current = CHAPTERS[chapter];
  const details = current.segment >= 0 ? DETAILS[current.segment] : [];

  const jump = (index: number) => {
    if (!root.current) return;
    const start = root.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: start + (root.current.offsetHeight - window.innerHeight) * index / (CHAPTERS.length - 1), behavior: "instant" });
  };

  useEffect(() => {
    const element = root.current;
    const mount = host.current;
    if (!element || !mount) return;
    const abort = new AbortController();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = preference.matches;
    let disposed = false;
    let raf = 0;
    const disposals: (() => void)[] = [];
    const clean = () => { cancelAnimationFrame(raf); disposals.splice(0).reverse().forEach(dispose => dispose()); };
    const changePreference = () => { reduceMotion = preference.matches; setReduced(reduceMotion); };
    preference.addEventListener("change", changePreference);
    setReduced(reduceMotion);
    setStatus("loading");

    (async () => {
      const response = await fetch("/hero2/netz.bin?v=solid-2", { signal: abort.signal });
      if (!response.ok) throw new Error("Das Modell konnte nicht geladen werden.");
      const buffer = await response.arrayBuffer();
      if (disposed) return;
      const css = getComputedStyle(element);
      const color = (token: string) => new THREE.Color(css.getPropertyValue(token).trim());
      const metal = color("--hm-metal");
      const cut = color("--hm-thread-metal");
      const featureColors = Object.fromEntries(Object.entries(FEATURE_TOKENS).map(([kind,token])=>[kind,color(token)])) as Record<Feature,THREE.Color>;
      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = .88;
      mount.appendChild(renderer.domElement);
      disposals.push(() => { renderer.dispose(); renderer.domElement.remove(); });
      const camera = new THREE.OrthographicCamera(-160, 160, 100, -100, .1, 1500);
      camera.position.set(0, 0, 500);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const environment = pmrem.fromScene(room, .04);
      scene.environment = environment.texture;
      room.dispose(); pmrem.dispose();
      disposals.push(() => environment.dispose());
      scene.add(new THREE.HemisphereLight(color("--hm-white"), color("--hm-metal"), .7));
      const key = new THREE.DirectionalLight(color("--hm-white"), 2.4);
      key.position.set(-80, 120, 180); scene.add(key);
      const rim = new THREE.DirectionalLight(color("--hm-white"), 1.2);
      rim.position.set(110, -20, -30); scene.add(rim);
      const group = new THREE.Group(); scene.add(group);

      const geometry = (data: typeof mesh.segmente[number]["dreh"]) => {
        const geo = new THREE.BufferGeometry();
        const positions = Float32Array.from(new Int16Array(buffer, data.vOff, data.vLen / 2), n => n / mesh.skala);
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute("normal", new THREE.Float32BufferAttribute(Float32Array.from(new Int8Array(buffer, data.nOff, data.nLen), n => n / 127), 3));
        geo.setIndex(new THREE.BufferAttribute(new Uint16Array(buffer, data.iOff, data.iLen / 2), 1));
        const colors = new Float32Array(positions.length);
        colors.fill(1);
        geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        disposals.push(() => geo.dispose());
        return geo;
      };
      const nodes = mesh.segmente.map((segment, segmentIndex) => {
        const node = new THREE.Group(); group.add(node);
        const surfaces: { geometry: Three.BufferGeometry; features:(Feature|null)[] }[] = [];
        for (const process of ["dreh", "fraes"] as const) {
          if (!segment[process].iLen) continue;
          const geo = geometry(segment[process]);
          // Echte, geschlossene CAD-Segmente, ohne durchsichtige Nachbarflächen.
          const material = new THREE.MeshStandardMaterial({ color: color("--hm-white"), metalness: .8, roughness: .32, envMapIntensity: 1.1, vertexColors: true });
          node.add(new THREE.Mesh(geo, material));
          const features=featureVertices(segmentIndex,segment.mitte,geo.getAttribute("position").array,geo.getAttribute("normal").array,geo.getIndex()!.array);
          surfaces.push({ geometry: geo, features });
          disposals.push(() => material.dispose());
        }
        const outline: Three.Vector3[] = [], unique=new Set<string>();
        for(const {geometry} of surfaces){
          const points=geometry.getAttribute("position");
          for(let i=0;i<points.count;i++){
            const x=points.getX(i),y=points.getY(i),z=points.getZ(i),key=`${x},${y},${z}`;
            if(!unique.has(key)){unique.add(key);outline.push(new THREE.Vector3(x,y,z));}
          }
        }
        return { node, surfaces, outline };
      });

      // Das STEP enthält das Kernloch. Die Helix veranschaulicht die Gewindeangabe aus der Zeichnung.
      class ThreadCurve extends THREE.Curve<THREE.Vector3> {
        constructor() { super(); }
        getPoint(t: number, target = new THREE.Vector3()) {
          const z = 85.5 + t * 15.5;
          const angle = (z - 85.5) / 2 * Math.PI * 2;
          return target.set(16.88 * Math.cos(angle), 16.88 * Math.sin(angle), z - mesh.segmente[4].mitte);
        }
      }
      const threadGeometry = new THREE.TubeGeometry(new ThreadCurve(), 900, .22, 5, false);
      const threadMaterial = new THREE.MeshStandardMaterial({ color: cut, metalness: .82, roughness: .27 });
      const thread = new THREE.Mesh(threadGeometry, threadMaterial);
      nodes[4].node.add(thread);
      disposals.push(() => { threadGeometry.dispose(); threadMaterial.dispose(); });

      // Alle Merkmale eines Segments sind gemeinsam sichtbar. Die CAD-Normalen trennen Stirn- und Mantelflächen.
      const highlight = (segment: number) => {
        threadMaterial.color.copy(segment === 4 ? cut : metal);
        nodes.forEach(({surfaces}, index) => surfaces.forEach(({geometry: geo, features}) => {
          const colors = geo.getAttribute("color") as Three.BufferAttribute;
          for (let i = 0; i < colors.count; i++) {
            const feature=features[i];
            const tint=index===segment && feature ? featureColors[feature] : metal;
            colors.setXYZ(i, tint.r, tint.g, tint.b);
          }
          colors.needsUpdate = true;
        }));
      };
      const pose: Record<string, number> = { ...STOPS[0] };
      const timeline = createTimeline({ autoplay: false });
      STOPS.slice(1).forEach((stop, index) => timeline.add(pose, { ...stop, duration: 860, ease: "inOutSine" }, index*1000+70));
      disposals.push(() => timeline.cancel());
      let width = 1, height = 1, viewHeight = 200, mobile = false, travel = 1, startY = 0;
      let previous = -1, previousReduced = reduceMotion, selected = "";
      let motion: ScrollMotion | null = null;
      const resize = () => {
        width = mount.clientWidth; height = mount.clientHeight;
        mobile = width < 760;
        viewHeight = mobile ? 240 : Math.max(200, 310/(width/height));
        camera.left = -viewHeight*width/height/2; camera.right = -camera.left;
        camera.top = viewHeight/2; camera.bottom = -camera.top;
        camera.updateProjectionMatrix(); renderer.setSize(width,height);
        travel = element.offsetHeight - window.innerHeight;
        startY = element.getBoundingClientRect().top + window.scrollY;
        previous = -1;
      };
      const observer = new ResizeObserver(resize); observer.observe(mount);
      window.addEventListener("resize", resize);
      disposals.push(() => { observer.disconnect(); window.removeEventListener("resize", resize); });
      const contextLost = (event: Event) => { event.preventDefault(); setStatus("error"); };
      renderer.domElement.addEventListener("webglcontextlost", contextLost);
      disposals.push(() => renderer.domElement.removeEventListener("webglcontextlost", contextLost));
      resize();
      const lastChapter=CHAPTERS.length-1;
      const scrollChapter=()=>Math.max(0,Math.min(lastChapter,Math.round((window.scrollY-startY)/Math.max(1,travel)*lastChapter)));
      const inStage=()=>window.scrollY>=startY-2 && window.scrollY<=startY+travel+2;
      const snapTo=(chapter:number)=>window.scrollTo({top:startY+travel*chapter/lastChapter,behavior:"instant"});
      let wheelAmount=0, lastWheel=0, wheelDirection=0, wheelLocked=false, touchY:number|null=null, touchX=0, touchHandled=false;
      const step=(direction:number)=>{
        if(!motion||motion.moving||performance.now()<motion.restUntil) return;
        snapTo(Math.max(0,Math.min(lastChapter,scrollChapter()+direction)));
      };
      const canLeave=(direction:number)=>motion && !motion.moving &&
        ((direction<0&&motion.to===0)||(direction>0&&motion.to===lastChapter));
      const wheel=(event:WheelEvent)=>{
        if(!inStage()||event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||!event.deltaY) return;
        const direction=Math.sign(event.deltaY), now=performance.now();
        if(canLeave(direction)) return;
        event.preventDefault();
        if(now-lastWheel>160||direction!==wheelDirection){wheelLocked=false;wheelAmount=0;}
        lastWheel=now;wheelDirection=direction;
        if(wheelLocked||motion?.moving) return;
        wheelAmount+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?height:1);
        if(Math.abs(wheelAmount)>=45){step(direction);wheelLocked=true;wheelAmount=0;}
      };
      const touchStart=(event:TouchEvent)=>{
        if(event.touches.length!==1){touchY=null;return;}
        touchY=event.touches[0].clientY;touchX=event.touches[0].clientX;touchHandled=false;
      };
      const touchMove=(event:TouchEvent)=>{
        if(touchY===null||event.touches.length!==1||!inStage()) return;
        const dy=touchY-event.touches[0].clientY,dx=touchX-event.touches[0].clientX;
        if(Math.abs(dx)>Math.abs(dy)||canLeave(Math.sign(dy))) return;
        event.preventDefault();
        if(!touchHandled&&Math.abs(dy)>38){step(Math.sign(dy));touchHandled=true;}
      };
      const keyDown=(event:KeyboardEvent)=>{
        if(!inStage()||event.altKey||event.ctrlKey||event.metaKey||
          (event.target instanceof Element&&event.target.closest('a,button,input,textarea,select,[contenteditable="true"]'))) return;
        const direction=["ArrowDown","PageDown"," "].includes(event.key)?(event.shiftKey?-1:1):["ArrowUp","PageUp"].includes(event.key)?-1:0;
        if(!direction||canLeave(direction)) return;
        event.preventDefault();step(direction);
      };
      window.addEventListener("wheel",wheel,{passive:false});
      window.addEventListener("touchstart",touchStart,{passive:true});
      window.addEventListener("touchmove",touchMove,{passive:false});
      window.addEventListener("keydown",keyDown);
      disposals.push(()=>{
        window.removeEventListener("wheel",wheel);window.removeEventListener("touchstart",touchStart);
        window.removeEventListener("touchmove",touchMove);window.removeEventListener("keydown",keyDown);
      });
      const vector = new THREE.Vector3();
      const render = (now: number) => {
        if (disposed) return;
        raf = requestAnimationFrame(render);
        if (document.hidden) return;
        const target=scrollChapter();
        if(!motion) motion=new ScrollMotion(target);
        const position=motion.update(target,now,reduceMotion);
        const progress = position/(CHAPTERS.length-1);
        if (progress === previous && previousReduced === reduceMotion) return;
        previous = progress; previousReduced = reduceMotion;
        const active = Math.round(position);
        const local = position-Math.floor(position);
        const proximity = Math.abs(position-active);
        const fade = Math.max(0,Math.min(1,(.12-proximity)/.12));
        const visibility = reduceMotion ? 1 : fade*fade*(3-2*fade);
        const item = CHAPTERS[active];
        const entries = item.segment >= 0 ? DETAILS[item.segment] : [];
        const selection = String(active);
        if (selection !== selected) {
          selected = selection; setChapter(active);
          highlight(item.segment);
          previous = -1; // Nach dem React-Textwechsel die neue Beschriftungsgröße berücksichtigen.
        }
        timeline.seek((reduceMotion ? active : position)*1000);
        mount.style.opacity="1";
        group.rotation.set(pose.rx,pose.ry,pose.rz);
        const intro = Math.max(0,1-position/.8);
        group.position.set(mobile ? 0 : pose.x*viewHeight*width/height, mobile ? viewHeight*.17-46*intro : pose.y, 0);
        const mobileScale=.5*Math.min(1,Math.max(.72,(height-420)/240));
        group.scale.setScalar(pose.scale*(mobile ? mobileScale+(.82-mobileScale)*intro : .85+.15*intro));
        const context=reduceMotion?0:Math.pow(Math.sin(local*Math.PI),4)*.32;
        const focusIndex=Math.max(0,Math.min(4,position-1));
        nodes.forEach(({node},index) => {
          // Zwischen den Rastpunkten entfaltet sich die Baugruppe; am Rastpunkt bleibt das Fokussegment.
          const amount=Math.max(pose[`s${index}`]??0,context);
          node.visible=amount>.006;
          node.scale.setScalar(Math.max(.001,amount));
          node.position.z=(mesh.segmente[index].mitte-51.65)*pose.assembly+(index-focusIndex)*(1-amount)*66;
        });
        group.updateMatrixWorld(true);
        const projected: Point[] = [];
        if(item.segment>=0 && visibility>=.001) {
          const {node,outline}=nodes[item.segment];
          for(const point of outline){
            vector.copy(point); node.localToWorld(vector); vector.project(camera);
            projected.push({x:(vector.x+1)*width/2,y:(1-vector.y)*height/2});
          }
        }
        const hull=convexHull(projected);
        renderer.render(scene,camera);
        element.style.setProperty("--hm-model-x", `${mobile ? 50 : 50+pose.x*100}%`);
        if (copy.current) { copy.current.style.opacity=String(visibility); copy.current.style.transform=`translateY(${(1-visibility)*(local<.5?-10:10)}px)`; }
        if (progressBar.current) progressBar.current.style.transform=`scaleX(${progress})`;
        const placed: Rect[] = [];
        badges.current.forEach((badge, index) => {
          const entry = entries[index], line = lines.current[index], dot = dots.current[index];
          if (!badge || !line || !dot) return;
          badge.style.opacity = String(entry ? visibility : 0);
          badge.style.visibility = entry ? "visible" : "hidden";
          line.style.opacity = String(entry ? visibility*.65 : 0);
          dot.style.opacity = String(entry ? visibility : 0);
          if (!entry || visibility<.001) return;
          const featureColor=css.getPropertyValue(FEATURE_TOKENS[entry.kind]).trim();
          badge.style.setProperty("--hm-feature",featureColor);
          line.style.stroke=featureColor; dot.style.fill=featureColor;
          vector.set(entry.point[0],entry.point[1],entry.point[2]-mesh.segmente[item.segment].mitte);
          nodes[item.segment].node.localToWorld(vector); vector.project(camera);
          const x=(vector.x+1)*width/2, y=(1-vector.y)*height/2;
          const w=badge.offsetWidth, h=badge.offsetHeight;
          const minX=mobile?12:(item.side==="right"?width*.035:width*.52);
          const maxX=mobile?width-12:(item.side==="right"?width*.48:width*.965);
          const minY=mobile?76:100, maxY=height*(mobile?.55:.87);
          const placement=placeAnnotation({x,y},{w,h},{x:minX,y:minY,w:maxX-minX,h:maxY-minY},hull,placed);
          if(!placement){
            badge.style.visibility="hidden"; line.style.opacity="0"; dot.style.opacity="0";
            return;
          }
          const {x:labelX,y:labelY}=placement;
          placed.push(placement);
          badge.style.left=`${labelX}px`; badge.style.top=`${labelY}px`;
          let anchorX=Math.max(labelX,Math.min(labelX+w,x));
          let anchorY=Math.max(labelY,Math.min(labelY+h,y));
          if(x>=labelX && x<=labelX+w && y>=labelY && y<=labelY+h){
            const edges=[{d:x-labelX,x:labelX,y},{d:labelX+w-x,x:labelX+w,y},{d:y-labelY,x,y:labelY},{d:labelY+h-y,x,y:labelY+h}];
            const nearest=edges.sort((a,b)=>a.d-b.d)[0]; anchorX=nearest.x; anchorY=nearest.y;
          }
          // Kurze direkte Verbindung statt langer rechtwinkliger Verweislinien.
          line.setAttribute("d",`M ${x} ${y} L ${anchorX} ${anchorY}`);
          dot.setAttribute("cx",String(x)); dot.setAttribute("cy",String(y));
        });
      };
      setStatus("ready"); raf=requestAnimationFrame(render);
    })().catch((error: unknown) => {
      clean();
      if (!disposed && !(error instanceof DOMException && error.name === "AbortError")) setStatus("error");
    });
    return () => { disposed=true; abort.abort(); preference.removeEventListener("change",changePreference); clean(); };
  },[attempt]);

  return <div className="hm-page"><style>{CSS}</style>
    <section className="hm" id="entdecken" ref={root} data-side={current.side} data-kind={current.kind} data-ready={status === "ready"}>
      <div className="hm-stage">
        <header className="hm-header"><a href="#entdecken" className="hm-logo" onClick={e=>{e.preventDefault();jump(0);}}>vinyos<span>quote</span></a><nav aria-label="Hauptnavigation"><button onClick={()=>jump(2)}>So funktioniert es</button><a href="#preise">Preise</a></nav><div className="hm-header-actions"><a href={LOGIN_URL} className="hm-login">Anmelden</a><a className="hm-cta hm-cta-small" href={SIGNUP_URL}>Kostenlos testen <span>↗</span></a></div></header>
        <div className="hm-floor" aria-hidden="true" />
        <div className="hm-scene" ref={host} role="img" aria-label={current.segment >= 0 ? `Hero Teil 2: ${mesh.segmente[current.segment].name}. ${details.map(d=>`${d.label}: ${d.value}`).join(". ")}` : "Hero Teil 2: vollständige Flanschbuchse"} />
        <svg className="hm-leader" aria-hidden="true">{[0,1,2].map(i=><g key={i}><path ref={el=>{lines.current[i]=el;}}/><circle ref={el=>{dots.current[i]=el;}} r="2.5"/></g>)}</svg>
        {[0,1,2].map(i=><div className="hm-detail hm-attribute hm-local-detail" key={i} ref={el=>{badges.current[i]=el;}} data-kind={details[i]?.kind} aria-hidden="true"><span>{details[i]?.label}</span><strong>{details[i]?.value}</strong><small>{details[i]?.note}</small></div>)}
        <div className="hm-copy" ref={copy}>
          <div className="hm-eyebrow">{current.eyebrow}</div>
          {chapter===0 ? <h1>{current.title.split("\n").map((t,i)=><span key={i}>{t}{i===0?" ":""}</span>)}</h1> : <h2>{current.title.split("\n").map((t,i)=><span key={i}>{t}{i===0?" ":""}</span>)}</h2>}
          {current.body && <p className="hm-body">{current.body}</p>}
          {current.kind==="problem" && <div className="hm-comparison"><div className="hm-comparison-head"><span>Heute, von Hand</span><span>Mit Vinyos Quote</span></div>{[["Erfahrung und Bauchgefühl","Regelbasiert und konsistent"],["Anfragen stapeln sich","Geometrie automatisch auswerten"],["Aufwand auch ohne Auftrag","Weniger manuelle Kalkulation"]].map(([before,after])=><div className="hm-comparison-row" key={before}><span className="hm-comparison-before">{before}</span><span className="hm-comparison-after"><i aria-hidden="true">+</i>{after}</span></div>)}</div>}
          {current.kind==="process" && <ol className="hm-process"><li><b>01</b><div><strong>Parallel analysieren</strong><span>STEP und PDF werden gleichzeitig ausgewertet.</span></div></li><li><b>02</b><div><strong>Modell zusammenführen</strong><span>Features und Segmente erhalten die passende Toleranz und Oberfläche.</span></div></li><li><b>03</b><div><strong>Prüfen und kalkulieren</strong><span>Sie prüfen das Ergebnis und kalkulieren den Preis mit einem Klick.</span></div></li></ol>}
          {current.kind==="precision" && <div className="hm-document"><div><span>PDF + STEP</span><strong>Toleranzen und Oberflächen in Geometrie eingefügt.</strong></div><div className="hm-document-values"><span>Oberfläche <b>Ra 1,6</b></span><span>Toleranz <b>ISO 2768-mK</b></span></div><DrawingExplorer /></div>}
          {current.kind==="calculation" && <div className="hm-costs">{["Maschinenzeit und Rüsten","Material und Rohteil","Qualitätssicherung und Nachbehandlung","Gemeinkosten und Marge"].map((text,i)=><div key={text}><span>{String(i+1).padStart(2,"0")}</span>{text}<i>✓</i></div>)}</div>}
          {current.kind==="features" && <div className="hm-features">{["Eigene Maschinen und Stundensätze","Kundennormen per PDF-Import","Mengenstaffeln und Angebots-PDF","Gemeinsame Anfragen im Team"].map(t=><span key={t}><i>✓</i>{t}</span>)}</div>}
          {current.kind==="trial" && <div className="hm-trial"><a href={SIGNUP_URL} className="hm-cta">Kostenlos testen <span>↗</span></a><small>7 Tage · 25 Anfragen kostenlos</small></div>}
        </div>
        {status!=="ready" && <div className="hm-status" role="status">{status==="loading" ? "Modell wird geladen …" : <><p>Das Modell konnte nicht geladen werden.</p><button onClick={()=>setAttempt(a=>a+1)}>Erneut versuchen</button></>}</div>}
        <footer className="hm-footer"><span className="hm-scroll">{reduced?"Reduzierte Bewegung":"Scrollen Sie zum Entdecken"}<i>↓</i></span><nav aria-label="Animationsabschnitte">{CHAPTERS.map((c,i)=><button key={c.label} aria-label={c.label} aria-current={chapter===i?"step":undefined} onClick={()=>jump(i)}><span>{String(i+1).padStart(2,"0")}</span><i/></button>)}</nav><span className="hm-example">{chapter===0?"HERO TEIL 2":"BEISPIELAUSWERTUNG"}</span></footer>
        <div className="hm-progress"><div ref={progressBar}/></div>
      </div>
    </section>{children}
  </div>;
}
