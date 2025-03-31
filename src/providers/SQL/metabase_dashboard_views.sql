SELECT
  count(*) AS count,
  dash.name,
  TO_CHAR (viw.timestamp, 'YYYY-MM') AS month
FROM
  recent_views viw
  LEFT JOIN report_dashboard dash ON viw.model_id = dash.id
WHERE
  dash.archived = FALSE
  AND viw.model IN ('dashboard', 'card')
GROUP BY
  dash.name,
  MONTH
ORDER BY
  MONTH DESC,
  count DESC
