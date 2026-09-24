export type Point = { x: number; y: number };
export type Rect = Point & { w: number; h: number };

const cross = (a: Point, b: Point, c: Point) => (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);

// Die projizierte Hülle schließt auch Fasen und abgewandte Kanten sicher ein.
export function convexHull(points: Point[]): Point[] {
  const sorted = [...points].sort((a,b)=>a.x-b.x||a.y-b.y);
  const half = (list: Point[]) => {
    const result: Point[] = [];
    for (const point of list) {
      while (result.length > 1 && cross(result[result.length-2],result[result.length-1],point)<=0) result.pop();
      result.push(point);
    }
    return result.slice(0,-1);
  };
  return [...half(sorted),...half([...sorted].reverse())];
}

function modelCollision(hull: Point[], gap = 12): (rect: Rect)=>boolean {
  if (!hull.length) return ()=>false;
  const axes: Point[] = [{x:1,y:0},{x:0,y:1}];
  hull.forEach((point,i)=>{const next=hull[(i+1)%hull.length];axes.push({x:point.y-next.y,y:next.x-point.x});});
  // Projektionen einmal vorbereiten, statt sie für jede mögliche Box neu zu berechnen.
  const projections=axes.map(axis=>{
    let min=Infinity,max=-Infinity;
    for(const point of hull){const value=point.x*axis.x+point.y*axis.y;min=Math.min(min,value);max=Math.max(max,value);}
    return {...axis,min,max};
  });
  return rect=>projections.every(axis=>{
    const center=(rect.x+rect.w/2)*axis.x+(rect.y+rect.h/2)*axis.y;
    const radius=Math.abs(axis.x)*(rect.w/2+gap)+Math.abs(axis.y)*(rect.h/2+gap);
    return axis.max>center-radius && center+radius>axis.min;
  });
}

export const intersectsModel=(rect: Rect,hull: Point[],gap=12)=>modelCollision(hull,gap)(rect);

export function placeAnnotation(anchor: Point, size: {w:number;h:number}, area: Rect, hull: Point[], placed: Rect[]): Rect | null {
  let best: Rect | null = null, score=Infinity;
  const collides=modelCollision(hull);
  const clamp=(value:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,value));
  const xs=[area.x,area.x+area.w-size.w,anchor.x-size.w-14,anchor.x+14,anchor.x-size.w/2];
  const ys=[area.y,area.y+area.h-size.h,anchor.y-size.h/2];
  for(let x=area.x;x<=area.x+area.w-size.w;x+=20) xs.push(x);
  for(let y=area.y;y<=area.y+area.h-size.h;y+=16) ys.push(y);
  for(const x of xs) for(const y of ys){
    const rect={x:clamp(x,area.x,area.x+area.w-size.w),y:clamp(y,area.y,area.y+area.h-size.h),...size};
    if(collides(rect)||placed.some(other=>rect.x<other.x+other.w+10&&rect.x+rect.w>other.x-10&&rect.y<other.y+other.h+10&&rect.y+rect.h>other.y-10)) continue;
    const dx=anchor.x-clamp(anchor.x,rect.x,rect.x+rect.w),dy=anchor.y-clamp(anchor.y,rect.y,rect.y+rect.h);
    const distance=Math.hypot(dx,dy)+Math.hypot(anchor.x-rect.x-rect.w/2,anchor.y-rect.y-rect.h/2)*.12;
    if(distance<score){best=rect;score=distance;}
  }
  return best;
}
