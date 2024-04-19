CREATE INDEX ON chunks USING hnsw ((embedding::vector(256)) vector_l2_ops);
