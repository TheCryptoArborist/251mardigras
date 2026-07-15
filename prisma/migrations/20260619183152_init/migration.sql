-- CreateTable
CREATE TABLE "sources" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "check_interval_minutes" INTEGER NOT NULL DEFAULT 360,
    "last_checked_at" DATETIME,
    "last_success_at" DATETIME,
    "last_error" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "snapshots" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source_id" INTEGER NOT NULL,
    "checked_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_code" INTEGER,
    "content_hash" TEXT NOT NULL,
    "normalized_text" TEXT NOT NULL,
    "raw_html_or_json" TEXT,
    CONSTRAINT "snapshots_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "changes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source_id" INTEGER NOT NULL,
    "detected_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "change_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT,
    "diff_text" TEXT,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "changes_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "resources" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "source" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "last_seen_at" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "resource_snapshots" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source_url" TEXT NOT NULL,
    "checked_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "raw_text" TEXT NOT NULL,
    "content_hash" TEXT NOT NULL,
    "extracted_json" TEXT
);

-- CreateTable
CREATE TABLE "weather_snapshots" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "checked_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "source" TEXT NOT NULL,
    "temperature" REAL,
    "wind_speed" TEXT,
    "wind_gust" TEXT,
    "wind_direction" TEXT,
    "precipitation_probability" INTEGER,
    "short_forecast" TEXT,
    "detailed_forecast" TEXT,
    "raw_json" TEXT,
    "content_hash" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "weather_alerts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alert_id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "severity" TEXT,
    "urgency" TEXT,
    "certainty" TEXT,
    "headline" TEXT,
    "description" TEXT,
    "instruction" TEXT,
    "area_desc" TEXT,
    "effective" DATETIME,
    "expires" DATETIME,
    "ends" DATETIME,
    "source" TEXT NOT NULL,
    "raw_json" TEXT,
    "first_seen_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "weather_risk_scores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parade_id" INTEGER,
    "calculated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "risk_level" TEXT NOT NULL,
    "risk_score" INTEGER NOT NULL,
    "rain_score" INTEGER NOT NULL,
    "lightning_score" INTEGER NOT NULL,
    "wind_score" INTEGER NOT NULL,
    "heat_score" INTEGER NOT NULL,
    "cold_score" INTEGER NOT NULL,
    "flood_score" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "recommended_public_message" TEXT NOT NULL,
    CONSTRAINT "weather_risk_scores_parade_id_fkey" FOREIGN KEY ("parade_id") REFERENCES "parades" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "parades" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "start_time" TEXT,
    "route_name" TEXT,
    "route_url" TEXT,
    "source_url" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "last_updated_at" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "sources_url_key" ON "sources"("url");

-- CreateIndex
CREATE INDEX "snapshots_source_id_checked_at_idx" ON "snapshots"("source_id", "checked_at");

-- CreateIndex
CREATE INDEX "changes_source_id_detected_at_idx" ON "changes"("source_id", "detected_at");

-- CreateIndex
CREATE INDEX "changes_severity_acknowledged_idx" ON "changes"("severity", "acknowledged");

-- CreateIndex
CREATE INDEX "resources_category_sort_order_idx" ON "resources"("category", "sort_order");

-- CreateIndex
CREATE INDEX "resource_snapshots_source_url_checked_at_idx" ON "resource_snapshots"("source_url", "checked_at");

-- CreateIndex
CREATE INDEX "weather_snapshots_checked_at_idx" ON "weather_snapshots"("checked_at");

-- CreateIndex
CREATE UNIQUE INDEX "weather_alerts_alert_id_key" ON "weather_alerts"("alert_id");

-- CreateIndex
CREATE INDEX "weather_alerts_active_event_idx" ON "weather_alerts"("active", "event");

-- CreateIndex
CREATE INDEX "weather_risk_scores_parade_id_calculated_at_idx" ON "weather_risk_scores"("parade_id", "calculated_at");

-- CreateIndex
CREATE INDEX "parades_date_start_time_idx" ON "parades"("date", "start_time");
