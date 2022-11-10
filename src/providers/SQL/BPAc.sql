  SELECT 
   cbo,
   idade,
   sum(quantidade),
   procedimento_sus
	FROM public.vw_bpac
  where data_registro between '#startDate 00:00:00' and '#endDate 23:59:59.999999'
  group by 1,2,4