import { pgTable, text, integer, jsonb, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  plan: text('plan').default('free'),
  scansUsed: integer('scans_used').default(0),
  scansLimit: integer('scans_limit').default(3),
  isOPT: boolean('is_opt').default(false),
  targetRole: text('target_role'),
  targetIndustry: text('target_industry'),
  targetSalary: integer('target_salary'),
  workAuthorization: text('work_authorization'),
  isAdmin: boolean('is_admin').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const resumes = pgTable('resumes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type').notNull(),
  rawText: text('raw_text').notNull(),
  parsedSections: jsonb('parsed_sections'),
  wordCount: integer('word_count'),
  pageCount: integer('page_count'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

export const scans = pgTable('scans', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  resumeId: uuid('resume_id').references(() => resumes.id).notNull(),
  jobDescription: text('job_description'),
  targetRole: text('target_role'),
  targetCompany: text('target_company'),
  targetIndustry: text('target_industry'),

  atsScore: integer('ats_score'),
  keywordScore: integer('keyword_score'),
  redFlagScore: integer('red_flag_score'),
  impactScore: integer('impact_score'),
  readabilityScore: integer('readability_score'),

  biasRiskScore: integer('bias_risk_score'),
  aiDetectionScore: integer('ai_detection_score'),
  optVisaScore: integer('opt_visa_score'),
  salaryPositionScore: integer('salary_position_score'),
  trajectoryScore: integer('trajectory_score'),

  ghostJobScore: integer('ghost_job_score'),
  ghostJobAnalysis: jsonb('ghost_job_analysis'),

  overallScore: integer('overall_score'),

  atsAnalysis: jsonb('ats_analysis'),
  keywordAnalysis: jsonb('keyword_analysis'),
  redFlagAnalysis: jsonb('red_flag_analysis'),
  impactAnalysis: jsonb('impact_analysis'),
  readabilityAnalysis: jsonb('readability_analysis'),
  biasAnalysis: jsonb('bias_analysis'),
  aiDetectionAnalysis: jsonb('ai_detection_analysis'),
  optVisaAnalysis: jsonb('opt_visa_analysis'),
  salaryAnalysis: jsonb('salary_analysis'),
  trajectoryAnalysis: jsonb('trajectory_analysis'),

  status: text('status').default('pending'),
  processingTime: integer('processing_time'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const bulletRewrites = pgTable('bullet_rewrites', {
  id: uuid('id').primaryKey().defaultRandom(),
  scanId: uuid('scan_id').references(() => scans.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  originalBullet: text('original_bullet').notNull(),
  rewrittenBullet: text('rewritten_bullet').notNull(),
  scoreGain: integer('score_gain'),
  wasAccepted: boolean('was_accepted').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userEvents = pgTable('user_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  event: text('event').notNull(),
  properties: jsonb('properties'),
  createdAt: timestamp('created_at').defaultNow(),
});
