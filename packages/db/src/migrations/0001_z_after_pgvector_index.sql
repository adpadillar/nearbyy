CREATE INDEX ON files USING hnsw ((embedding::vector(1536)) vector_l2_ops);
