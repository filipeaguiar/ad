import { Request, Response } from "express"
import MaterialMasterProvider from "../providers/MaterialMasterProvider"
import MaterialAGHUProvider from "../providers/MaterialAGHUProvider"

interface Material {
  "codigo": number,
  "nome": string,
  "OPME?": string,
  "Valor Unitário": number,
  "Cod Master": string //No AGHU o código master é uma string e não um número
}

interface MaterialMaster {
  "Cod Master": number,
  "Valor Unitário": number
}

export default class MaterialEstoqueController {

  static async getMaterialEstoque(req: Request, res: Response) {
    try {

      const master: MaterialMaster[] = await MaterialMasterProvider.getMaterial()
      console.log(master)

      const aghu: Material[] = await MaterialAGHUProvider.getMaterial()
      // Caso o item seja OPME, o valor unitário será o valor unitário do master
      const result = aghu.map((item) => {
        const masterItem = master.find((masterItem) => masterItem["Cod Master"] === parseInt(item["Cod Master"]))
        if (item["OPME?"] === "Sim") {
          console.log(item["Cod Master"])
          console.log(masterItem)
          return {
            "codigo": item.codigo,
            "nome": item.nome,
            "OPME?": item["OPME?"],
            "Valor Unitário": masterItem ? masterItem["Valor Unitário"] : item["Valor Unitário"],
            "Cod Master": item["Cod Master"]
          }
        } else {
          return {
            "codigo": item.codigo,
            "nome": item.nome,
            "OPME?": item["OPME?"],
            "Valor Unitário": item["Valor Unitário"],
            "Cod Master": item["Cod Master"]
          }
        }
      })
      res.send(result)
    } catch (err) {
      res.status(500).send
    }
  }
}
