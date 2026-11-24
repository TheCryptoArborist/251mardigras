export const EMPTY_STATS={coins:0,pies:0,ghosts:0,bonuses:0,routes:0,wins:0,perfectWins:0,maxChain:0,bestScore:0,runs:0};
export const BADGES=[
 {id:'first_throw',name:'First Throw',description:'Collect your first doubloon.',metric:'coins',target:1,icon:'coin'},
 {id:'dauphin_collector',name:'Dauphin Collector',description:'Collect 100 doubloons across your runs.',metric:'coins',target:100,icon:'coins'},
 {id:'doubloon_royalty',name:'Doubloon Royalty',description:'Collect 1,000 doubloons.',metric:'coins',target:1000,icon:'crown'},
 {id:'moonpie_moment',name:'MoonPie Moment',description:'Collect your first MoonPie.',metric:'pies',target:1,icon:'pie'},
 {id:'sweet_tooth',name:'Sweet Tooth',description:'Collect 25 MoonPies.',metric:'pies',target:25,icon:'pie'},
 {id:'ghost_catcher',name:'Ghost Catcher',description:'Catch your first frightened ghost.',metric:'ghosts',target:1,icon:'ghost'},
 {id:'phantom_dauphin',name:'Phantom of Dauphin',description:'Catch 50 frightened ghosts.',metric:'ghosts',target:50,icon:'ghost'},
 {id:'street_sweep',name:'Sweep the Street',description:'Catch four ghosts during one MoonPie power.',metric:'maxChain',target:4,icon:'spark'},
 {id:'golden_catch',name:'Golden Catch',description:'Collect a bonus golden doubloon.',metric:'bonuses',target:1,icon:'star'},
 {id:'parade_starter',name:'Parade Starter',description:'Clear your first parade route.',metric:'routes',target:1,icon:'flag'},
 {id:'port_city_royalty',name:'Port City Royalty',description:'Clear all three routes in one run.',metric:'wins',target:1,icon:'crown'},
 {id:'untouchable',name:'Untouchable Royalty',description:'Clear all three routes without losing a life.',metric:'perfectWins',target:1,icon:'shield'}
];
export function badgeProgress(stats={}){return BADGES.map(b=>({...b,value:Math.min(b.target,Math.max(0,Number(stats[b.metric])||0)),earned:(Number(stats[b.metric])||0)>=b.target}));}
export function combineStats(base={},run=null){const s={...EMPTY_STATS,...base};if(!run)return s;for(const k of ['coins','pies','ghosts','bonuses','routes'])s[k]+=run[k]||0;s.maxChain=Math.max(s.maxChain,run.maxChain||0);s.bestScore=Math.max(s.bestScore,run.score||0);if(run.won){s.wins++;if(!run.livesLost)s.perfectWins++;}return s;}
