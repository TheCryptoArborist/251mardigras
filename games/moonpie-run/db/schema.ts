import {sqliteTable,text,integer,real,index} from 'drizzle-orm/sqlite-core';
export const visitorProfiles=sqliteTable('visitor_profiles',{
 tokenHash:text('token_hash').primaryKey(),userId:text('user_id').notNull().unique(),createdAt:integer('created_at').notNull(),expiresAt:integer('expires_at').notNull()
});
export const players=sqliteTable('players',{
 userId:text('user_id').primaryKey(),username:text('username').notNull(),usernameKey:text('username_key').notNull().unique(),createdAt:integer('created_at').notNull(),updatedAt:integer('updated_at').notNull()
});
export const runs=sqliteTable('runs',{
 id:text('id').primaryKey(),userId:text('user_id').notNull(),startedAt:integer('started_at').notNull(),finishedAt:integer('finished_at'),payloadDigest:text('payload_digest'),rulesVersion:text('rules_version').notNull().default('1.6')
},t=>[index('runs_user_started').on(t.userId,t.startedAt)]);
export const completedRuns=sqliteTable('completed_runs',{
 runId:text('run_id').primaryKey().references(()=>runs.id),userId:text('user_id').notNull().references(()=>players.userId),score:integer('score').notNull(),clearedRoutes:integer('cleared_routes').notNull(),livesLost:integer('lives_lost').notNull(),won:integer('won').notNull(),activeSeconds:real('active_seconds').notNull(),finishedAt:integer('finished_at').notNull(),payloadJson:text('payload_json').notNull()
},t=>[index('completed_user_score').on(t.userId,t.score)]);
export const playerStats=sqliteTable('player_stats',{
 userId:text('user_id').primaryKey().references(()=>players.userId),coins:integer('coins').notNull().default(0),pies:integer('pies').notNull().default(0),ghosts:integer('ghosts').notNull().default(0),bonuses:integer('bonuses').notNull().default(0),routes:integer('routes').notNull().default(0),wins:integer('wins').notNull().default(0),perfectWins:integer('perfect_wins').notNull().default(0),maxChain:integer('max_chain').notNull().default(0),bestScore:integer('best_score').notNull().default(0),runs:integer('runs').notNull().default(0)
});
