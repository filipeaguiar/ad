SELECT
  count(distinct (log.user_id)) questions,
  TO_CHAR (log.timestamp, 'YYYY-MM') AS "yearMonth" -- Formato Ano-Mês
FROM
  recent_views log
GROUP BY
  "yearMonth"
ORDER BY
  "yearMonth" asc,
  questions desc
