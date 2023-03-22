select  
	CAST(solicitacao as int) as solicitacao
	,material 
	,germe 
	,dh_liberacao
	,STRING_AGG(droga, ' / ') as drogas 

from consulta_its_periodo('2023-01-01 00:00:00', CURRENT_DATE) 
  
where ris = 'R' 
  
group by  
	solicitacao 
	,material 
	,germe 
	,dh_liberacao