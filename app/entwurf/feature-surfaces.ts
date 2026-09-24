// Die CAD-Tessellierung teilt keine Eckpunkte zwischen unterschiedlichen Flächen.
// Zusammenhangskomponenten erhalten daher jeweils eine einheitliche Merkmalfarbe.
// Maße und Achsen: docs/hero-teil-2/segmente/VY-DEMO-04-S1.step bis S5.step.
export type Feature = "bohrung" | "flaeche" | "nut" | "gewinde" | "fraesen" | "tasche";
export const FEATURE_TOKENS: Record<Feature, string> = {
  bohrung: "--hm-bore-metal", flaeche: "--hm-surface-metal",
  gewinde: "--hm-thread-metal", nut: "--hm-relief-metal",
  tasche: "--hm-relief-metal", fraesen: "--hm-surface-metal",
};

type Point = { x:number; y:number; z:number; nx:number; ny:number; nz:number };
export function classifyFace(segment:number, points:Point[]): Feature | null {
  const all=(fn:(p:Point)=>boolean)=>points.every(fn);
  const near=(a:number,b:number)=>Math.abs(a-b)<.025;
  const radius=(p:Point)=>Math.hypot(p.x,p.y);
  const axial=all(p=>Math.abs(p.nz)>.99);
  const wall=all(p=>Math.abs(p.nz)<.02);
  const low=Math.min(...points.map(p=>p.z)), high=Math.max(...points.map(p=>p.z));
  if(segment===0){
    for(const [cx,cy] of [[22.5,0],[-22.5,0],[0,22.5],[0,-22.5]]){
      const r=(p:Point)=>Math.hypot(p.x-cx,p.y-cy);
      // Bohrungswand, zylindrische Senkung, deren Boden und Eingangsfase.
      if(wall && (all(p=>near(r(p),2.067)) || all(p=>near(r(p),4)))) return "bohrung";
      if(axial && near(low,1.5) && all(p=>r(p)<4.025)) return "bohrung";
      if(high<.23 && all(p=>r(p)>=3.97&&r(p)<=4.23)) return "bohrung";
    }
    // Vier Taschenböden und deren Wände/Radien. R3 ist keine Bohrung.
    if(axial && near(low,6) && all(p=>radius(p)>18.9)) return "tasche";
    if(low>=.45 && high<=6.55 && wall){
      if(all(p=>near(radius(p),29))) return "tasche";
      for(const [cx,cy] of [[24.243509,9.394267],[9.394267,24.243509]]){
        for(const sx of [-1,1]) for(const sy of [-1,1]){
          if(all(p=>near(Math.hypot(p.x-cx*sx,p.y-cy*sy),3))) return "tasche";
        }
      }
    }
  }
  if(segment===1){
    if(all(p=>near(Math.hypot(p.y,p.z-45),4)) || all(p=>near(Math.hypot(p.x,p.z-45),4))) return "bohrung";
    if(wall && all(p=>near(radius(p),28.25))) return "flaeche";
  }
  if(segment===2){
    if(low>=69.97&&high<=74.03 || low>=61.97&&high<=64.13) return "nut";
  }
  if(segment===3 && wall && all(p=>near(radius(p),24))) return "flaeche";
  if(segment===4){
    if(wall && all(p=>near(radius(p),17))) return "gewinde";
    if(low>=101.77 && all(p=>radius(p)>22.45 && Math.abs(p.nz)>.5 && Math.abs(p.nz)<.9)) return "fraesen";
  }
  return null;
}

export function featureVertices(segment:number, middle:number, positions:ArrayLike<number>, normals:ArrayLike<number>, indices:ArrayLike<number>): (Feature | null)[] {
  const count=Math.floor(positions.length/3), parent=Array.from({length:count},(_,i)=>i);
  const root=(i:number):number=>parent[i]===i?i:(parent[i]=root(parent[i]));
  for(let i=0;i<indices.length;i+=3){
    parent[root(indices[i+1])]=root(indices[i]);
    parent[root(indices[i+2])]=root(indices[i]);
  }
  const groups=new Map<number,number[]>();
  for(let i=0;i<count;i++){const r=root(i);if(!groups.has(r))groups.set(r,[]);groups.get(r)!.push(i);}
  const result:(Feature|null)[]=Array(count).fill(null);
  for(const ids of groups.values()){
    if(ids.length<3)continue;
    const points=ids.map(i=>({x:positions[i*3],y:positions[i*3+1],z:positions[i*3+2]+middle,nx:normals[i*3],ny:normals[i*3+1],nz:normals[i*3+2]}));
    const feature=classifyFace(segment,points);
    for(const i of ids)result[i]=feature;
  }
  return result;
}
