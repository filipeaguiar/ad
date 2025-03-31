SELECT
  usr.email,
  CASE
    WHEN usr.first_name IS NOT NULL THEN CONCAT (usr.first_name, ' ', usr.last_name)
    ELSE usr.email
  END as user_name,
  TO_CHAR (log.timestamp, 'YYYY-MM') AS month, -- Formato Ano-Mês
  COUNT(*) AS total_views
FROM
  recent_views log
  LEFT JOIN core_user usr ON log.user_id = usr.id
GROUP BY
  usr.id, -- Agrupa pelo ID do usuário
  TO_CHAR (log.timestamp, 'YYYY-MM') -- Agrupa pelo mês formatado
ORDER BY
  month desc,
  total_views DESC;
