-- name: ListParishioners :many
SELECT * FROM parishioners
ORDER BY name;

-- name: GetParishioner :one
SELECT * FROM parishioners
WHERE id = ?;

-- name: DeleteParishioner :exec
DELETE FROM parishioners
WHERE id = ?;

-- name: CreateParishioner :execresult
INSERT INTO parishioners (
  name, city, email, is_registered, members
) VALUES (
  ?, ?, ?, ?, ?
);

-- name: UpdateParishioner :exec
UPDATE parishioners
SET name = ?,
  city = ?,
  email = ?,
  is_registered = ?,
  members = ?
WHERE id = ?;