import { getDatabase } from '@netlify/database';
export type Standing={id:string;nickname:string;score:number;ticks:number;rank:number;finished_at:string};
let database: ReturnType<typeof getDatabase> | undefined;
export function motorwayDB(){return database ??= getDatabase();}
// Calendar weeks start Monday in Mobile; timestamptz handles CST/CDT correctly.
export const RANK_SQL=`WITH best AS (
 SELECT DISTINCT ON (player_hash) id,player_hash,nickname,score,ticks,finished_at
 FROM motorway_runs WHERE finished_at IS NOT NULL AND hidden=false AND season=$1
 AND ($2='season' OR finished_at >= (date_trunc('week', now() AT TIME ZONE 'America/Chicago') AT TIME ZONE 'America/Chicago'))
 ORDER BY player_hash,score DESC,ticks ASC,finished_at ASC,id ASC
), ranked AS (
 SELECT *,row_number() OVER (ORDER BY score DESC,ticks ASC,finished_at ASC,id ASC)::int AS rank,count(*) OVER ()::int AS total FROM best
) SELECT id,nickname,score,ticks,rank,finished_at,player_hash,total FROM ranked WHERE rank<=25 OR player_hash=$3 OR rank=(SELECT rank-1 FROM ranked WHERE player_hash=$3) ORDER BY rank`;
export async function rankings(season:number, period:string, playerHash?:string){
 const {rows}: {rows: Array<Standing & {player_hash: string; total: number}>}=await motorwayDB().pool.query(RANK_SQL,[season,period==='season'?'season':'week',playerHash||'']);
 const mine=rows.find((row)=>row.player_hash===playerHash);
 const publicRow=(r:Standing):Standing=>({id:r.id,nickname:r.nickname,score:r.score,ticks:r.ticks,rank:r.rank,finished_at:r.finished_at});
 return {period:period==='season'?'season':'week',season,total:rows[0]?.total||0,entries:rows.filter(r=>r.rank<=25).map(publicRow),personal:mine?publicRow(mine):null,next:mine&&mine.rank>1?publicRow(rows.find(r=>r.rank===mine.rank-1)!):null};
}
