CREATE TABLE users (
                       id UUID PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE jobs (
                      id UUID PRIMARY KEY,
                      user_id UUID NOT NULL REFERENCES users(id),
                      name VARCHAR(255) NOT NULL,
                      status VARCHAR(50) NOT NULL,
                      target_url VARCHAR(1024) NOT NULL,
                      http_method VARCHAR(10) NOT NULL,
                      headers JSONB NOT NULL,
                      payload TEXT,
                      schedule_type VARCHAR(50) NOT NULL,
                      cron_expression VARCHAR(100),
                      timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
                      next_execution_at TIMESTAMP WITH TIME ZONE,
                      max_retries INTEGER NOT NULL DEFAULT 3
);

CREATE TABLE workers (
                         id VARCHAR PRIMARY KEY,
                         status VARCHAR NOT NULL,
                         last_heartbeat TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE job_executions(
                               id UUID PRIMARY KEY,
                               job_id UUID NOT NULL REFERENCES jobs(id),
                               status VARCHAR NOT NULL,
                               scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
                               started_at TIMESTAMP WITH TIME ZONE,
                               completed_at TIMESTAMP WITH TIME ZONE,
                               worker_id VARCHAR REFERENCES workers(id),
                               lease_expiry_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE job_attempts(
                             id UUID PRIMARY KEY ,
                             execution_id UUID NOT NULL REFERENCES job_executions(id),
                             attempt_number INTEGER NOT NULL,
                             started_at TIMESTAMP WITH TIME ZONE,
                             ended_at TIMESTAMP WITH TIME ZONE,
                             http_status_code INTEGER,
                             response_body TEXT,
                             failure_reason TEXT
);


CREATE TABLE outbox_events(
                              id UUID PRIMARY KEY,
                              aggregate_type VARCHAR,
                              aggregate_id VARCHAR,
                              type VARCHAR,
                              payload JSONB,
                              created_at TIMESTAMP DEFAULT NOW(),
                              processed BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_jobs_next_exec ON jobs (next_execution_at) WHERE status = 'ACTIVE';
CREATE INDEX idx_outbox_events ON outbox_events(created_at) where processed = false;
CREATE INDEX idx_job_executions on job_executions(scheduled_for) WHERE status = 'QUEUED';