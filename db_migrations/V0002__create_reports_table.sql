CREATE TABLE t_p59349480_metabolic_plate_cour.reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    user_name TEXT,
    user_email TEXT,
    file_key TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    admin_comment TEXT,
    commented_at TIMESTAMP WITH TIME ZONE
);